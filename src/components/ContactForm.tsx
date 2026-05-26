import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Mail, 
  User, 
  MessageSquare, 
  Loader2,
  Clock,
  ShieldAlert
} from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nom.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Veuillez remplir tous les champs obligatoires du formulaire.");
      return;
    }

    setLoading(true);

    try {
      const resp = await fetch("https://formspree.io/f/mnjrgygw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          nom: formData.nom.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        })
      });

      if (resp.ok) {
        setSuccess(true);
        setFormData({
          nom: "",
          email: "",
          message: ""
        });
      } else {
        const errorData = await resp.json();
        setError(errorData.error || "Une erreur est survenue lors du dépôt de votre message.");
      }
    } catch (err) {
      setError("Erreur de connexion avec le centre d'assistance. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto" id="contact-form-root">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900/60 border border-indigo-500/25 rounded-3xl p-8 backdrop-blur-xl text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 bg-indigo-500/15 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">Message envoyé avec succès</h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
                Notre équipe de support a bien reçu votre ticket d'assistance. Nous vous répondrons par courriel dans les plus brefs délais à l'adresse fournie.
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                Délai de réponse moyen : moins d'une heure
              </div>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-md select-none transition"
              >
                Envoyer un nouveau message
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
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                Contact Support
              </h3>
              <p className="text-xs text-slate-400">
                Notre équipe vous répondra dans les plus brefs délais.
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* Message field */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                Votre message <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={8}
                placeholder=""
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium"
              />
            </div>

            {/* Error block */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs py-3 px-4 rounded-xl flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit ticket */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer border border-white/10 hover:border-white/20 hover:shadow-lg shadow-indigo-600/10 active:translate-y-0.5 transition flex items-center justify-center gap-2 select-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mise en ligne du message...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer le message au support
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
