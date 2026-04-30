const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const scriptContent = fs.readFileSync(path.join(__dirname, 'upload_server.py'), 'utf8');
const base64Code = Buffer.from(scriptContent).toString('base64');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection established. Deploying server...');
    conn.sftp((err, sftp) => {
        if (err) throw err;
        // Creamos directorio usando SFTP para que sea sólido
        sftp.mkdir('antonio_dash_server', (err) => {
            // Ignoramos error de "ya existe"
            const writeStream = sftp.createWriteStream('antonio_dash_server/server.py');
            writeStream.on('close', () => {
                console.log('File uploaded correctly.');
                // Arrancamos el server y esperamos confirmación con script bash
                const startSh = `#!/bin/bash\npkill -f "server.py"\nnohup python3 -u server.py < /dev/null > server.log 2>&1 &\nexit 0`;
                sftp.writeFile('antonio_dash_server/start.sh', startSh, (err) => {
                    conn.exec(`cd antonio_dash_server && chmod +x start.sh && ./start.sh`, (err, stream) => {
                        if (err) throw err;
                        stream.on('data', d => console.log('VPS OUT: ' + d))
                              .on('close', () => {
                                  console.log('Deployment automated complete.');
                                  conn.end();
                              })
                              .stderr.on('data', d => console.log('VPS ERR: ' + d));
                    });
                });
            });
            writeStream.write(scriptContent);
            writeStream.end();
        });
    });
}).connect({
    host: '185.254.205.197',
    port: 22,
    username: 'epsum_estudiantes',
    password: '55xjvAZUdsapvMjMKCg3'
});
