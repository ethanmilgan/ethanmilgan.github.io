# Flask Backend

This optional Flask service is included for the Python portion of the requested stack.

Run it with:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend\requirements.txt
python backend\flask_app.py
```

The main website runs through Next.js and Express. MongoDB stores flexible catalog data, and PostgreSQL is reserved for structured data such as users and orders.
