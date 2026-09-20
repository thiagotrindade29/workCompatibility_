import { carregarVagas, recuperarPerfil, removerPerfil, salvarPerfil } from "./dados.js";
import {
  VagaFrontEnd, analisarVagas, criarContadorAnalises, encontrarMelhorVaga,
  gerarRecomendacao, normalizarHabilidades,
} from "./motor.js";
import {
  exibirMensagem, limparResultados, obterElementosFormulario, preencherFormulario,
  renderizarRecomendacao, renderizarResumo, renderizarVagas,
} from "./ui.js";

const campos = obterElementosFormulario();
const incrementarAnalises = criarContadorAnalises();
let vagas = [];
let totalAnalises = 0;

function validarPerfil(perfil) {
  const validacoes = [
    [perfil.nome.length >= 2, campos.nome, "Informe um nome com pelo menos 2 caracteres."],
    [Boolean(perfil.area), campos.area, "Selecione sua área profissional."],
    [Boolean(perfil.experiencia), campos.experiencia, "Selecione seu nível de experiência."],
    [perfil.habilidades.length > 0, campos.habilidades, "Informe pelo menos uma habilidade."],
  ];
  const invalida = validacoes.find(([valida]) => !valida);
  if (!invalida) return true;
  exibirMensagem(invalida[2], "erro");
  invalida[1].focus();
  return false;
}

function lerPerfil() {
  return {
    nome: campos.nome.value.trim(),
    area: campos.area.value,
    experiencia: campos.experiencia.value,
    habilidades: normalizarHabilidades(campos.habilidades.value.split(",")),
  };
}

function analisarPerfil(perfil, deveSalvar = true) {
  const resultados = analisarVagas(vagas, perfil.habilidades, () => {
    totalAnalises = incrementarAnalises();
  });
  const melhorResultado = encontrarMelhorVaga(resultados);
  if (deveSalvar) salvarPerfil(perfil);
  renderizarResumo(perfil, totalAnalises);
  renderizarVagas(vagas, resultados, melhorResultado);
  renderizarRecomendacao(gerarRecomendacao(melhorResultado));
  exibirMensagem("Perfil analisado com sucesso!", "sucesso");
}

campos.formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const perfil = lerPerfil();
  if (validarPerfil(perfil)) analisarPerfil(perfil);
});

campos.botaoLimpar.addEventListener("click", () => {
  campos.formulario.reset();
  removerPerfil();
  limparResultados();
  exibirMensagem("Perfil removido.");
  campos.nome.focus();
});

async function iniciarAplicacao() {
  exibirMensagem("Carregando vagas...");
  campos.formulario.setAttribute("aria-busy", "true");
  try {
    const dados = await carregarVagas();
    if (dados.length === 0) {
      exibirMensagem("Nenhuma vaga encontrada.", "erro");
      return;
    }
    vagas = dados.map((vaga) => new VagaFrontEnd(vaga));
    const perfil = recuperarPerfil();
    if (perfil) {
      preencherFormulario(perfil);
      analisarPerfil(perfil, false);
      exibirMensagem("Seu perfil salvo foi restaurado.", "sucesso");
    } else {
      exibirMensagem(`${vagas.length} vagas disponíveis. Preencha seu perfil para começar.`);
    }
  } catch (erro) {
    console.error("Erro ao iniciar o SkillMatch:", erro);
    exibirMensagem("Não foi possível carregar as vagas. Tente novamente mais tarde.", "erro");
  } finally {
    campos.formulario.removeAttribute("aria-busy");
  }
}

iniciarAplicacao();
