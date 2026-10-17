"""Local preview with explicit WebP MIME support (Windows Python may lack it)."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse, os
parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=4189)
args = parser.parse_args()
os.chdir(Path(__file__).resolve().parents[1])
SimpleHTTPRequestHandler.extensions_map['.webp'] = 'image/webp'
server = ThreadingHTTPServer(('127.0.0.1', args.port), SimpleHTTPRequestHandler)
print(f'Serving http://127.0.0.1:{args.port}/', flush=True)
server.serve_forever()
