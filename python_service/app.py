from flask import Flask, request, jsonify
import json
from pathlib import Path
import sys

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        payload = request.get_json(force=True)
        if not isinstance(payload, dict) or 'expenses' not in payload:
            return jsonify({"error": "Invalid payload. Expecting { expenses: [...] }."}), 400

        from tempfile import NamedTemporaryFile
        with NamedTemporaryFile('w+', suffix='.json', delete=False) as tmp:
            json.dump({"expenses": payload['expenses']}, tmp)
            tmp.flush()
            tmp_path = Path(tmp.name)

        import subprocess
        result = subprocess.run(
            [sys.executable, str(Path(__file__).parent.parent / 'scripts' / 'expense_suggestions.py'), str(tmp_path)],
            capture_output=True,
            text=True,
            check=False
        )

        try:
            tmp_path.unlink(missing_ok=True)  # type: ignore[attr-defined]
        except Exception:
            pass

        if result.returncode != 0:
            return jsonify({"error": "analysis failed", "stderr": result.stderr}), 500

        return app.response_class(result.stdout, mimetype='application/json')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
