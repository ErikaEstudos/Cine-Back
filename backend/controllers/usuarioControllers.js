const Usuario = require("../models/Usuario");
const Avaliacao = require("../models/Avaliacao");
const bcrypt = require("bcryptjs");

const listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.find(); //Busca todos os usuários
  res.json(usuarios);
};

const criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body; //Dados do novo usuário dentro do corpo

  try {
    //verificar se o email já existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensagem: "E-mail já cadastrado" });
    }
    //criptograr senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    //criar novo usuario com senha criptografada
    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaCriptografada,
    });

    await novoUsuario.save();

    res.status(201).json(novoUsuario);
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao criar usuário", erro });
  }
};

const deletarUsuario = async (req, res) => {
  const { id } = req.params; //Pega o id do usuário que vem como parâmetro
  await Usuario.findByIdAndDelete(id); //Acha o id e deleta o usuário
  res.json({ mensagem: "Usuário removido com sucesso" });
};

const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body; // Apenas nome e email

  try {
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      id,
      { nome, email },
      { new: true }
    );

    if (!usuarioAtualizado) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json(usuarioAtualizado);
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao atualizar usuário", erro });
  }
};

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    return res.status(400).json({ mensagem: "Usuário não encontrado" });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    return res.status(400).json({ mensagem: "Senha incorreta" });
  }

  // Retorna o usuário para o frontend
  res.json({ mensagem: "Login realizado com sucesso", usuario });
};

const atualizarSenhaUsuario = async (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    // Verifica se a senha atual está correta
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: "Senha atual incorreta." });
    }

    // Criptografa a nova senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

    // Atualiza a senha do usuário
    usuario.senha = senhaCriptografada;
    await usuario.save();

    res.json({ mensagem: "Senha alterada com sucesso." });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao alterar a senha.", erro });
  }
};

const buscarAvaliacaoPorFilmeUsuario = async (req, res) => {
  const { filme, usuarioId } = req.query;

  if (!filme || !usuarioId) {
    return res.status(400).json({
      mensagem: "Filme e usuarioId são obrigatórios para buscar a avaliação.",
    });
  }

  try {
    const avaliacao = await Avaliacao.findOne({ filme, usuarioId });
    res.json([avaliacao].filter(Boolean)); // Retorna um array com a avaliação (ou um array vazio se não existir)
  } catch (erro) {
    console.error("Erro ao buscar avaliação:", erro);
    res.status(500).json({ mensagem: "Erro ao buscar avaliação." });
  }
};

const salvarAvaliacaoFilme = async (req, res) => {
  console.log("Corpo da Requisição Recebido:", req.body); // ADICIONE ESTE LOG
  try {
    const { filme, estrelas, comentario, usuarioId } = req.body;

    if (!filme || !estrelas || !usuarioId) {
      return res
        .status(400)
        .json({ mensagem: "Filme e estrelas são obrigatórios." });
    }

    // Verificar se o usuário já avaliou este filme
    const avaliacaoExistente = await Avaliacao.findOne({ filme, usuarioId });

    if (avaliacaoExistente) {
      return res.status(409).json({
        mensagem: "Você já avaliou este filme. Edite sua avaliação existente.",
      });
    }

    const novaAvaliacao = new Avaliacao({
      filme: req.body.filme,
      estrelas: req.body.estrelas,
      comentario: req.body.comentario,
      usuarioId: req.body.usuarioId,
    });
    await novaAvaliacao.save();

    res.status(201).json({ mensagem: "Avaliação salva com sucesso!" });
  } catch (erro) {
    console.error("Erro ao salvar avaliação:", erro);
    res.status(500).json({ mensagem: "Erro ao salvar avaliação." });
  }
};

const atualizarAvaliacaoFilme = async (req, res) => {
  try {
    const { id } = req.params; // ID da avaliação
    const { estrelas, comentario, usuarioId } = req.body;

    const avaliacao = await Avaliacao.findById(id);

    if (!avaliacao) {
      return res.status(404).json({ mensagem: "Avaliação não encontrada." });
    }

    // Opcional: verificar se o usuarioId da requisição corresponde ao usuarioId da avaliação
    if (usuarioId && avaliacao.usuarioId.toString() !== usuarioId) {
      return res.status(403).json({
        mensagem: "Você não tem permissão para editar esta avaliação.",
      });
    }

    if (estrelas !== undefined) avaliacao.estrelas = estrelas;
    if (comentario !== undefined) avaliacao.comentario = comentario;

    await avaliacao.save();

    res.json({ mensagem: "Avaliação atualizada com sucesso!", avaliacao });
  } catch (erro) {
    console.error("Erro ao atualizar avaliação:", erro);
    res.status(500).json({ mensagem: "Erro ao atualizar avaliação." });
  }
};

const listarAvaliacoesDoUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const avaliacoes = await Avaliacao.find({ usuarioId }).sort({
      dataAvaliacao: -1,
    }); // Busca e ordena por data (mais recente primeiro)
    res.json(avaliacoes);
  } catch (erro) {
    console.error("Erro ao listar avaliações do usuário:", erro);
    res.status(500).json({ mensagem: "Erro ao listar avaliações do usuário." });
  }
};

const deletarAvaliacaoFilme = async (req, res) => {
  const { id } = req.params;

  try {
    const avaliacao = await Avaliacao.findByIdAndDelete(id);
    if (!avaliacao) {
      return res.status(404).json({ mensagem: "Avaliação não encontrada." });
    }
    res.json({ mensagem: "Avaliação removida com sucesso!" });
  } catch (erro) {
    console.error("Erro ao deletar avaliação:", erro);
    res.status(500).json({ mensagem: "Erro ao deletar avaliação." });
  }
};

module.exports = {
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
};
