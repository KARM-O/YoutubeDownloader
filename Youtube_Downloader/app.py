import os

from flask import Flask, request, send_file, after_this_request, render_template
from flask_cors import CORS

from downloader import download

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/download", methods=["POST"])
def download_video():
    data = request.get_json()

    url = data["url"]
    filetype = data["type"]

    filename = download(url, filetype)

    @after_this_request
    def remove_file(response):
        try:
            os.remove(filename)
            os.rmdir(os.path.dirname(filename))
        except Exception:
            pass

        return response

    return send_file(
        filename,
        as_attachment=True,
        download_name=os.path.basename(filename)
    )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )