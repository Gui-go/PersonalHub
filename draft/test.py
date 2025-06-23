# # ./env/bin/python

# # env/bin/activate

# # fastapi_dijkstra.py
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import networkx as nx

# app = FastAPI()

# # Dummy graph for example
# G = nx.Graph()
# G.add_weighted_edges_from([
#     ("A", "B", 1),
#     ("B", "C", 2),
#     ("A", "C", 4),
#     ("C", "D", 1),
# ])

# class PathRequest(BaseModel):
#     source: str
#     target: str

# @app.post("/shortest-path/")
# def shortest_path(req: PathRequest):
#     try:
#         path = nx.dijkstra_path(G, req.source, req.target)
#         distance = nx.dijkstra_path_length(G, req.source, req.target)
#         return {"path": path, "distance": distance}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))


import geopandas as gpd
import networkx as nx
from shapely.geometry import LineString, Point

# Load your GeoJSON
gdf = gpd.read_file("data/rodovias2014br/rodovia_2014_nd.geojson")

# Initialize a graph
G = nx.Graph()

# Add edges from LineString segments
for idx, row in gdf.iterrows():
    geom = row.geometry
    if isinstance(geom, LineString):
        coords = list(geom.coords)
        for i in range(len(coords) - 1):
            u = coords[i]
            v = coords[i + 1]
            distance = Point(u).distance(Point(v))  # Euclidean distance
            G.add_edge(u, v, weight=distance, name=row.get("name", ""))
    else:
        print(f"Skipped non-LineString geometry at index {idx}")
