# PEC Command Center (app de escritorio para Windows)

Envoltorio Electron de https://pec-command-center.workspace-687618.chatgpt.site/

## Compilar en tu PC (Windows)
1. Instala Node.js LTS: https://nodejs.org
2. Abre una terminal en esta carpeta y ejecuta:
   npm install
   npm start        (para probar la app)
   npm run build    (genera el instalador)
3. El instalador queda en: dist/PEC Command Center Setup 1.0.0.exe

## Compilar en la nube (sin instalar nada)
Sube esta carpeta a un repositorio de GitHub. En la pestaña Actions
ejecuta "Build Windows installer" y descarga el .exe desde Artifacts.

## Ícono personalizado
Coloca un archivo build/icon.ico (256x256) antes de compilar.

## Cambiar la URL
Edita APP_URL al inicio de main.js.
