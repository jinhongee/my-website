from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/work')
def work():
    return render_template('work.html')


@app.route('/blog')
def blog():
    return render_template('blog.html')


@app.route('/other')
def other():
    return render_template('other.html')


if __name__ == '__main__':
    app.run(debug=True)
