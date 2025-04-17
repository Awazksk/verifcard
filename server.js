// Importe les modules nécessaires
require('dotenv').config(); // Charge les variables d'environnement
const express = require("express");
const nodemailer = require("nodemailer");

// Initialise l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Email depuis .env
    pass: process.env.EMAIL_PASSWORD // Mot de passe depuis .env
  }
});

// Route pour envoyer des emails
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    // Validation basique
    if (!to || !subject || !message) {
      return res.status(400).send("Paramètres manquants");
    }

    await transporter.sendMail({
      from: `"Mon Service" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: message
    });
    
    res.status(200).send("Email envoyé avec succès !");
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).send("Erreur lors de l'envoi de l'email");
  }
});

// Démarre le serveur
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));