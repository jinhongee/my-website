from flask import Flask, render_template, request, redirect, url_for
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


BLOG_PASSWORD = 'jinhongee'  # Change to a strong password


@app.route('/blog/essay1', methods=['GET', 'POST'])
def essay1():
    if request.method == 'POST':
        password = request.form.get('password')
        if password == BLOG_PASSWORD:
            return render_template('essays/essay1.html')
        else:
            return render_template('password_prompt.html', error='Incorrect password')
    return render_template('password_prompt.html')


@app.route('/blog/essay2', methods=['GET', 'POST'])
def essay2():
    if request.method == 'POST':
        password = request.form.get('password')
        if password == BLOG_PASSWORD:
            return render_template('essays/essay2.html')
        else:
            return render_template('password_prompt.html', error='Incorrect password')
    return render_template('password_prompt.html')


@app.route('/blog/essay3', methods=['GET', 'POST'])
def essay3():
    if request.method == 'POST':
        password = request.form.get('password')
        if password == BLOG_PASSWORD:
            return render_template('essays/essay3.html')
        else:
            return render_template('password_prompt.html', error='Incorrect password')
    return render_template('password_prompt.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
