import os

from flask import Flask, render_template

app = Flask(__name__, template_folder=os.path.abspath("templates"), static_folder=os.path.abspath("static"))

@app.route('/', methods=['GET', 'POST'])
def test():
    return render_template("base.html")


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000, debug=True)