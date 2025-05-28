const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); //para conectar com MongoDB
require("dotenv").config();

const app = express(); //para criar o servidor
app.use(cors()); //para permitir requisição do frontend
app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}...`);
});
