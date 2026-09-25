// PROTOTYPE (throwaway): page copy shared by all three variants, so they differ only in design.
// Plain product copy, reviewed with unslop.

export const hero = {
  title: ['Restyle it. Extend it.', 'Make the Client yours.'],
  sub: 'Pengu Loader adds themes and plugins to the League Client. Free, open source, and it never touches the game.',
  secondary: { text: 'Read the guide', href: '/guide/welcome' },
  demoHint: 'Drag the frame to move the Client. Change the code and it updates live.',
}

export const app = {
  title: 'Turn it on once',
  body: 'Press Activate in the Pengu app and every Client launch loads your themes and plugins. Switch them on and off with a checkbox.',
}

export const community = {
  title: 'Made by players',
  body: 'Everything in the store comes from the community. These four themes use the same lobby as the live demo.',
  themes: [
    { src: '/home/community/ahri.webp', name: 'Ahri', author: 'Yuzuru10', href: 'https://github.com/nomi-san/ahri-theme' },
    { src: '/home/community/irelia.webp', name: 'Irelia', author: 'rumi-chan', href: 'https://github.com/rumi-chan/LeagueThemes' },
    { src: '/home/community/acrylical.webp', name: 'Acrylical', author: 'PrincessAkira', href: 'https://github.com/HerXayah/league-launcher-theme' },
    { src: '/home/community/cute.webp', name: 'Cute', author: 'PrincessAkira', href: 'https://github.com/HerXayah/league-launcher-theme' },
  ],
  plugins: [
    { name: 'Balance buff viewer', author: 'nomi-san', body: 'Shows the damage and healing changes each game mode applies to a champion.', href: 'https://github.com/nomi-san/balance-buff-viewer' },
    { name: 'Listening status', author: 'iIlusion', body: 'Sets your Client status to the song playing on Spotify.', href: 'https://github.com/iIlusion/league-loader-plugins/tree/main/ListeningStatus' },
  ],
  share: { text: 'Share yours on Discord', href: 'https://chat.pengu.lol' },
}

export const authors = {
  title: 'Start with one file',
  body: 'Put an index.js in your plugins folder and export load(). Pengu runs it inside the Client once the page is ready.',
  points: [
    { title: 'Talk to the Client', body: 'Call the Client API with plain fetch. No ports or tokens to find.' },
    { title: 'DevTools built in', body: 'Press Ctrl Shift I to inspect elements and read your console.' },
    { title: 'Window effects', body: 'Acrylic, blur, mica or full transparency behind the Client.' },
    { title: 'More than the DOM', body: 'Settings, storage and file access for your plugin folder.' },
  ],
  code: `export async function load() {
  const res = await fetch('/lol-summoner/v1/current-summoner')
  const me = await res.json()
  console.log(\`Hi \${me.gameName}, Pengu is running.\`)
}`,
  links: [
    { text: 'Write your first plugin', href: '/guide/javascript-plugin' },
    { text: 'Make a theme', href: '/guide/css-theme' },
    { text: 'Runtime API', href: '/runtime-api/' },
  ],
}

export const download = {
  title: 'Get Pengu Loader',
  body: 'Free and open source under MIT. Windows 10 and 11, macOS 12 and later.',
  trust: 'It changes the Client UI only. The game itself is never touched.',
  other: { text: 'Other platforms', href: '/download' },
  discord: { text: 'Join the Discord', href: 'https://chat.pengu.lol' },
}

// Variant D only. Facts are durable on purpose: no counts that go stale.
export const d = {
  statement: 'Pengu Loader runs inside the League Client. Themes restyle its screens, plugins add features of their own, and the game itself stays untouched.',
  facts: [
    { value: '1', label: 'File to start a plugin' },
    { value: '0', label: 'Game files changed' },
    { value: '6', label: 'Window effects' },
    { value: '5', label: 'App accent colors' },
    { value: '2', label: 'Platforms, Windows and macOS' },
    { value: 'MIT', label: 'Open source license' },
  ],
  factsBody: 'Plugins are JavaScript and themes are CSS. If you have built a web page, you already know the tools.',
  features: [
    { title: 'Activate once', body: 'One button in the Pengu app. Every Client launch after that loads your setup.' },
    { title: 'Plugin checkboxes', body: 'Turn each plugin on or off without touching a file.' },
    { title: 'Community store', body: 'Browse plugins and themes that other players publish.' },
    { title: 'Five accents', body: 'Blue, green, purple, pink or yellow for the Pengu app.' },
    { title: 'DevTools built in', body: 'Press Ctrl Shift I inside the Client to inspect and debug.' },
  ],
  cards: [
    { label: 'See it change', href: '#showcase', img: '/client/lobby-poster.webp' },
    { label: 'Community themes', href: '#community', img: '/home/community/ahri.webp' },
  ],
}

export const riot ="Pengu Loader isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc."
