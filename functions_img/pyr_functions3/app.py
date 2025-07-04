from flask import Flask, request, jsonify
import subprocess
import pandas as pd
import os
import tempfile
import json

app = Flask(__name__)

@app.route("/", methods=["POST"])
def pyr_function():
    """
    Accepts a JSON payload with a named datatable.
    Example payload:
    {
        "data": {
            "columns": ["dep_y", "ind_x1", "ind_x2"],
            "rows": [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]
        }
    }
    Passes data to R script for linear regression.
    """
    req_data = request.get_json()
    data = req_data.get("data", {})
    columns = data.get("columns", [])
    # rows = data.get("rows", [])
    rows = [
        json.loads(row) if isinstance(row, str) else row
        for row in data.get("rows", [])
        ]

    
    if not columns or not rows:
        return jsonify({"error": "Invalid data format"}), 400
    
    replies = []
    try:
        # Create a temporary CSV file
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.csv') as temp_file:
            # Convert data to DataFrame and save to CSV
            df = pd.DataFrame(rows, columns=columns)
            df.to_csv(temp_file.name, index=False)
            temp_file_path = temp_file.name
        
        # Run R script with CSV file path as argument
        result = subprocess.run(
            ["Rscript", "script.R", temp_file_path],
            capture_output=True,
            text=True,
            check=True
        )
        # Parse R script output (assuming JSON or simple text)
        output = result.stdout.strip()
        replies.append(output)
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"replies": replies})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)