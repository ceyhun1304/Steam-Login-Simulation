const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// JSON məlumatlarını qəbul etmək üçün
app.use(express.json());

// index.html və digər faylları localhost-dan açmaq üçün
app.use(express.static("."));

// Login simulyasiyasından gələn məlumat
app.post("/simulation", async (req, res) => {
  const {
    account,
    passwordLength,
    maskedPassword
  } = req.body;

  // Lazımi məlumatların gəlib-gəlmədiyini yoxlayırıq
  if (!account || !passwordLength || !maskedPassword) {
    return res.status(400).json({
      success: false,
      error: "Simulation data is incomplete"
    });
  }

  // Telegram-a göndəriləcək mesaj
  const message =
`=== LOGIN SIMULATION ===
Account: ${account}
Password: ${passwordLength}`;

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: message
        })
      }
    );

    if (!telegramResponse.ok) {
      throw new Error("Telegram mesajı göndərilə bilmədi.");
    }

    console.log("Telegram bildirişi göndərildi.");

    res.json({
      success: true
    });

  } catch (error) {
    console.error("Telegram xətası:", error.message);

    res.status(500).json({
      success: false,
      error: "Telegram notification failed"
    });
  }
});

// Serveri başladırıq
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
