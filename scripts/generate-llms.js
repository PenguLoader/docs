import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '../docs');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const SITE_URL = 'https://docs.pengu.lol';

// All doc pages in logical order
const pages = [
  { file: 'guide/welcome.md', title: 'Welcome', section: 'Guide' },
  { file: 'guide/installation.md', title: 'Installation', section: 'Guide' },
  { file: 'guide/javascript-plugin.md', title: 'JavaScript Plugin', section: 'Guide' },
  { file: 'guide/css-theme.md', title: 'CSS Theme', section: 'Guide' },
  { file: 'guide/module-system.md', title: 'Module System', section: 'Guide' },
  { file: 'guide/asset-handling.md', title: 'Asset Handling', section: 'Guide' },
  { file: 'guide/lcu-request.md', title: 'LCU Request', section: 'Guide' },
  { file: 'guide/npm-compatibility.md', title: 'NPM Compatibility', section: 'Guide' },
  { file: 'guide/migration-from-v0-6.md', title: 'Migration from v0.6', section: 'Guide' },
  { file: 'guide/faqs.md', title: 'FAQs', section: 'Guide' },
  { file: 'runtime-api/index.md', title: 'Runtime API', section: 'Runtime API' },
  { file: 'runtime-api/pengu.md', title: 'Pengu', section: 'Runtime API' },
  { file: 'runtime-api/command-bar.md', title: 'CommandBar', section: 'Runtime API' },
  { file: 'runtime-api/data-store.md', title: 'DataStore', section: 'Runtime API' },
  { file: 'runtime-api/effect.md', title: 'Effect', section: 'Runtime API' },
  { file: 'runtime-api/toast.md', title: 'Toast', section: 'Runtime API' },
  { file: 'runtime-api/rcp.md', title: 'rcp', section: 'Runtime API' },
  { file: 'runtime-api/socket.md', title: 'socket', section: 'Runtime API' },
  { file: 'runtime-api/plugin-fs.md', title: 'PluginFS', section: 'Runtime API' },
];

function fileToUrl(file) {
  return `${SITE_URL}/${file.replace(/\.md$/, '').replace(/\/index$/, '/')}`;
}

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n*/, '');
}

function stripBadges(content) {
  return content.replace(/<Badge[^>]*\/>/g, '').replace(/\n{3,}/g, '\n\n');
}

function generateLlmsTxt() {
  let txt = `# Pengu Loader

> Pengu Loader - Unleash the power of Customization from your League of Legends Client

Pengu Loader is a mod loader for the League of Legends Client, allowing users to customize the client using JavaScript plugins and CSS themes.

## Docs

`;

  let currentSection = '';
  for (const page of pages) {
    if (page.section !== currentSection) {
      currentSection = page.section;
      txt += `\n### ${currentSection}\n\n`;
    }
    txt += `- [${page.title}](${fileToUrl(page.file)})\n`;
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), txt.trim() + '\n');
  console.log('Generated llms.txt');
}

function generateLlmsFullTxt() {
  let txt = `# Pengu Loader - Full Documentation

> Complete documentation for Pengu Loader, a mod loader for the League of Legends Client.

`;

  for (const page of pages) {
    const filePath = path.join(DOCS_DIR, page.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${page.file} not found, skipping`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    content = stripFrontmatter(content);
    content = stripBadges(content);

    txt += `---\n\n`;
    txt += content.trim();
    txt += `\n\n`;
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), txt.trim() + '\n');
  console.log('Generated llms-full.txt');
}

generateLlmsTxt();
generateLlmsFullTxt();
