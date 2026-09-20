export function normalizarHabilidade(habilidade) {
  return String(habilidade ?? "").trim().toLocaleLowerCase("pt-BR");
}

export function normalizarHabilidades(habilidades = []) {
  return [...new Set(habilidades.map(normalizarHabilidade).filter(Boolean))];
}

export class Vaga {
  constructor({ id, titulo, empresa, descricao, habilidades = [] }) {
    this.id = id;
    this.titulo = titulo;
    this.empresa = empresa;
    this.descricao = descricao;
    this.habilidades = normalizarHabilidades(habilidades);
  }

  obterClassificacao(percentual) {
    if (percentual >= 80) return "Alta";
    if (percentual >= 50) return "Média";
    return "Baixa";
  }

  calcularCompatibilidade(habilidadesCandidato = []) {
    const habilidadesNormalizadas = normalizarHabilidades(habilidadesCandidato);
    const encontradas = this.habilidades.filter((habilidade) =>
      habilidadesNormalizadas.includes(habilidade),
    );
    const faltantes = this.habilidades.filter(
      (habilidade) => !habilidadesNormalizadas.includes(habilidade),
    );
    const percentual = this.habilidades.length
      ? Math.round((encontradas.length / this.habilidades.length) * 100)
      : 0;

    return {
      vagaId: this.id,
      percentual,
      classificacao: this.obterClassificacao(percentual),
      encontradas,
      faltantes,
    };
  }
}

export class VagaFrontEnd extends Vaga {}

export function analisarVagas(vagas, habilidades, aoAnalisar = () => {}) {
  return vagas.map((vaga) => {
    const resultado = vaga.calcularCompatibilidade(habilidades);
    aoAnalisar(resultado);
    return resultado;
  });
}

export function criarContadorAnalises() {
  let total = 0;

  return function incrementar() {
    total += 1;
    return total;
  };
}

export function encontrarMelhorVaga(resultados = []) {
  if (resultados.length === 0) return null;

  return resultados.reduce((melhor, atual) =>
    atual.percentual > melhor.percentual ? atual : melhor,
  );
}

export function gerarRecomendacao(melhorResultado) {
  if (!melhorResultado) {
    return "Preencha seu perfil para receber uma recomendação de estudos.";
  }

  if (melhorResultado.faltantes.length === 0) {
    return "Você já possui todas as habilidades exigidas. Prepare seu portfólio e candidate-se!";
  }

  const lista = melhorResultado.faltantes.join(", ");
  return `Priorize os estudos em: ${lista}. Assim você se aproxima dos requisitos da vaga mais compatível.`;
}
