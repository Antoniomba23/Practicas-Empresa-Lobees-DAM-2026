require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '..', 'forms')));

// === Rutas de Formularios (GET) ===

// Formulario 1: ¿Sigue interesado?
app.get('/lead/:id/form1', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'forms', 'form1.html'));
});

// Formulario 2: Elegir hora (Solo si aceptó el form1)
app.get('/lead/:id/form2', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'forms', 'form2.html'));
});

// Formulario 3: Canal de comunicación
app.get('/lead/:id/form3', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'forms', 'form3.html'));
});

// Página de éxito final
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'forms', 'success.html'));
});

// Función auxiliar para enviar webhooks a n8n
async function sendWebhookToN8n(url, payload) {
    if (!url) {
        console.warn('URL de webhook no configurada, ignorando envío.');
        return false;
    }
    
    try {
        // En Node.js v18+, fetch es nativo y global. NO necesitamos import("node-fetch")
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log(`Webhook enviado correctamente a ${url}`);
            return true;
        } else {
            console.error(`Error enviando webhook: Status ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error(`Excepción enviando webhook a ${url}:`, error.message);
        return false;
    }
}

// === Procesamiento de Formularios (POST) ===

// Procesar Formulario 1
app.post('/lead/:id/form1', async (req, res) => {
    const leadId = req.params.id;
    const { interested } = req.body;
    
    console.log(`[Lead ${leadId}] Respuesta Form 1: Interesado = ${interested}`);
    
    // Enviar Webhook a n8n
    await sendWebhookToN8n(process.env.N8N_WEBHOOK_URL_FORM1, {
        leadId,
        formStep: 1,
        interested: interested === 'yes',
        timestamp: new Date().toISOString()
    });
    
    if (interested === 'yes') {
        // Si está interesado, enviamos al formulario 2
        res.redirect(`/lead/${leadId}/form2`);
    } else {
        // Si no está interesado, terminamos el proceso
        res.send('<h1>Gracias por tu tiempo</h1><p>Hemos registrado tu respuesta. Puedes cerrar esta ventana.</p>');
    }
});

// Procesar Formulario 2
app.post('/lead/:id/form2', async (req, res) => {
    const leadId = req.params.id;
    const { preferredTime } = req.body;
    
    console.log(`[Lead ${leadId}] Respuesta Form 2: Hora = ${preferredTime}`);
    
    // Enviar Webhook a n8n
    await sendWebhookToN8n(process.env.N8N_WEBHOOK_URL_FORM2, {
        leadId,
        formStep: 2,
        preferredTime,
        timestamp: new Date().toISOString()
    });
    
    // Continuamos al formulario 3
    res.redirect(`/lead/${leadId}/form3`);
});

// Procesar Formulario 3
app.post('/lead/:id/form3', async (req, res) => {
    const leadId = req.params.id;
    const { contactChannel } = req.body;
    
    console.log(`[Lead ${leadId}] Respuesta Form 3: Canal = ${contactChannel}`);
    
    // Enviar Webhook a n8n
    await sendWebhookToN8n(process.env.N8N_WEBHOOK_URL_FORM3, {
        leadId,
        formStep: 3,
        contactChannel,
        timestamp: new Date().toISOString()
    });
    
    // Finalizamos mostrando la página de éxito
    res.redirect('/success');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Punto de entrada: http://localhost:${PORT}/lead/123/form1`);
});
