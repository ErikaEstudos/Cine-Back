const express = require("express");
const router = express.Router();
const {
  listarUsuarios,
  criarUsuario,
  deletarUsuario,
  atualizarUsuario,
  loginUsuario,
  atualizarSenhaUsuario,
  salvarAvaliacaoFilme,
  atualizarAvaliacaoFilme,
  buscarAvaliacaoPorFilmeUsuario,
  listarAvaliacoesDoUsuario,
  deletarAvaliacaoFilme,
} = require("../controllers/usuarioControllers");

router.get("/", listarUsuarios);
router.post("/", criarUsuario);
router.post("/login", loginUsuario);
router.delete("/:id", deletarUsuario);
router.put("/:id", atualizarUsuario);
router.put("/:id/senha", atualizarSenhaUsuario);
router.post("/avaliacoes", salvarAvaliacaoFilme);
router.put("/avaliacoes/:id", atualizarAvaliacaoFilme);
router.get("/avaliacoes", buscarAvaliacaoPorFilmeUsuario); // Nova rota para buscar avaliações
router.get("/avaliacoes/usuario/:usuarioId", listarAvaliacoesDoUsuario); // Nova rota
router.delete("/avaliacoes/:id", deletarAvaliacaoFilme); // Nova rota para deletar

module.exports = router;
