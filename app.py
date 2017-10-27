import json
from flask import Flask
from flask import render_template
from flask_compress import Compress
from flask.ext.cache import Cache

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
Compress(app)


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
