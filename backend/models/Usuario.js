const mongoose = require("mongoose");
const { type } = require("os");

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
    unique: true,
  },
  dataAvaliacao: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
