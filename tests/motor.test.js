import test from "node:test";
import assert from "node:assert/strict";
import { VagaFrontEnd, analisarVagas, criarContadorAnalises, encontrarMelhorVaga, gerarRecomendacao, normalizarHabilidades } from "../assets/scripts/motor.js";

const criarVaga = (id = 1) => new VagaFrontEnd({ id, titulo:"Front-end", empresa:"Teste", descricao:"Teste", habilidades:["html","css","javascript","git"] });

test("normaliza, remove vazios e habilidades duplicadas", () => {
  assert.deepEqual(normalizarHabilidades([" HTML ","html","CSS",""]), ["html","css"]);
});
test("calcula compatibilidade parcial e separa habilidades", () => {
  assert.deepEqual(criarVaga().calcularCompatibilidade(["HTML"," javascript "]), { vagaId:1, percentual:50, classificacao:"Média", encontradas:["html","javascript"], faltantes:["css","git"] });
});
test("calcula zero e cem por cento", () => {
  assert.equal(criarVaga().calcularCompatibilidade(["python"]).percentual, 0);
  assert.equal(criarVaga().calcularCompatibilidade(["html","css","javascript","git"]).percentual, 100);
});
test("mantém a primeira vaga em caso de empate", () => {
  assert.equal(encontrarMelhorVaga([{ vagaId:1, percentual:50 },{ vagaId:2, percentual:50 }]).vagaId, 1);
});
test("callback e closure contam cada vaga analisada", () => {
  const incrementar = criarContadorAnalises(); let total = 0;
  analisarVagas([criarVaga(1),criarVaga(2)], ["html"], () => { total = incrementar(); });
  assert.equal(total, 2);
});
test("gera recomendação com as habilidades faltantes", () => {
  assert.match(gerarRecomendacao(criarVaga().calcularCompatibilidade(["html"])), /css, javascript, git/);
});
