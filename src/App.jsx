import { CMS, MEMBER_IMAGES } from "./cms_data";
import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Moon, Sun, X, Calendar, Users, Home, Info, ArrowRight, Star, Code, Languages } from "lucide-react";

// --- M3E MOTION PHYSICS ---
const M3_SPRING = { type: "spring", stiffness: 350, damping: 30, mass: 0.8 };
const QUICK_SPRING = { type: "spring", stiffness: 500, damping: 35 };
const BOUNCE_SPRING = { type: "spring", stiffness: 400, damping: 15 };
const SLOW_SPRING = { type: "spring", stiffness: 100, damping: 20 };

// --- M3E MATHEMATICAL SHAPE ENGINE ---
function getPath(type, w, h, seed = 0) {
  const points = 120;
  let path = "";
  const cx = w / 2;
  const cy = h / 2;
  const a = w / 2;
  const b = h / 2;

  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2;
    let r = 1;

    if (type === "blob") {
      r = 0.85 + 0.15 * Math.sin(t * 3 + seed);
    } else if (type === "cookie") {
      const sides = 6;
      r = 0.88 + 0.12 * Math.cos(t * sides + seed);
    } else if (type === "squircle") {
      const n = 3.8; 
      r = Math.pow(Math.pow(Math.abs(Math.cos(t)), n) + Math.pow(Math.abs(Math.sin(t)), n), -1/n) * 0.95;
    } else {
      r = 0.9 + 0.1 * Math.cos(t * 4 + seed);
    }

    const x = cx + r * a * Math.cos(t);
    const y = cy + r * b * Math.sin(t);
    if (i === 0) path += `M ${x} ${y} `;
    else path += `L ${x} ${y} `;
  }
  return path + "Z";
}

// --- ROBUST BILINGUAL ENGINE ---
const t = (content, lang) => {
  if (!content) return "";
  if (typeof content === 'object' && content !== null) {
    return content[lang] || content.EN || "";
  }
  return content;
};

const LangText = ({ content, lang, className = "", style = {}, inline = false }) => {
  const text = t(content, lang);
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={lang}
        initial={{ opacity: 0, y: 4, filter: "blur(4px)", scale: 0.98 }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        exit={{ opacity: 0, y: -4, filter: "blur(4px)", scale: 0.98, transition: { duration: 0.1 } }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={className}
        style={{ display: inline ? "inline-block" : "block", ...style }}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
};

// --- DEPARTMENT THEMES ---
const DEPTS = {
  "Presidential": { name: { EN: "Presidential", ZH: "學生會代表" }, light: "#fef08a", textLight: "#713f12", dark: "#422006", textDark: "#fde047", shape: "squircle" },
  "Activities": { name: { EN: "Activities", ZH: "活動部" }, light: "#fce7f3", textLight: "#831843", dark: "#500724", textDark: "#fbcfe8", shape: "cookie" },
  "Sec & Treas": { name: { EN: "Sec & Treas", ZH: "秘書與總務部" }, light: "#e0e7ff", textLight: "#312e81", dark: "#1e1b4b", textDark: "#c7d2fe", shape: "blob" },
  "Equipment": { name: { EN: "Equipment", ZH: "器材部" }, light: "#ffedd5", textLight: "#7c2d12", dark: "#431407", textDark: "#fed7aa", shape: "cookie" },
  "IT": { name: { EN: "IT", ZH: "資訊部" }, light: "#C2E7FF", textLight: "#001D35", dark: "#003458", textDark: "#79CBFF", shape: "squircle" },
  "PR": { name: { EN: "PR", ZH: "公關部" }, light: "#C4EFCD", textLight: "#00210E", dark: "#00391C", textDark: "#8ED99E", shape: "cookie" },
  "Student Rights": { name: { EN: "Student Rights", ZH: "學權部" }, light: "#FFDAD6", textLight: "#410002", dark: "#680005", textDark: "#FFB4AB", shape: "blob" },
};

// --- ANIMATED COMPONENTS ---

function HoverReveal({ darkMode, lang }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.a
      href="https://www.instagram.com/kcis_2steps_ahead/"
      target="_blank"
      rel="noreferrer"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileTap={{ scale: 0.98 }}
      animate={{
        borderRadius: hover ? "32px 8px 32px 32px" : "24px",
        backgroundColor: hover ? (darkMode ? "#1e293b" : "#0f172a") : (darkMode ? "#0f172a" : "#f1f5f9"),
      }}
      transition={QUICK_SPRING}
      className="relative p-6 cursor-pointer overflow-hidden shadow-sm flex items-center justify-between h-full w-full border border-transparent dark:border-slate-800"
    >
      <motion.div 
        animate={{ opacity: hover ? 1 : 0 }} 
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" 
      />
      <motion.span animate={{ color: hover ? "#f8fafc" : (darkMode ? "#f8fafc" : "#0f172a") }} className="font-bold z-10 text-lg flex-1">
        <LangText content={{ EN: "Official Instagram", ZH: "官方 Instagram" }} lang={lang} inline />
      </motion.span>
      <motion.div 
        animate={{ x: hover ? 0 : 20, opacity: hover ? 1 : 0, scale: hover ? 1 : 0.8, rotate: hover ? 0 : -45 }} 
        transition={BOUNCE_SPRING} 
        className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full text-white font-black shrink-0 z-10 shadow-lg shadow-blue-500/30"
      >
        →
      </motion.div>
    </motion.a>
  );
}

function ActionPill({ darkMode, lang }) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      layout
      onClick={() => setActive(!active)}
      initial={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      animate={{ borderRadius: active ? 16 : 32 }}
      transition={M3_SPRING}
      className={`relative h-14 cursor-pointer flex items-center justify-center overflow-hidden shadow-md mt-4 ${active ? "w-full bg-blue-600" : (darkMode ? "w-[160px] bg-slate-800" : "w-[160px] bg-blue-100")}`}
    >
      <motion.span layout="position" className={`font-bold whitespace-nowrap z-10 flex items-center gap-2 ${active ? "text-white" : (darkMode ? "text-blue-400" : "text-blue-700")}`}>
        <LangText content={active ? { EN: "Confirmed", ZH: "已確認" } : { EN: "Submit Proposal", ZH: "提交提案" }} lang={lang} inline />
      </motion.span>
    </motion.div>
  );
}

const MemberBlob = React.memo(({ member, activeItem, onClick, darkMode, lang, index }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [prankLag, setPrankLag] = useState(false);
  const [hovered, setHovered] = useState(false);
  const theme = DEPTS[member.dept];
  const isAndrew = member.name.includes("Andrew");
  const isLeader = member.role.EN.includes("Dir") || member.role.EN.includes("President") || member.role.EN.includes("Pres");
  const isTarget = member.id === "mem-p3";

  useEffect(() => {
    if (isTarget) setPrankLag(true);
  }, [isTarget]);

  const handleInteraction = () => {
    if (isTarget && prankLag) {
      if (Math.random() > 0.4) return; 
      setTimeout(() => onClick(member), Math.random() * 1500 + 800); 
    } else {
      onClick(member);
    }
  };

  const currentSpring = (isTarget && prankLag) ? { type: "spring", stiffness: 20, damping: 80 } : QUICK_SPRING;
  
  const bgColor = isAndrew ? (darkMode ? "#082f49" : "#0284c7") : (darkMode ? theme.dark : theme.light);
  const textColor = isAndrew ? (darkMode ? "#e0f2fe" : "#ffffff") : (darkMode ? theme.textDark : theme.textLight);
  const isExpanded = activeItem?.id === member.id;
  const imageUrl = MEMBER_IMAGES[member.id] || member.image;

  const paths = useMemo(() => [
    getPath(theme.shape, 100, 100, member.seed),
    getPath(theme.shape, 100, 100, member.seed + 1.5),
    getPath(theme.shape, 100, 100, member.seed + 3),
    getPath(theme.shape, 100, 100, member.seed)
  ], [theme.shape, member.seed]);
  
  return (
    <motion.div 
      layout="position"
      initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ ...QUICK_SPRING, delay: index * 0.05 }}
      className={`flex flex-col items-center gap-3 shrink-0 snap-center group relative w-36 ${isTarget ? 'cursor-wait' : 'cursor-pointer'}`}
      style={{ zIndex: isExpanded ? 100 : (isAndrew ? 20 : 1) }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: (isTarget && prankLag) ? -1 : -8, scale: (isTarget && prankLag) ? 1.02 : 1.05, rotate: (isTarget && prankLag) ? [0, 5, -5, 0] : 0 }}
      whileTap={{ scale: (isTarget && prankLag) ? 0.99 : 0.92 }}
      onClick={handleInteraction}
    >
      <motion.div layoutId={`card-${member.id}`} className="relative flex items-center justify-center w-28 h-28" style={{ borderRadius: 40, backgroundColor: "transparent" }}>
        {isAndrew && (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute -inset-2 rounded-[42px] border-[3px] border-cyan-400 border-dashed opacity-60 z-0 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] pointer-events-none" />
        )}
        <motion.div animate={{ opacity: isExpanded ? 0 : 1 }} transition={{ duration: isExpanded ? 0 : 0.2 }} className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible">
            <motion.path fill={bgColor} animate={{ d: paths }} transition={{ duration: hovered ? 3 : 8 + (member.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
            {imageUrl && !imgFailed && (
              <g transform="translate(4, 4) scale(0.92)">
                <clipPath id={`clip-img-${member.id}`}>
                  <motion.path animate={{ d: paths }} transition={{ duration: hovered ? 3 : 8 + (member.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
                </clipPath>
                <motion.image animate={{ y: hovered ? [-2, 2, -2] : 0 }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} href={imageUrl} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-img-${member.id})`} onError={() => setImgFailed(true)} />
              </g>
            )}
          </svg>
          <span className="absolute font-black text-3xl z-10" style={{ color: textColor, display: (imageUrl && !imgFailed) ? 'none' : 'block' }}>{member.name.charAt(0)}</span>
        </motion.div>
      </motion.div>
      
      <div className="text-center px-1 flex flex-col items-center w-full relative z-10 mt-1">
        <span className={`font-bold text-sm w-full text-center truncate cursor-default ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
          {member.name.split(" ")[0]}
        </span>
        <motion.div animate={{ scale: hovered ? 1.05 : 1 }} className="text-[10px] font-bold opacity-90 mt-1 px-3 py-1 rounded-full flex items-center justify-center gap-1.5 shadow-sm backdrop-blur-md transition-colors" style={{ backgroundColor: bgColor, color: textColor }}>
          {isAndrew ? <Code size={12} className="shrink-0" /> : (isLeader && <Star size={10} fill="currentColor" className="shrink-0" />)}
          <LangText content={member.role} lang={lang} className="truncate cursor-default whitespace-nowrap" inline={true} />
        </motion.div>
      </div>
    </motion.div>
  );
});

// --- FLAWLESS ZERO-RACING EXPANSION CARD ---
function ExpandedModal({ activeItem, setActiveItem, darkMode, lang }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [isCursed, setIsCursed] = useState(false);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const [curseStyle, setCurseStyle] = useState("");

  useEffect(() => {
    if (activeItem?.id === "mem-p3") {
      setIsCursed(true);
      setCurseStyle("w-[250%] -ml-[50%] tracking-[0.5em] break-all leading-[4rem] rotate-[3deg] scale-110 opacity-90 mix-blend-hard-light overflow-visible");
    } else {
      setIsCursed(false);
      setCurseStyle("");
      setBtnOffset({ x: 0, y: 0 });
    }
  }, [activeItem]);

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    if (isCursed && Math.random() > 0.15) {
      setBtnOffset({ x: (Math.random() - 0.5) * 600, y: (Math.random() - 0.5) * 600 });
      return;
    }
    setActiveItem(null);
  };

  const dodgeMouse = () => {
    if (isCursed && Math.random() > 0.3) {
      setBtnOffset({ x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400 });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => { 
      if (e.key === "Escape") {
        if (isCursed && Math.random() > 0.2) return; 
        handleClose(); 
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCursed]);

  const isMember = activeItem?.type === "member";
  const theme = isMember ? DEPTS[activeItem.dept] : null;
  const isAndrew = isMember && activeItem.name.includes("Andrew");
  
  const modalPaths = useMemo(() => isMember ? [
    getPath(theme.shape, 100, 100, activeItem.seed),
    getPath(theme.shape, 100, 100, activeItem.seed + 1.5),
    getPath(theme.shape, 100, 100, activeItem.seed + 3),
    getPath(theme.shape, 100, 100, activeItem.seed)
  ] : [], [isMember, theme, activeItem]);

  const bgColor = isAndrew ? (darkMode ? "#082f49" : "#0284c7") : (theme ? (darkMode ? theme.dark : theme.light) : (darkMode ? activeItem.colorDark : activeItem.colorLight));
  const textColor = isAndrew ? (darkMode ? "#e0f2fe" : "#ffffff") : (theme ? (darkMode ? theme.textDark : theme.textLight) : (darkMode ? activeItem.textDark : activeItem.textLight));
  const imageUrl = isMember ? (MEMBER_IMAGES[activeItem.id] || activeItem.image) : activeItem.image;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(12px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.15 } }} transition={{ duration: 0.4 }}
        className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-slate-950/80"
        onClick={(e) => {
          if (isCursed && Math.random() > 0.2) return;
          handleClose(e);
        }}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          layoutId={`card-${activeItem.id}`} 
          className={`w-full max-w-2xl h-[85vh] sm:h-[700px] shadow-2xl relative pointer-events-auto flex flex-col ${isCursed ? 'overflow-visible' : 'overflow-hidden'}`}
          style={{ backgroundColor: bgColor, borderRadius: 32 }} 
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
        >
          {isAndrew && (
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen"
              style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #0ff 2px, #0ff 4px)`, backgroundSize: "100% 4px" }}
              animate={{ backgroundPosition: ["0px 0px", "0px 100px"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}

          {imageUrl && !isMember && (
            <motion.div 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 right-0 w-full h-64 pointer-events-none mix-blend-overlay" 
              style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', maskImage: 'linear-gradient(to bottom, black, transparent)' }} 
            />
          )}

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, transition: { duration: 0 } }} 
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute inset-0 flex flex-col"
          >
            <div className="absolute top-5 sm:top-6 right-5 sm:right-6 z-20">
              <motion.button 
                animate={btnOffset} 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }} 
                onClick={handleClose} 
                onMouseEnter={dodgeMouse}
                className="p-3 rounded-full bg-black/10 dark:bg-white/20 hover:bg-black/20 dark:hover:bg-white/30 transition-all backdrop-blur-md" 
                style={{ color: textColor }}
              >
                <X size={20} strokeWidth={3} />
              </motion.button>
            </div>

            <div className={`overflow-y-auto hide-scrollbar z-10 flex-1 px-8 sm:px-10 pt-16 sm:pt-14 pb-8 cursor-default transition-all duration-700 ${curseStyle}`}>
              
              {isMember && imageUrl && !imgFailed && (
                 <motion.div 
                   initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                   animate={{ scale: 1, opacity: 1, rotate: 0 }}
                   transition={{ ...BOUNCE_SPRING, delay: 0.15 }}
                   className="w-24 h-24 sm:w-32 sm:h-32 mb-6 relative drop-shadow-md"
                 >
                   <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                     <motion.path fill={bgColor} animate={{ d: modalPaths }} transition={{ duration: 8 + (activeItem.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
                     <g transform="translate(3, 3) scale(0.94)">
                       <clipPath id={`modal-clip-img-${activeItem.id}`}>
                         <motion.path animate={{ d: modalPaths }} transition={{ duration: 8 + (activeItem.seed % 3), repeat: Infinity, ease: "easeInOut" }} />
                       </clipPath>
                       <image href={imageUrl} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clipPath={`url(#modal-clip-img-${activeItem.id})`} onError={() => setImgFailed(true)} />
                     </g>
                   </svg>
                 </motion.div>
              )}

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <LangText content={isMember ? { EN: `${activeItem.gen} • ${theme.name.EN}`, ZH: `${activeItem.gen}屆 • ${theme.name.ZH}` } : (activeItem.label || activeItem.date)} lang={lang} className="font-bold text-xs tracking-widest uppercase mb-3 block opacity-80" style={{ color: textColor }} />
                <LangText content={activeItem.title || activeItem.name} lang={lang} className={`text-4xl sm:text-5xl font-black mb-2 tracking-tighter leading-tight ${isAndrew ? 'drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : ''}`} style={{ color: textColor }} />
              </motion.div>
              
              {isMember && <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}><LangText content={activeItem.role} lang={lang} className="text-lg font-bold opacity-90 mb-8 block" style={{ color: textColor }} /></motion.div>}
              {!isMember && <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}><LangText content={activeItem.desc} lang={lang} className="text-lg leading-relaxed font-medium opacity-90 mt-6 block" style={{ color: textColor }} /></motion.div>}

              {isMember && (
                <div className="space-y-8 mt-6">
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2" style={{ color: textColor }}><Info size={16} /> <LangText content={{ EN: "About Me", ZH: "關於我" }} lang={lang} inline={true} /></h3>
                    <LangText content={activeItem.about} lang={lang} className="text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95 block" style={{ color: textColor }} />
                  </motion.div>
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.35, duration: 0.5 }} className="h-px w-full opacity-20 origin-center" style={{ backgroundColor: textColor }} />
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2" style={{ color: textColor }}><Users size={16} /> <LangText content={{ EN: "Expectation", ZH: "我的期望" }} lang={lang} inline={true} /></h3>
                    <LangText content={activeItem.expectation} lang={lang} className="text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95 block" style={{ color: textColor }} />
                  </motion.div>
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.45, duration: 0.5 }} className="h-px w-full opacity-20 origin-center" style={{ backgroundColor: textColor }} />
                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2" style={{ color: textColor }}><Calendar size={16} /> <LangText content={{ EN: "Responsibility", ZH: "我的職責" }} lang={lang} inline={true} /></h3>
                    <LangText content={activeItem.responsibility} lang={lang} className="text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap opacity-95 block" style={{ color: textColor }} />
                  </motion.div>
                </div>
              )}
              
              <motion.button 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                onClick={handleClose} onMouseEnter={dodgeMouse} className="w-full mt-10 py-4 rounded-full font-bold shadow-lg relative z-50" style={{ backgroundColor: textColor, color: bgColor }}>
                <LangText content={{ EN: "Close Details", ZH: "關閉詳細資訊" }} lang={lang} inline />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

// --- MAIN APPLICATION MOUNT ---
export default function App() {
  const [activeItem, setActiveItem] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("EN");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeGen, setActiveGen] = useState("7th");
  const [activeNav, setActiveNav] = useState("home");
  const [isManualScroll, setIsManualScroll] = useState(false);

  const trackEvent = (action, details = {}) => {
    const payload = {
      action,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      lang,
      theme: darkMode ? 'dark' : 'light',
      ...details
    };
    console.log("[Analytics Tracked]", payload);
  };

  useEffect(() => {
    const preventRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", preventRightClick);
    trackEvent("page_view", { path: window.location.pathname });
    return () => document.removeEventListener("contextmenu", preventRightClick);
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useLayoutEffect(() => {
    if (activeItem) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "auto";
    }
    return () => { 
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "auto"; 
    };
  }, [activeItem]);

  useEffect(() => {
    if (activeItem) {
      trackEvent("view_item", { id: activeItem.id, name: activeItem.name || activeItem.title?.EN, type: activeItem.type });
    }
  }, [activeItem]);

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll) return;
      const sections = ['home', 'events', 'council'];
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeNav !== section) setActiveNav(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeNav, isManualScroll]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      setIsManualScroll(true);
      window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
      setTimeout(() => setIsManualScroll(false), 800);
    }
  };

  const filteredMembers = useMemo(() => {
    let filtered = CMS.members.filter(m => m.gen === activeGen);
    if (activeFilter !== "All") filtered = filtered.filter(m => m.dept === activeFilter);
    return filtered;
  }, [activeFilter, activeGen]);

  return (
    <div className={`min-h-screen selection:bg-blue-300 transition-colors duration-700 relative z-0 overflow-x-hidden bg-transparent`}>
      
      {/* ORBS */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none -z-10">
        <motion.div animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[100px]" />
        <motion.div animate={{ x: [0, -100, 0], y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="fixed top-6 left-6 z-50 pointer-events-none">
        <img 
          src="https://web.kcislk.ntpc.edu.tw/wp-content/uploads/2023/07/KCISLK-logo-W.png" 
          alt="KCISLK Logo" 
          style={darkMode ? { filter: 'brightness(1) opacity(0.9)' } : undefined}
          className="h-8 sm:h-10 object-contain drop-shadow-sm transition-all duration-700" 
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="fixed top-6 right-6 z-40 flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <motion.button whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }} whileTap={{ scale: 0.9 }} onClick={() => { setLang(lang === "EN" ? "ZH" : "EN"); trackEvent("toggle_lang", { to: lang === "EN" ? "ZH" : "EN" }); }} className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors text-sm font-bold"><Languages size={16} />{lang}</motion.button>
        <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />
        <motion.button animate={{ rotate: darkMode ? 180 : 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} onClick={() => { setDarkMode(!darkMode); trackEvent("toggle_theme", { to: !darkMode ? "dark" : "light" }); }} className="p-2.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors mr-0.5">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</motion.button>
      </motion.div>

      <LayoutGroup>
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <motion.nav initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }} layout className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-full flex gap-1 shadow-2xl backdrop-blur-xl border border-slate-200/50 dark:border-white/10 pointer-events-auto">
            {[
              { id: 'home', icon: Home, label: { EN: 'Home', ZH: '首頁' } }, 
              { id: 'events', icon: Calendar, label: { EN: 'Events', ZH: '活動資訊' } }, 
              { id: 'council', icon: Users, label: { EN: 'Council', ZH: '學生會成員' } }
            ].map((nav) => {
              const isActive = activeNav === nav.id;
              return (
                <motion.button 
                  key={nav.id} layout whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => { scrollTo(nav.id); setActiveNav(nav.id); trackEvent("nav_click", { destination: nav.id }); }} 
                  className={`relative flex items-center justify-center h-12 rounded-full transition-colors z-10 overflow-hidden ${isActive ? 'text-blue-600 dark:text-blue-400 px-5 sm:px-6' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-4'}`}
                >
                  {isActive && <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full z-[-1]" transition={M3_SPRING} />}
                  <motion.div layout className="flex items-center overflow-hidden">
                    <nav.icon size={20} className={`shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.span key={lang} initial={{ opacity: 0, width: 0, paddingLeft: 0 }} animate={{ opacity: 1, width: "auto", paddingLeft: 8 }} exit={{ opacity: 0, width: 0, paddingLeft: 0 }} transition={M3_SPRING} className="text-xs uppercase tracking-widest font-bold whitespace-nowrap overflow-hidden">
                          {nav.label[lang]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>
              );
            })}
          </motion.nav>
        </div>

        <main className="max-w-6xl w-full mx-auto p-6 space-y-24 pt-32 md:pt-40 pb-40">
          
          <header id="home">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter drop-shadow-sm flex flex-wrap">
              {"KCISLK".split("").map((letter, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}>{letter}</motion.span>
              ))}
            </h1>
            <motion.div initial={{ opacity: 0, letterSpacing: "-0.05em" }} animate={{ opacity: 1, letterSpacing: "0.1em" }} transition={{ duration: 0.8, delay: 0.4 }}>
              <LangText content={{ EN: "Student Council Directory", ZH: "學生會成員指南" }} lang={lang} className="text-slate-500 dark:text-slate-400 font-bold uppercase text-sm flex items-center gap-2 mt-2" />
            </motion.div>
          </header>

          <section>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ position: 'relative', zIndex: activeItem?.id === CMS.hero.id ? 100 : 1 }}
            >
              <motion.div 
                layoutId={`card-${CMS.hero.id}`} 
                onClick={() => setActiveItem(CMS.hero)} 
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer relative overflow-hidden group shadow-xl shadow-blue-500/5 dark:shadow-blue-900/10" 
                style={{ backgroundColor: darkMode ? CMS.hero.colorDark : CMS.hero.colorLight, borderRadius: 32 }}
              >
                {CMS.hero.image && (
                  <motion.div 
                    initial={{ scale: 1, backgroundPosition: "0% 50%" }}
                    animate={{ scale: 1.05, backgroundPosition: "100% 50%" }}
                    transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                    className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none mix-blend-overlay" 
                    style={{ backgroundImage: `url(${CMS.hero.image})`, backgroundSize: 'cover', maskImage: 'linear-gradient(to right, transparent, black)' }} 
                  />
                )}
                <div className="p-8 sm:p-12 md:p-16 relative z-10 flex flex-col h-[22rem] justify-end pointer-events-none">
                  <LangText content={CMS.hero.label} lang={lang} className="font-black text-xs tracking-widest uppercase mb-3 opacity-80" style={{ color: darkMode ? CMS.hero.textDark : CMS.hero.textLight }} />
                  <LangText content={CMS.hero.title} lang={lang} className="text-4xl md:text-6xl font-black tracking-tighter leading-none" style={{ color: darkMode ? CMS.hero.textDark : CMS.hero.textLight }} />
                </div>
              </motion.div>
            </motion.div>
          </section>

          <section id="events">
            <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs mb-5 flex items-center gap-2 cursor-default">
              <Calendar size={14} /> <LangText content={{ EN: "Upcoming Events", ZH: "近期活動資訊" }} lang={lang} inline={true} />
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CMS.events.map((ev, index) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, ...BOUNCE_SPRING }}
                  style={{ position: 'relative', zIndex: activeItem?.id === ev.id ? 100 : 1 }}
                >
                  <motion.div 
                    layoutId={`card-${ev.id}`} 
                    whileHover={{ y: -8, boxShadow: "0px 10px 20px rgba(0,0,0,0.05)" }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveItem(ev)} 
                    className={`cursor-pointer overflow-hidden relative h-full ${darkMode ? 'shadow-md' : 'shadow-lg shadow-slate-200/50'}`} 
                    style={{ backgroundColor: darkMode ? ev.colorDark : ev.colorLight, color: darkMode ? ev.textDark : ev.textLight, borderRadius: 32 }}
                  >
                    {ev.image && (
                      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url(${ev.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    )}
                    <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between p-8 h-full gap-4 pointer-events-none relative z-10">
                      <div className="flex flex-col gap-2">
                        <span className="font-black text-sm opacity-70 leading-tight">{ev.date.replace(/ /g, "\n")}</span>
                        <LangText content={ev.title} lang={lang} className="font-black text-2xl tracking-tight" inline={true} />
                      </div>
                      <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-black opacity-80 self-start md:self-auto overflow-hidden" style={{ backgroundColor: darkMode ? ev.textDark : ev.textLight, color: darkMode ? ev.colorDark : ev.colorLight }}>
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="council" className="relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs flex items-center gap-2 cursor-default">
                <Users size={14} /> <LangText content={{ EN: "Council Directory", ZH: "學生會成員" }} lang={lang} inline={true} />
              </motion.h3>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-full backdrop-blur-sm z-10">
                {["7th", "8th"].map(gen => (
                  <motion.button key={gen} onClick={() => { setActiveGen(gen); trackEvent("filter_generation", { generation: gen }); }} className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeGen === gen ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
                    {activeGen === gen && <motion.div layoutId="gen-indicator" className="absolute inset-0 bg-white dark:bg-slate-700 rounded-full shadow-sm z-[-1]" transition={M3_SPRING} />}
                    <LangText content={{ EN: `${gen} Council`, ZH: `第 ${gen.replace('th', '')} 屆學生會` }} lang={lang} inline />
                  </motion.button>
                ))}
              </motion.div>
            </div>

            <div className="relative -mx-6 w-[calc(100%+3rem)]" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar px-6 sm:px-12 py-2">
                {["All", ...Object.keys(DEPTS)].map(dept => (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={dept} onClick={() => { setActiveFilter(dept); trackEvent("filter_department", { department: dept }); }} animate={{ rotate: activeFilter === dept ? [-1, 1, -1, 0] : 0 }} className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === dept ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md" : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50"}`}>
                    <LangText content={dept === "All" ? { EN: "All", ZH: "全部" } : DEPTS[dept].name} lang={lang} inline={true} />
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeFilter} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex gap-6 sm:gap-10 overflow-x-auto snap-x snap-mandatory py-12 px-6 sm:px-12 hide-scrollbar min-h-[280px]">
                  {filteredMembers.map((member, i) => (
                    <MemberBlob key={member.id} index={i} member={member} activeItem={activeItem} onClick={setActiveItem} darkMode={darkMode} lang={lang} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          <section>
            <motion.h3 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs mb-5 flex items-center gap-2 cursor-default">
              <Info size={14} /> <LangText content={{ EN: "Quick Actions", ZH: "快速操作" }} lang={lang} inline={true} />
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={BOUNCE_SPRING}
                whileHover={{ scale: 1.01 }}
                className={`relative p-8 rounded-[32px] shadow-sm border flex flex-col justify-center min-h-[200px] overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}
              >
                <h3 className={`font-bold mb-2 text-xl relative z-10 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                  <LangText content={{ EN: "New Proposal", ZH: "新提案" }} lang={lang} inline />
                </h3>
                <p className={`text-sm relative z-10 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  <LangText content={{ EN: "Submit your ideas for the upcoming winter gala directly to the council.", ZH: "將您對近期與未來活動的想法提意給我們吧。" }} lang={lang} />
                </p>
                <ActionPill darkMode={darkMode} lang={lang} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...BOUNCE_SPRING, delay: 0.1 }} className="h-full">
                <HoverReveal darkMode={darkMode} lang={lang} />
              </motion.div>
            </div>
          </section>

        </main>

        <AnimatePresence>
          {activeItem && <ExpandedModal activeItem={activeItem} setActiveItem={setActiveItem} darkMode={darkMode} lang={lang} />}
        </AnimatePresence>
      </LayoutGroup>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
