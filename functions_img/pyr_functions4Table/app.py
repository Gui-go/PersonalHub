from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route("/", methods=["POST"])
def pyr_function():
    """
    Receives a list of lists, each sublist represents a row from BigQuery.
    """
    req_data = request.get_json()
    calls = req_data.get("calls", [])
    replies = []

    for call in calls:
        if not call or len(call) == 0:
            replies.append(None)
            continue
        try:
            args = [str(arg) for arg in call]
            result = subprocess.run(
                ["Rscript", "script.R"] + args,
                capture_output=True,
                text=True,
                check=True
            )
            output = float(result.stdout.strip())
            replies.append(output)
        except Exception as e:
            # Optional: log str(e) if debugging
            replies.append(None)

    return jsonify({"replies": replies})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
