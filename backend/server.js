const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); //para conectar com MongoDB
require("dotenv").config();
const path = require("path");

const app = express(); //para criar o servidor
app.use(cors()); //para permitir requisição do frontend
app.use(express.json());
app.use(express.static(path.join(__dirname, "html"))); // Middleware para servir arquivos estáticos

//conexão com MongoDB -- configuração
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => {
    console.log("Conexão com MongoDB Atlas com sucesso.");
  })
  .catch((erro) => {
    console.log("Erro na conexão", erro);
  });

// Rotas de API
const usuarioRouter = require("./routes/usuarioRoutes");
app.use("/usuarios", usuarioRouter);

//// Rota principal que carrega o HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando...");
});
