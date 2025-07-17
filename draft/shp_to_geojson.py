import geopandas as gpd
import os

# Define input and output paths
input_shapefile_path = '/home/guigo/Documents/data/BR_UF_2024/BR_UF_2024.shp' # Make sure to specify the .shp file itself
output_geojson_path = '/home/guigo/Documents/data/BR_UF_2024.geojson'

try:
    # Read the shapefile
    print(f"Reading shapefile from: {input_shapefile_path}")
    gdf = gpd.read_file(input_shapefile_path)
    print("Shapefile loaded successfully.")

    # Check the current CRS (Coordinate Reference System)
    print(f"Original CRS: {gdf.crs}")

    # Re-project to WGS 84 (EPSG:4326) if not already
    # This is crucial for web mapping
    if gdf.crs != 'EPSG:4326':
        print("Reprojecting to EPSG:4326 (WGS 84)...")
        gdf = gdf.to_crs(epsg=4326)
        print("Reprojection complete.")
    else:
        print("Shapefile is already in EPSG:4326.")

    # --- Optional: Simplify geometries to reduce file size ---
    # This is a key step to address "heavy" polygons.
    # The `tolerance` value determines the level of simplification.
    # A smaller tolerance means less simplification, a larger tolerance means more.
    # Experiment with this value (e.g., 0.001, 0.01, 0.1 for geographical coordinates)
    simplification_tolerance = 0.001 # Adjust this value!

    print(f"Simplifying geometries with tolerance: {simplification_tolerance}...")
    gdf['geometry'] = gdf['geometry'].simplify(tolerance=simplification_tolerance, preserve_topology=True)
    print("Geometries simplified.")

    # Export to GeoJSON
    print(f"Exporting to GeoJSON: {output_geojson_path}")
    gdf.to_file(output_geojson_path, driver='GeoJSON')
    print("Conversion to GeoJSON complete!")
    print(f"Output file size: {os.path.getsize(output_geojson_path) / (1024*1024):.2f} MB")

except Exception as e:
    print(f"An error occurred: {e}")
    print("Please ensure the .shp file exists at the specified path and that all companion files (.dbf, .shx, .prj, etc.) are in the same directory.")