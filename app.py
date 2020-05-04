import os
from flask import Flask, request, make_response, render_template, send_file
from werkzeug.utils import secure_filename
import uuid
import process_file

app = Flask(__name__, static_folder="static", static_url_path="")
UPLOAD_FOLDER = os.path.join(app.root_path, "static", "files", "input")
DOWNLOAD_FOLDER = os.path.join(app.root_path, "static", "files", "output")
ALLOWED_EXTENSIONS = {'doc', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/', methods=["GET", "POST"])
def hello_world():
    if request.method == "POST":
        try:
            numeric = "numeric" in request.form.keys()
            file = request.files['userDocument']
            secure_name = secure_filename(file.filename)
            name = uuid.uuid4().hex + ".docx"
            print(f"Received file {secure_name} ({name})")
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], name))
            is_valid = process_file.validate(app.config['UPLOAD_FOLDER'], name)

            if is_valid:
                process_file.process(app.config['UPLOAD_FOLDER'], name, DOWNLOAD_FOLDER, numeric=numeric)
                # todo: notify if errors
                inc_stats()
                return make_response(name, 200)
            else:
                return make_response("invalid file", 400)
        except Exception as e:
            print(f"Error occurred: {e}")
            return make_response("", 400)
    elif request.method == "GET":
        return render_template("page.html", stats=get_stats())


@app.route('/getfile', methods=["GET"])
def get_file():
    try:
        name = request.args["name"]
        download_name = request.args["downloadName"]
        download_name = download_name.split(".")
        download_name = download_name[0] + "_converted." + download_name[1]
        return send_file(os.path.join(DOWNLOAD_FOLDER, name), as_attachment=True, attachment_filename=download_name)
    except Exception as e:
        return make_response("Ошибка конвертирования", 400)


def get_stats():
    name = "stats.txt"
    name = os.path.join(app.static_folder, name)
    stats = 0
    if os.path.isfile(name):
        with open(name, "r") as f:
            stats = int(f.read())
    else:
        with open(name, "w") as f:
            f.write(str(stats))
    return stats


def inc_stats():
    name = "stats.txt"
    name = os.path.join(app.static_folder, name)
    stats = get_stats()
    stats += 1
    with open(name, "w") as f:
        f.write(str(stats))


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5556)
