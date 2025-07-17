import requests
import pandas as pd

# Baixa todos os dados do mês de maio/2024
url = "https://olinda.bcb.gov.br/olinda/servico/Pix_DadosAbertos/versao/v1/odata/TransacoesPixPorMunicipio(DataBase=@DataBase)"
params = {
    "@DataBase": "'202404'",
    "$format": "json"#,
    # "$top": 10000
}

resp = requests.get(url, params=params)
df = pd.DataFrame(resp.json()['value'])

# Agrupa por Estado e soma os valores
agrupado = df.groupby("Estado")[[
    "VL_PagadorPF", "VL_RecebedorPF", "VL_PagadorPJ", "VL_RecebedorPJ"
]].sum().sort_values(by="VL_PagadorPF", ascending=False)

print(agrupado)
