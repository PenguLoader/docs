// Click-to-style inside the Client snapshot: hovering outlines a known element, clicking hands its
// selector to the editor. Targets are curated so a click yields a selector a theme author would
// actually write; anything else in the Client is not pickable.

// Most specific first: the first ancestor match wins.
export const targets: [selector: string, label: string][] = [
  ['.find-match-button-container', 'Find Match button'],
  ['.close-button', 'Leave lobby button'],
  ['.lobby-back-button', 'Back button'],
  ['.invite-button', 'Invite slot'],
  ['.position-selector-button', 'Position picker'],
  ['.open-party-toggle', 'Open party toggle'],
  ['.player-name-container', 'Player name'],
  ['.player-achievements-container', 'Challenge tokens'],
  ['.lobby-banner', 'Player banner'],
  ['.lobby-header-content', 'Lobby header'],
  ['.chat-input', 'Chat input'],
  ['.v2-parties-invite-info-panel', 'Invite panel'],
  ['.play-button-container', 'Party button'],
  ['.wallet-and-badges', 'Currency'],
  ['.main-navigation-menu-item', 'Nav item'],
  ['.identity-icon', 'Profile icon'],
  ['.status-message', 'Status text'],
  ['lol-parties-game-info-panel', 'Party card'],
  ['.lol-social-actions-bar', 'Social bar'],
  ['.lol-social-roster-group-name', 'Friend group'],
  ['.chat-toggle-button', 'Chat button'],
  ['.mission-button', 'Missions button'],
  ['lol-parties-comm-button', 'Voice button'],
  ['.bug-report-button', 'Report button'],
  ['.navbar_backdrop', 'Top bar'],
  ['.lol-social-sidebar', 'Social sidebar'],
  ['.parties-background', 'Lobby background'],
]

// Elements a plugin example added: they keep their own click behavior.
const PLUGIN_UI = '.pengu-button, .pengu-panel'

export function match(el: Element | null): [string, string, Element] | null {
  if (!el || el.closest(PLUGIN_UI)) return null
  for (const [sel, label] of targets) {
    const hit = el.closest(sel)
    if (hit) return [sel, label, hit]
  }
  // the lobby background sits behind everything, so an empty spot falls through to it
  const bg = el.ownerDocument.querySelector('.parties-background')
  return el.closest('.parties-view') && bg ? ['.parties-background', 'Lobby background', bg] : null
}

export function installPicker(doc: Document, onPick: (selector: string, label: string) => void) {
  const box = doc.createElement('div')
  box.id = 'pengu-pick'
  const tag = doc.createElement('span')
  box.append(tag)
  const style = doc.createElement('style')
  // sized in Client pixels; --pengu-scale keeps the label readable however small the Client is drawn
  style.textContent = `
    #pengu-pick { position: fixed; z-index: 2147483647; pointer-events: none; display: none;
      border: calc(2px / var(--pengu-scale, 1)) solid #38bdf8; background: rgb(56 189 248 / 0.12);
      border-radius: calc(3px / var(--pengu-scale, 1)); transition: all 0.08s ease-out; }
    #pengu-pick span { position: absolute; left: -2px; bottom: 100%; margin-bottom: calc(4px / var(--pengu-scale, 1));
      padding: calc(2px / var(--pengu-scale, 1)) calc(6px / var(--pengu-scale, 1));
      border-radius: calc(3px / var(--pengu-scale, 1)); background: #38bdf8; color: #04121c; white-space: nowrap;
      font: 600 calc(11px / var(--pengu-scale, 1)) / 1.4 system-ui, sans-serif; }
    #pengu-pick.below span { bottom: auto; top: 100%; margin: calc(4px / var(--pengu-scale, 1)) 0 0; }`
  doc.head.append(style)
  doc.body.append(box)

  let current: Element | null = null
  function show(hit: [string, string, Element] | null) {
    current = hit?.[2] ?? null
    doc.documentElement.style.cursor = hit ? 'pointer' : ''
    if (!hit) { box.style.display = 'none'; return }
    const r = hit[2].getBoundingClientRect()
    Object.assign(box.style, { display: 'block', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` })
    box.classList.toggle('below', r.top < 40)
    tag.textContent = `${hit[1]}: click to style`
  }

  doc.addEventListener('mousemove', e => {
    const hit = match(e.target as Element)
    if (hit?.[2] !== current) show(hit)
  })
  doc.addEventListener('mouseleave', () => show(null))
  // a pick styles the element instead of acting on it (no focusing the chat box, no following links)
  doc.addEventListener('click', e => {
    const hit = match(e.target as Element)
    if (!hit) return
    e.preventDefault()
    e.stopPropagation()
    onPick(hit[0], hit[1])
  }, true)
}
