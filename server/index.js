const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "040b86d079d1283fe317cc6bc123b8120cb9359cf8ba855c53b62530fc132be89680d884d0d014499a318aae84e328440f1f515ef1d336b6f1e7d21ee19ec8ed83": 100,
  "045760f3c3f0aa62a36fff1281ea9d7bd90e73ccff847fee26eb785db5572ecbf6d72dceb9858091d975d98f6797e85c0f266005fbeb0bc8cce0ccc6f639d4bbad": 50,
  "04bb8fc3a41a63380a747cfdab942b9db618f85d01bc29028a5eedf0beb0fa8ba36d85dee2c256db7b0b1e6fb09c18a6d3280073c6a097b255a5588374e7bcc013": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  // TODO : get signature from the client side
  // TODO : recover the public address from the signature

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
