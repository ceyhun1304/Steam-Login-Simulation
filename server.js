const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/simulation", async (req, res) => {
  const { account, passwordLength } = req.body;

  if (!account || typeof passwordLength !== "number") {
    return res.status(400).json({
      success: false,
      error: "Simulation data is incomplete"
    });
  }

  const message =
`=== LOGIN SIMULATION ===
Account: ${account}
Password length: ${passwordLength}
Password: ********`;

  try {
    const response = await fetch(
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Telegram error:", errorText);

      return res.status(500).json({
        success: false,
        error: "Telegram notification failed"
      });
    }

    console.log("Telegram notification sent.");

    res.json({
      success: true
    });

  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
