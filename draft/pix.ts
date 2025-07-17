import axios from "axios";

type PixRecord = {
  VL_PagadorPF: number;
  VL_RecebedorPF: number;
  VL_PagadorPJ: number;
  VL_RecebedorPJ: number;
  QT_PagadorPF: number;
  QT_PagadorPJ: number;
  QT_RecebedorPF: number;
  QT_RecebedorPJ: number;
  QT_PES_PagadorPF: number;
  QT_PES_PagadorPJ: number;
  QT_PES_RecebedorPF: number;
  QT_PES_RecebedorPJ: number;
  Estado: string;
};

type AggregatedMetrics = {
  Estado: string;
  DinheiroMovimentado: number;
  QuantidadeTransacoes: number;
  TicketMedio: number;
  ParticipacaoPF: number; // %
  ParticipacaoPJ: number; // %
  PagadoresUnicosPF: number;
  PagadoresUnicosPJ: number;
  RecebedoresUnicosPF: number;
  RecebedoresUnicosPJ: number;
  RelacaoPagadoresRecebedoresPF: number | null;
  RelacaoPagadoresRecebedoresPJ: number | null;
};

function calculaMetricasPixPorEstado(data: PixRecord[]): AggregatedMetrics[] {
  const agrupado = new Map<string, AggregatedMetrics>();

  for (const record of data) {
    const e = record.Estado;

    if (!agrupado.has(e)) {
      agrupado.set(e, {
        Estado: e,
        DinheiroMovimentado: 0,
        QuantidadeTransacoes: 0,
        TicketMedio: 0,
        ParticipacaoPF: 0,
        ParticipacaoPJ: 0,
        PagadoresUnicosPF: 0,
        PagadoresUnicosPJ: 0,
        RecebedoresUnicosPF: 0,
        RecebedoresUnicosPJ: 0,
        RelacaoPagadoresRecebedoresPF: null,
        RelacaoPagadoresRecebedoresPJ: null,
      });
    }

    const agg = agrupado.get(e)!;

    // Dinheiro movimentado soma pagador PF + PJ
    const dinheiroMov = record.VL_PagadorPF + record.VL_PagadorPJ;
    agg.DinheiroMovimentado += dinheiroMov;

    // Quantidade total transações (pagadores PF + PJ)
    const qtTransacoes = record.QT_PagadorPF + record.QT_PagadorPJ;
    agg.QuantidadeTransacoes += qtTransacoes;

    // Acumula pagadores e recebedores únicos
    agg.PagadoresUnicosPF += record.QT_PES_PagadorPF;
    agg.PagadoresUnicosPJ += record.QT_PES_PagadorPJ;
    agg.RecebedoresUnicosPF += record.QT_PES_RecebedorPF;
    agg.RecebedoresUnicosPJ += record.QT_PES_RecebedorPJ;
  }

  // Calcula métricas derivadas
  for (const agg of agrupado.values()) {
    agg.TicketMedio =
      agg.QuantidadeTransacoes > 0
        ? agg.DinheiroMovimentado / agg.QuantidadeTransacoes
        : 0;

    // Calcula participação PF/PJ em % usando o dataset original filtrado
    const volumePF = data
      .filter((d) => d.Estado === agg.Estado)
      .reduce((sum, d) => sum + d.VL_PagadorPF, 0);
    const volumePJ = data
      .filter((d) => d.Estado === agg.Estado)
      .reduce((sum, d) => sum + d.VL_PagadorPJ, 0);
    const volumeTotal = volumePF + volumePJ;

    agg.ParticipacaoPF = volumeTotal > 0 ? (volumePF / volumeTotal) * 100 : 0;
    agg.ParticipacaoPJ = volumeTotal > 0 ? (volumePJ / volumeTotal) * 100 : 0;

    agg.RelacaoPagadoresRecebedoresPF =
      agg.RecebedoresUnicosPF > 0
        ? agg.PagadoresUnicosPF / agg.RecebedoresUnicosPF
        : null;

    agg.RelacaoPagadoresRecebedoresPJ =
      agg.RecebedoresUnicosPJ > 0
        ? agg.PagadoresUnicosPJ / agg.RecebedoresUnicosPJ
        : null;
  }

  return Array.from(agrupado.values());
}

async function main() {
  const url =
    "https://olinda.bcb.gov.br/olinda/servico/Pix_DadosAbertos/versao/v1/odata/TransacoesPixPorMunicipio(DataBase=@DataBase)";
  const params = {
    "@DataBase": "'202404'", // Exemplo: abril/2024
    "$format": "json"
  };

  try {
    const response = await axios.get(url, { params });
    const data: PixRecord[] = response.data.value;

    const resultado = calculaMetricasPixPorEstado(data);
    console.table(resultado);
  } catch (err) {
    console.error("Erro ao buscar dados do Pix:", err);
  }
}

main();
