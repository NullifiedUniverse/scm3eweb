const fs = require('fs');
const path = require('path');

const photoDir = '/Users/null/Downloads/Photo';
const appFilePath = 'App.jsx';

// Function to convert image to base64
function toBase64(filePath) {
  const file = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
  return `data:${mimeType};base64,${file.toString('base64')}`;
}

// Map of folder to department (not strictly needed if we match by name, but helpful)
const folderMap = {
  'Activities': 'Activities',
  'Administrative & Financial': 'Sec & Treas',
  'Equipment': 'Equipment',
  'IT': 'IT',
  'Leadership': 'Presidential',
  'Public Relations': 'PR',
  'Student Right': 'Student Rights'
};

// Read all images
const images = {};
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg')) {
      // Clean up filename for matching
      // e.g., "Candice Wu _ 吳家萱.png" -> "Candice Wu 吳家萱"
      const cleanName = file.replace(/\.png$|\.jpg$/i, '').replace(/ _ /g, ' ').replace(/\s+/g, ' ').trim();
      images[cleanName] = toBase64(fullPath);
      console.log(`Processed: ${cleanName}`);
    }
  }
}

walkDir(photoDir);

// Read App.jsx
let content = fs.readFileSync(appFilePath, 'utf8');

// Match member names and inject base64
// Example: { id: "mem-p1", type: "member", name: "Noah Dok 曾子銘", ... image: "" }
// We want to find the entry with the name and update its image field.

// This is a bit complex with regex because of the structure, 
// so we'll do a simple replacement for each member found.

const memberRegex = /\{ id: "(mem-[^"]+)", type: "member", name: "([^"]+)",[\s\S]*?image: "" \}/g;

content = content.replace(memberRegex, (match, id, name) => {
  // Try to find a match in our images map
  // We need to handle cases like "Richard Ayres" vs "Richard"
  let base64 = "";
  
  // Direct match
  if (images[name]) {
    base64 = images[name];
  } else {
    // Try partial matches or specific overrides
    const firstName = name.split(' ')[0];
    const chineseName = name.match(/[\u4e00-\u9fa5]+/)?.[0];
    
    for (const imgName of Object.keys(images)) {
      if (imgName.includes(firstName) && (chineseName ? imgName.includes(chineseName) : true)) {
        base64 = images[imgName];
        break;
      }
    }
  }

  if (base64) {
    console.log(`Injecting image for: ${name}`);
    return match.replace('image: ""', `image: "${base64}"`);
  }
  
  return match;
});

fs.writeFileSync(appFilePath, content);
console.log('App.jsx updated successfully.');
