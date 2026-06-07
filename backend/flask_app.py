from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify(
        {
            "ok": True,
            "stack": [
                "Python",
                "Flask",
                "MongoDB",
                "PostgreSQL",
            ],
        }
    )


@app.get("/security/status")
def security_status():
    return jsonify(
        {
            "csrf": "Use framework middleware for write endpoints.",
            "sessions": "Store authenticated sessions in PostgreSQL-backed tables.",
            "catalog": "Read flexible product documents from MongoDB.",
        }
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
