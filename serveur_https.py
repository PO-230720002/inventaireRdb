import http.server, ssl

PORT = 8000

httpd = http.server.HTTPServer(('0.0.0.0', PORT), http.server.SimpleHTTPRequestHandler)

# Utiliser SSLContext pour HTTPS propre
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile="localhost+2.pem", keyfile="localhost+2-key.pem")

httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"Serveur HTTPS lancé sur https://localhost:{PORT}")
httpd.serve_forever()
