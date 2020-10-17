#!/usr/bin/python
import sys
import http.server
import socketserver
import os

PORT = 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()
        self.wfile.write("Hello World".encode('utf-8'))


def main():
    httpd = http.server.HTTPServer(("", PORT), Handler)
    print("serving at port", PORT)
    httpd.serve_forever()


if __name__ == '__main__':
    main()
