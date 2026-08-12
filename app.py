import os

from flask import Flask, send_from_directory

# Serves the built React app (frontend/ -> dist/). Client-side routing is
# handled by React Router, so unknown paths fall through to index.html.
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')

app = Flask(__name__, static_folder=None)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.isfile(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, 'index.html')


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=3000, debug=True)
