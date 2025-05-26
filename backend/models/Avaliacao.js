const mongoose = require("mongoose");

const AvaliacaoShema = new mongoose.Schema({
  filme: {
    type: String,
    required: true,
  },
  estrelas: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comentario: {
    type: String,
    required: false, // O comentário pode ser opcional
  },
  dataAvaliacao: {
    type: Date,
    default: Date.now,
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

module.exports = mongoose.model("Avaliacao", AvaliacaoShema);
