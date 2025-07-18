import { NextApiRequest, NextApiResponse } from "next";
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
  ParticipacaoPF: number;
  ParticipacaoPJ: number;
  PagadoresUnicosPF: number;
  PagadoresUnicosPJ: number;
  RecebedoresUnicosPF: number;
  RecebedoresUnicosPJ: number;
  RelacaoPagadoresRecebedoresPF: number | null;
  RelacaoPagadoresRecebedoresPJ: number | null;
};

function calculaMetricasPixPorEstado(data: PixRecord[]): AggregatedMetrics[] {
  const map = new Map<string, {
    metrics: AggregatedMetrics;
    sumPF: number;
    sumPJ: number;
  }
  >();

  for (const record of data) {
    const e = record.Estado;
    if (!e) continue;

    if (!map.has(e)) {
      map.set(e, {
        metrics: {
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
        },
        sumPF: 0,
        sumPJ: 0,
      });
    }

    const entry = map.get(e)!;
    const { metrics } = entry;

    const valorPF = record.VL_PagadorPF || 0;
    const valorPJ = record.VL_PagadorPJ || 0;
    const qtPF = record.QT_PagadorPF || 0;
    const qtPJ = record.QT_PagadorPJ || 0;

    metrics.DinheiroMovimentado += valorPF + valorPJ;
    metrics.QuantidadeTransacoes += qtPF + qtPJ;
    metrics.PagadoresUnicosPF += record.QT_PES_PagadorPF || 0;
    metrics.PagadoresUnicosPJ += record.QT_PES_PagadorPJ || 0;
    metrics.RecebedoresUnicosPF += record.QT_PES_RecebedorPF || 0;
    metrics.RecebedoresUnicosPJ += record.QT_PES_RecebedorPJ || 0;

    entry.sumPF += valorPF;
    entry.sumPJ += valorPJ;
  }

  // Finalize calculations
  const results: AggregatedMetrics[] = [];

  for (const { metrics, sumPF, sumPJ } of map.values()) {
    const total = sumPF + sumPJ;
    metrics.TicketMedio = metrics.QuantidadeTransacoes > 0
      ? metrics.DinheiroMovimentado / metrics.QuantidadeTransacoes
      : 0;

    metrics.ParticipacaoPF = total > 0 ? (sumPF / total) * 100 : 0;
    metrics.ParticipacaoPJ = total > 0 ? (sumPJ / total) * 100 : 0;

    metrics.RelacaoPagadoresRecebedoresPF =
      metrics.RecebedoresUnicosPF > 0
        ? metrics.PagadoresUnicosPF / metrics.RecebedoresUnicosPF
        : null;

    metrics.RelacaoPagadoresRecebedoresPJ =
      metrics.RecebedoresUnicosPJ > 0
        ? metrics.PagadoresUnicosPJ / metrics.RecebedoresUnicosPJ
        : null;

    results.push(metrics);
  }

  return results;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = "https://olinda.bcb.gov.br/olinda/servico/Pix_DadosAbertos/versao/v1/odata/TransacoesPixPorMunicipio(DataBase=@DataBase)";
  const params = {
    "@DataBase": "'202404'",
    "$format": "json",
  };

  const instance = axios.create({ timeout: 240000 });
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.time(`Pix fetch attempt ${attempt}`); // Start timer

      const response = await instance.get(url, { params });

      console.timeEnd(`Pix fetch attempt ${attempt}`); // End timer

      const data: PixRecord[] = response.data?.value;

      if (!data || data.length === 0) {
        return res.status(500).json({ error: "Empty data from Pix API" });
      }

      const resultado = calculaMetricasPixPorEstado(data);
      return res.status(200).json(resultado);
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        return res.status(500).json({ error: "Failed to fetch Pix data after retries" });
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // exponential backoff
    }
  }
}
