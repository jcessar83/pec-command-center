const { app, BrowserWindow, shell, Menu } = require('electron');

const APP_URL = 'https://pec-command-center.workspace-687618.chatgpt.site/';

// Dominios que necesitan abrirse dentro de la app para poder iniciar sesión
const AUTH_HOSTS = [
  'openai.com', 'chatgpt.com', 'chatgpt.site', 'oaistatic.com',
  'oaiusercontent.com', 'auth0.com', 'cloudflare.com',
  'google.com', 'gstatic.com', 'apple.com',
  'microsoftonline.com', 'live.com', 'microsoft.com'
];

function isAuthHost(url) {
  try {
    const host = new URL(url).hostname;
    return AUTH_HOSTS.some(d => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

// Identificarse como Chrome normal (sin "Electron" en el user agent)
app.userAgentFallback =
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome} Safari/537.36`;

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
      partition: 'persist:pec-command-center',
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  Menu.setApplicationMenu(null);
  win.loadURL(APP_URL);

  // Ventanas emergentes: las del login se abren en la app, el resto en el navegador
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isAuthHost(url)) {
      return { action: 'allow', overrideBrowserWindowOptions: { autoHideMenuBar: true } };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

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
