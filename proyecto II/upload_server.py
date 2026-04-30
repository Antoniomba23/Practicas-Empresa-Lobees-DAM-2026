import os
import json
import uuid
from http.server import HTTPServer, BaseHTTPRequestHandler

# Usaremos un puerto que no colisione con compañeros
PORT = 8026 
UPLOAD_DIR = "html_dashboards"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DashboardServer(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/upload':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                task_id = data.get('taskId', f"task_{uuid.uuid4().hex[:8]}")
                html_content = data.get('html', '')
                
                filename = f"{task_id}.html"
                filepath = os.path.join(UPLOAD_DIR, filename)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                
                # Devolvemos la URL pública del dashboard
                public_url = f"http://185.254.205.197:{PORT}/dashboards/{filename}"
                response = json.dumps({"publicUrl": public_url})
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        if self.path.startswith('/dashboards/'):
            filename = self.path.split('/')[-1]
            filepath = os.path.join(UPLOAD_DIR, filename)
            
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"<h1>404 - Dashboard no encontrado</h1>")

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), DashboardServer)
    print(f"Servidor Lobees Tech Audit Dashboard en http://0.0.0.0:{PORT}")
    server.serve_forever()
