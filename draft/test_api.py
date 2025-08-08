import requests
url = "https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/Berliner_Mauer/FeatureServer/0/query"
# https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/Berliner_Mauer/FeatureServer
params = {
  "where": "1=1",
  "outFields": "*",
  "f": "json",
  "resultRecordCount": 2000
}
resp = requests.get(url, params=params)
data = resp.json()
