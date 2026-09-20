const CHAVE_PERFIL = "skillmatch-perfil";

export async function carregarVagas() {
  const resposta = await fetch("./assets/data/vagas.json");
  if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

  const dados = await resposta.json();
  if (!Array.isArray(dados)) throw new TypeError("O catálogo de vagas deve ser uma lista.");
  return dados;
}

export function salvarPerfil(perfil) {
  localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}

export function recuperarPerfil() {
  const perfilSalvo = localStorage.getItem(CHAVE_PERFIL);
  if (perfilSalvo === null) return null;

  try {
    return JSON.parse(perfilSalvo);
  } catch (erro) {
    console.error("Perfil salvo inválido:", erro);
    localStorage.removeItem(CHAVE_PERFIL);
    return null;
  }
}

export function removerPerfil() {
  localStorage.removeItem(CHAVE_PERFIL);
}
