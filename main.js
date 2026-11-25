const { app, BrowserWindow, shell, Menu } = require('electron');

const APP_URL = 'https://pec-command-center.workspace-687618.chatgpt.site/';
const APP_ORIGIN = new URL(APP_URL).origin;

// Solo permitir una instancia de la app
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'PEC Command Center',
    autoHideMenuBar: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      // Sesión persistente: no tienes que iniciar sesión cada vez
      partition: 'persist:pec-command-center',
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  Menu.setApplicationMenu(null);
  win.loadURL(APP_URL);

  // Enlaces a otros sitios se abren en el navegador, no dentro de la app
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (new URL(url).origin === APP_ORIGIN) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (new URL(url).origin !== APP_ORIGIN) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Pantalla simple si no hay internet
  win.webContents.on('did-fail-load', (_e, code, desc, _url, isMainFrame) => {
    if (!isMainFrame || code === -3) return;
    const html = `<body style="font-family:sans-serif;text-align:center;padding-top:20vh">
      <h2>No se pudo cargar PEC Command Center</h2>
      <p>${desc}</p>
      <button onclick="location.href='${APP_URL}'" style="padding:10px 20px;font-size:16px">Reintentar</button>
    </body>`;
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
  });
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
