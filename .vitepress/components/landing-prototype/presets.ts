// PROTOTYPE (throwaway, branch prototype/landing): the four live-demo presets.
// Every selector here was tested against the real lobby snapshot in public/client/lobby.

export type PresetFile = { name: string; lang: 'css' | 'js'; code: string }
export type Preset = { id: string; label: string; folder: string; files: PresetFile[] }

export const presets: Preset[] = [
  {
    id: 'recolor',
    folder: 'ice-blue',
    label: 'Recolor',
    files: [
      {
        name: 'theme.css',
        lang: 'css',
        code: `/* Swap Riot gold for ice blue */
.parties-background {
  filter: hue-rotate(95deg) saturate(1.2);
}
.main-navigation-menu-item {
  filter: hue-rotate(150deg) saturate(2.5);
}
.lobby-header-detail,
.player-name__game-name,
.friend-header {
  color: #7dd3fc !important;
}
`,
      },
    ],
  },
  {
    id: 'acrylic',
    folder: 'acrylic',
    label: 'Acrylic',
    files: [
      {
        name: 'index.js',
        lang: 'js',
        code: `import './theme.css'

export function load() {
  Effect.apply('acrylic', { color: '#0b122040' })
}
`,
      },
      {
        name: 'theme.css',
        lang: 'css',
        code: `/* Clear the backgrounds so the effect shows */
html, body, .rcp-fe-viewport-sidebar {
  background: transparent !important;
}
.parties-background {
  opacity: 0;
}
`,
      },
    ],
  },
  {
    id: 'restyle',
    folder: 'round-button',
    label: 'Restyle',
    files: [
      {
        name: 'theme.css',
        lang: 'css',
        code: `/* A flat, rounded Find Match button */
.find-match-button-container img {
  display: none !important;
}
.find-match-button-container .generic-button-state {
  border-radius: 999px;
  background: linear-gradient(90deg, #38bdf8, #818cf8);
  box-shadow: 0 8px 30px #38bdf866;
}
.find-match-button-container .generic-button-text {
  color: #0b1220 !important;
  letter-spacing: 0.12em;
}
`,
      },
    ],
  },
  {
    id: 'button',
    folder: 'hello',
    label: 'Add a button',
    files: [
      {
        name: 'index.js',
        lang: 'js',
        code: `import './style.css'

export function load() {
  const panel = document.createElement('div')
  panel.className = 'pengu-panel open'
  panel.innerHTML = '<b>Hello from a plugin</b>' +
    '<p>Edit index.js and this panel changes with it.</p>'
  document.body.append(panel)

  const button = document.createElement('button')
  button.type = 'button'
  button.setAttribute('aria-label', 'Toggle plugin panel')
  button.className = 'pengu-button'
  button.onclick = () => panel.classList.toggle('open')
  document.querySelector('.right-nav-menu').prepend(button)
}
`,
      },
      {
        name: 'style.css',
        lang: 'css',
        code: `.pengu-button {
  width: 34px;
  height: 34px;
  margin: auto 14px;
  border-radius: 50%;
  background: url(./pengu.png) center / cover;
  box-shadow: 0 0 0 2px #38bdf8;
  cursor: pointer;
}
.pengu-panel {
  position: absolute;
  top: 86px;
  right: 290px;
  width: 250px;
  padding: 14px 16px;
  border: 1px solid #38bdf8;
  background: #0b1220f0;
  color: #e0f2fe;
  font: 13px/1.5 sans-serif;
  display: none;
}
.pengu-panel.open {
  display: block;
}
`,
      },
    ],
  },
]

// Files a real plugin would serve from its own folder.
export const pluginAssets: Record<string, string> = {
  './pengu.png': '/icon.png',
}
