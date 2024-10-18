let CLIENT_ID = 'TU_CLIENT_ID_AQUÍ'; // Reemplaza con tu Client ID
let API_KEY = 'TU_API_KEY_AQUÍ'; // Reemplaza con tu API Key
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
let SCOPES = "https://www.googleapis.com/auth/drive.file";

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        console.log('Usuario autenticado');
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

function uploadFile() {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('cv');
    const file = fileInput.files[0];

    if (file) {
        const metadata = {
            'name': file.name,
            'mimeType': file.type
        };

        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        formData.append('file', file);

        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
            }),
            body: formData
        }).then(response => response.json())
        .then(data => {
            console.log('Archivo subido: ', data);
            alert('Currículum enviado correctamente.');
        }).catch(error => {
            console.error('Error al subir el archivo: ', error);
            alert('Error al enviar el currículum.');
        });
    } else {
        alert('Por favor, selecciona un archivo para subir.');
    }
}

// Cargar la API de Google
document.addEventListener('DOMContentLoaded', function() {
    gapi.load('client:auth2', handleClientLoad);
});

