const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/simulation", (req, res) => {
  const { account, passwordLength } = req.body;

  if (!account || typeof passwordLength !== "number") {
    return res.status(400).json({
      success: false,
      error: "Simulation data is incomplete"
    });
  }

  console.log("=== LOGIN SIMULATION ===");
  console.log("Account:", account);
  console.log("Password length:", passwordLength);
  console.log("Password: ********");

  res.json({
    success: true
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
