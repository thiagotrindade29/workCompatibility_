export async function carregarVagas() {
  const resposta = await fetch("./assets/data/vagas.json");
  if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

  const dados = await resposta.json();
  if (!Array.isArray(dados)) throw new TypeError("O catálogo de vagas deve ser uma lista.");
  return dados;
}
