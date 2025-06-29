from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route("/", methods=["POST"])
def pyr_function():
    """
    BigQuery remote function expects a JSON payload like this: 
    
    """
    req_data = request.get_json()
    calls = req_data.get("calls", [])
    replies = []
    for call in calls:
        if not call or len(call) == 0:
            replies.append(None)
            continue
        number = call[0]
        try:
            result = subprocess.run(
                ["Rscript", "square.R", str(number)],
                capture_output=True,
                text=True,
                check=True
            )
            squared = float(result.stdout.strip())
            replies.append(squared)
        except Exception as e:
            replies.append(None)

    return jsonify({"replies": replies})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
