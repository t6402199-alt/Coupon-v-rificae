import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  Sparkles
} from "lucide-react";
import CouponForm from "./components/CouponForm";
import ContactForm from "./components/ContactForm";
import { ActivePage } from "./types";

const SUPPORTED_CARDS_SHOWCASE = [
  { name: "Amazon", logo: "📦", bg: "bg-orange-500/10 border-orange-500/30 text-orange-400" },
  { name: "PCS Mastercard", logo: "💳", bg: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
  { name: "Transcash", logo: "💸", bg: "bg-teal-500/10 border-teal-500/30 text-teal-400" },
  { name: "Neosurf", logo: "🌊", bg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" },
  { name: "Paysafecard", logo: "🔒", bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" },
  { name: "Google Play", logo: "🤖", bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
  { name: "App Store & iTunes", logo: "🍎", bg: "bg-pink-500/10 border-pink-500/30 text-pink-400" },
  { name: "Steam Card", logo: "🎮", bg: "bg-slate-400/10 border-slate-400/30 text-slate-300" }
];

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>("accueil");

  // Smooth scroll helper to element if available
  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentYear = new Date().getFullYear();

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-stretch text-slate-150 overflow-x-hidden selection:bg-indigo-500/35 selection:text-white">
      
      {/* BACKGROUND FLOATING PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-5 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-10 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-float-slower"></div>
        
        {/* Abstract animated spans in background */}
        <div className="absolute inset-0 opacity-40">
          <span className="absolute bottom-[-100px] left-[5%] w-[45px] h-[45px] bg-[#6c63ff]/5 border border-white/5 rounded-lg animate-float-slow" style={{ animationDelay: '0s', animationDuration: '25s' }}></span>
          <span className="absolute bottom-[-100px] left-[30%] w-[25px] h-[25px] bg-[#ff6584]/5 border border-white/5 rounded-full animate-float-slower" style={{ animationDelay: '3s', animationDuration: '18s' }}></span>
          <span className="absolute bottom-[-100px] left-[65%] w-[68px] h-[68px] bg-[#43e97b]/5 border border-white/5 rounded-xl animate-float-slow" style={{ animationDelay: '1s', animationDuration: '30s' }}></span>
          <span className="absolute bottom-[-100px] left-[85%] w-[35px] h-[35px] bg-indigo-500/5 border border-white/5 rounded-lg animate-float-slower" style={{ animationDelay: '5s', animationDuration: '22s' }}></span>
        </div>
      </div>

      {/* FIXED NAVBAR */}
      <nav className="sticky top-0 w-full z-45 bg-[#0b0c15]/90 border-b border-white/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Logo link / text */}
          <button 
            onClick={() => handleNavClick("accueil")}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-[#6c63ff] to-[#ff6584] rounded-xl flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-600/15">
              C
            </div>
            <div>
              <span className="font-extrabold text-[#f1f2f6] tracking-tight block text-xs sm:text-sm leading-none">CouponCheck</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 uppercase tracking-widest block mt-0.5">PRO SYSTEM</span>
            </div>
          </button>

          {/* Prominent Responsive Top Menu Navigation */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/80 border border-white/5 p-1 rounded-2xl">
            <button
              onClick={() => handleNavClick("accueil")}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 transform select-none cursor-pointer ${
                activePage === "accueil" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-102" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavClick("verification")}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 transform select-none cursor-pointer ${
                activePage === "verification" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-102" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Vérification
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 transform select-none cursor-pointer ${
                activePage === "contact" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-102" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Support
            </button>
          </div>

          {/* Secure indicator badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-semibold shrink-0">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            Sécurisé Actif
          </div>

        </div>
      </nav>

      {/* CORE VIEW LAYOUT CONTAINER */}
      <main className="flex-grow z-10">
        
        {/* VIEW 1: ACCUEIL */}
        {activePage === "accueil" && (
          <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            {/* GORGEOUS HERO SECTION */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold rounded-full text-xs uppercase tracking-wider shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Vérification Sécurisée de Recharge & Coupons
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none"
              >
                Vérifiez la validité de <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  vos Coupons en ligne
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-350 text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
              >
                Notre pôle d'audit vous propose un environnement de vérification hermétique permettant d'analyser vos codes d'activation en quelques instants.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-3 pt-2"
              >
                <button
                  onClick={() => scrollToElement("verification-home")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-indigo-600/15 transition cursor-pointer"
                >
                  Démarrer la vérification
                </button>
                <button
                  onClick={() => handleNavClick("contact")}
                  className="bg-black/30 hover:bg-black/50 text-slate-200 border border-white/10 font-bold text-xs py-3 px-6 rounded-xl transition cursor-pointer"
                >
                  Support Technique
                </button>
              </motion.div>

            </div>

            {/* PLATFORM STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl text-center space-y-1">
                <span className="block font-black text-2xl text-indigo-400">100%</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Confidentialité</span>
              </div>
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl text-center space-y-1">
                <span className="block font-black text-2xl text-pink-400">AES-256</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Technologie</span>
              </div>
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl text-center space-y-1">
                <span className="block font-black text-2xl text-emerald-400">&lt; 3 min</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Délai Diagnostic</span>
              </div>
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl text-center space-y-1">
                <span className="block font-black text-2xl text-amber-400">24h / 7j</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Disponibilité</span>
              </div>
            </div>

            {/* PRESTIGE BRANDS GRID CARDS SHOWCASE */}
            <div className="space-y-5 max-w-4xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">SUPPORT COMPLET</span>
                <h4 className="text-base font-bold text-white uppercase tracking-tight">Coupons & Cartes Cadeaux Pris en Charge</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SUPPORTED_CARDS_SHOWCASE.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => scrollToElement("verification-home")}
                    className={`p-4 border rounded-2xl flex items-center gap-3 transition cursor-pointer hover:bg-white/5 ${item.bg}`}
                  >
                    <span className="text-2xl">{item.logo}</span>
                    <span className="text-xs font-bold">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* THE CENTRAL VERIFICATION FORM ON HOME PAGE (Required) */}
            <div className="pt-8 border-t border-white/5" id="verification-home">
              <div className="text-center max-w-sm mx-auto space-y-1 mb-8">
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block">Console d'analyse</span>
                <h3 className="text-lg font-extrabold text-white">Vérification Instantanée</h3>
              </div>
              <CouponForm />
            </div>

          </div>
        )}

        {/* VIEW 2: VÉRIFICATION PAGE */}
        {activePage === "verification" && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <ShieldCheck className="w-12 h-12 text-indigo-400 mx-auto" />
              <h1 className="text-3xl font-black text-white tracking-tight uppercase">Module d'Audit Réseaux</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ce formulaire sécurisé est directement interconnecté avec les serveurs de vérification de nos partenaires financiers. Saisissez vos codes d'activation pour obtenir un certificat de conformité.
              </p>
            </div>
            
            <CouponForm />
          </div>
        )}

        {/* VIEW 3: CONTACT PAGE / SUPPORT */}
        {activePage === "contact" && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
              
              {/* Info panel */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Centre d'aide</span>
                  <h1 className="text-3xl font-black text-white leading-none">Contacter l'Assistance</h1>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Si votre recharge PCS, Transcash ou carte cadeau n'est pas acceptée par les commerçants officiels, notre équipe technique est disponible pour analyser le code source et remédier aux blocages réseau.
                  </p>
                </div>

                {/* Technical support coordinates */}
                <div className="space-y-4">
                  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-300">Horaires d'ouverture :</span>
                      <p className="text-xs text-slate-400">
                        Notre cellule technique assure une permanence 24h/24 et 7j/7 pour la gestion d'urgence des tickets d'activation.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Form panel */}
              <div className="lg:col-span-7">
                <ContactForm />
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER - CLEAN, LEGAL AND CONVENIENT */}
      <footer className="z-10 bg-[#07080d] border-t border-white/5 py-10 mt-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-tr from-[#6c63ff] to-[#ff6584] rounded-lg flex items-center justify-center font-black text-white text-xs">
              C
            </div>
            <span className="font-bold text-xs text-white">CouponCheck Pro &copy; {currentYear}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-500 font-medium select-none">
            <button onClick={() => handleNavClick("accueil")} className="hover:text-slate-300 transition">Accueil</button>
            <span>&bull;</span>
            <button onClick={() => handleNavClick("verification")} className="hover:text-slate-300 transition">Vérifier un code</button>
            <span>&bull;</span>
            <button onClick={() => handleNavClick("contact")} className="hover:text-slate-300 transition">Contacter le support</button>
          </div>

          <p className="text-[10px] text-slate-600 text-center sm:text-right">
            Connexions cryptées et auditées en temps réel par certificat SSL TLSv1.3.
          </p>
        </div>
      </footer>

    </div>
  );
}
