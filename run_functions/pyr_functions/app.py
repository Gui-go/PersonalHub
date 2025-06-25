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
            # Keep only numeric args
            args = [str(x) for x in call if isinstance(x, (int, float))]

            result = subprocess.run(
                ["Rscript", "script.R"] + args,
                capture_output=True,
                text=True,
                check=True
            )
            output = result.stdout.strip()
            print(f"Rscript output: {output}")  # <- for debugging
            replies.append(float(output))

        except subprocess.CalledProcessError as e:
            print(f"Rscript failed:\nSTDOUT: {e.stdout}\nSTDERR: {e.stderr}")
            replies.append(None)

        except Exception as e:
            print(f"Python error: {e}")
            replies.append(None)


    return jsonify({"replies": replies})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
