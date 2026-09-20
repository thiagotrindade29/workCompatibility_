const formulario = document.querySelector("#formulario-perfil");
const mensagem = document.querySelector("#mensagem");
const resumo = document.querySelector("#resumo-candidato");
const listaVagas = document.querySelector("#lista-vagas");
const recomendacao = document.querySelector("#texto-recomendacao");
const botaoLimpar = document.querySelector("#limpar-perfil");

function criarListaHabilidades(titulo, habilidades, classe) {
  const grupo = document.createElement("div");
  const rotulo = document.createElement("strong");
  const lista = document.createElement("ul");
  grupo.className = "habilidades-grupo";
  lista.className = `habilidades ${classe}`;
  rotulo.textContent = titulo;
  (habilidades.length ? habilidades : ["nenhuma"]).forEach((habilidade) => {
    const item = document.createElement("li");
    item.textContent = habilidade;
    lista.append(item);
  });
  grupo.append(rotulo, lista);
  return grupo;
}

export function obterElementosFormulario() {
  return {
    formulario,
    nome: formulario.elements.nome,
    area: formulario.elements.area,
    experiencia: formulario.elements.experiencia,
    habilidades: formulario.elements.habilidades,
    botaoLimpar,
  };
}

export function exibirMensagem(texto, tipo = "informacao") {
  mensagem.textContent = texto;
  mensagem.className = texto ? `mensagem mensagem--${tipo}` : "mensagem";
}

export function preencherFormulario(perfil) {
  formulario.elements.nome.value = perfil.nome ?? "";
  formulario.elements.area.value = perfil.area ?? "";
  formulario.elements.experiencia.value = perfil.experiencia ?? "";
  formulario.elements.habilidades.value = (perfil.habilidades ?? []).join(", ");
}

export function renderizarResumo(perfil, totalAnalises) {
  resumo.replaceChildren();
  const titulo = document.createElement("h3");
  const detalhes = document.createElement("p");
  const habilidades = document.createElement("p");
  const contador = document.createElement("p");
  titulo.textContent = perfil.nome;
  detalhes.textContent = `${perfil.area} • ${perfil.experiencia}`;
  habilidades.textContent = `Habilidades: ${perfil.habilidades.join(", ")}`;
  contador.textContent = `${totalAnalises} vagas analisadas nesta sessão.`;
  contador.className = "texto-secundario";
  resumo.append(titulo, detalhes, habilidades, contador);
}

export function criarCardVaga(vaga, resultado, melhorVagaId) {
  const artigo = document.createElement("article");
  const titulo = document.createElement("h3");
  const empresa = document.createElement("p");
  const descricao = document.createElement("p");
  const compatibilidade = document.createElement("p");
  artigo.className = "vaga-card";
  if (vaga.id === melhorVagaId) {
    artigo.classList.add("vaga-card--melhor");
    const selo = document.createElement("span");
    selo.className = "selo";
    selo.textContent = "Melhor combinação";
    artigo.append(selo);
  }
  titulo.textContent = vaga.titulo;
  empresa.textContent = vaga.empresa;
  empresa.className = "vaga-card__empresa";
  descricao.textContent = vaga.descricao;
  const classe = resultado.classificacao.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  compatibilidade.className = `compatibilidade compatibilidade--${classe}`;
  compatibilidade.textContent = `${resultado.percentual}% • Compatibilidade ${resultado.classificacao.toLowerCase()}`;
  artigo.append(
    titulo,
    empresa,
    descricao,
    compatibilidade,
    criarListaHabilidades("Você já possui", resultado.encontradas, "habilidades--encontradas"),
    criarListaHabilidades("Falta desenvolver", resultado.faltantes, "habilidades--faltantes"),
  );
  return artigo;
}

export function renderizarVagas(vagas, resultados, melhorResultado) {
  listaVagas.replaceChildren();
  vagas.forEach((vaga, indice) => {
    listaVagas.append(criarCardVaga(vaga, resultados[indice], melhorResultado?.vagaId));
  });
}

export function renderizarRecomendacao(texto) {
  recomendacao.textContent = texto;
}

export function limparResultados() {
  resumo.replaceChildren();
  listaVagas.replaceChildren();
  recomendacao.textContent = "Envie o formulário para descobrir o melhor próximo passo.";
}
