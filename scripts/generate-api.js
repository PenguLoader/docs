import { Project, SyntaxKind } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const project = new Project();
const sourceFile = project.addSourceFileAtPath(path.resolve(__dirname, '../../PenguLoader/plugins/src/types.d.ts'));

function extractJSDoc(node) {
    const jsDocs = node.getJsDocs();
    if (jsDocs.length === 0) return null;
    
    const jsDoc = jsDocs[0];
    const description = jsDoc.getDescription().trim();
    const tags = jsDoc.getTags().map(tag => {
        let text = tag.getText().replace(`@${tag.getTagName()}`, '').trim();
        // Remove leading asterisks from each line
        text = text.split('\n').map(line => line.replace(/^\s*\*\s?/, '')).join('\n').trim();
        return {
            tagName: tag.getTagName(),
            text
        };
    });
    
    return { description, tags };
}

function generateMarkdownForWindow() {
    const windowInterface = sourceFile.getInterfaceOrThrow('Window');
    
    let md = `# Runtime API\n\nThese APIs are designed to use inside League Client with Pengu Loader plugin\nruntime.\n\n`;
    
    const properties = windowInterface.getProperties();
    const methods = windowInterface.getMethods();
    
    const allMembers = [...properties, ...methods];
    
    for (const member of allMembers) {
        const name = member.getName();
        // Skip properties that are namespaces like DataStore, CommandBar, etc.
        if (['DataStore', 'CommandBar', 'Toast', 'Effect', 'Pengu', 'os', 'rcp', 'PluginFS'].includes(name)) continue;
        
        const doc = extractJSDoc(member);
        if (!doc) continue;
        
        const isMethod = member.getKind() === SyntaxKind.MethodSignature || member.getKind() === SyntaxKind.PropertySignature && member.getType().getCallSignatures().length > 0;
        
        let signature = name;
        if (isMethod) {
            const typeNode = member.getTypeNode();
            if (typeNode && typeNode.getKind() === SyntaxKind.FunctionType) {
                const params = typeNode.getParameters().map(p => p.getName() + (p.isOptional() ? '?' : '')).join(', ');
                signature = `${name}(${params})`;
            } else if (member.getKind() === SyntaxKind.MethodSignature) {
                const params = member.getParameters().map(p => p.getName() + (p.isOptional() ? '?' : '')).join(', ');
                signature = `${name}(${params})`;
            } else {
                signature = `${name}()`;
            }
        }
        
        md += `## window.${signature}\n\n`;
        
        let typeText = 'string';
        if (isMethod) {
            typeText = 'function';
        } else if (member.getType().isBoolean()) {
            typeText = 'boolean';
        } else if (member.getType().isArray()) {
            typeText = 'string[ ]'; // Simplified for now
        }
        md += `<Badge type="info" text="${typeText}" />\n`;
        
        const sinceTag = doc.tags.find(t => t.tagName === 'since');
        if (sinceTag) {
            md += `<Badge type="tip" text="since ${sinceTag.text}" />\n`;
        }
        
        const deprecatedTag = doc.tags.find(t => t.tagName === 'deprecated');
        if (deprecatedTag) {
            md += `<Badge type="warning" text="deprecated" />\n`;
        }
        
        md += `\n${doc.description}\n\n`;
        
        const exampleTag = doc.tags.find(t => t.tagName === 'example');
        if (exampleTag) {
            md += `Example:\n\n${exampleTag.text}\n\n`;
        }
        
        // Add any remaining text from the description that might be tips/warnings
        const descriptionLines = doc.description.split('\n');
        const tipIndex = descriptionLines.findIndex(line => line.trim().startsWith(':::'));
        if (tipIndex !== -1) {
            md += `${descriptionLines.slice(tipIndex).join('\n')}\n\n`;
        }
    }
    
    fs.writeFileSync(path.resolve(__dirname, '../docs/runtime-api/index.md'), md.trim() + '\n');
    console.log('Generated index.md');
}

function generateMarkdownForInterface(interfaceName, fileName, title, descriptionText, footerText) {
    const iface = sourceFile.getInterface(interfaceName);
    if (!iface) {
        console.warn(`Interface ${interfaceName} not found.`);
        return;
    }
    
    let md = `# ${title}\n\n${descriptionText}\n\n`;
    
    const properties = iface.getProperties();
    const methods = iface.getMethods();
    
    const allMembers = [...properties, ...methods];
    
    for (const member of allMembers) {
        const name = member.getName();
        const doc = extractJSDoc(member);
        if (!doc) continue;
        
        const isMethod = member.getKind() === SyntaxKind.MethodSignature || member.getKind() === SyntaxKind.PropertySignature && member.getType().getCallSignatures().length > 0;
        
        let signature = name;
        if (isMethod) {
            const typeNode = member.getTypeNode();
            if (typeNode && typeNode.getKind() === SyntaxKind.FunctionType) {
                const params = typeNode.getParameters().map(p => p.getName() + (p.isOptional() ? '?' : '')).join(', ');
                signature = `${name}(${params})`;
            } else if (member.getKind() === SyntaxKind.MethodSignature) {
                const params = member.getParameters().map(p => p.getName() + (p.isOptional() ? '?' : '')).join(', ');
                signature = `${name}(${params})`;
            } else {
                signature = `${name}()`;
            }
        }
        
        md += `## ${title}.${signature}\n\n`;
        
        let typeText = 'string';
        if (isMethod) {
            typeText = 'function';
        } else if (member.getType().isBoolean()) {
            typeText = 'boolean';
        } else if (member.getType().isArray()) {
            typeText = 'string[ ]'; // Simplified for now
        }
        md += `<Badge type="info" text="${typeText}" />\n`;
        
        const sinceTag = doc.tags.find(t => t.tagName === 'since');
        if (sinceTag) {
            md += `<Badge type="tip" text="since ${sinceTag.text}" />\n`;
        }
        
        const deprecatedTag = doc.tags.find(t => t.tagName === 'deprecated');
        if (deprecatedTag) {
            md += `<Badge type="warning" text="deprecated" />\n`;
        }
        
        md += `\n${doc.description}\n\n`;
        
        const exampleTag = doc.tags.find(t => t.tagName === 'example');
        if (exampleTag) {
            md += `Example:\n\n${exampleTag.text}\n\n`;
        }
        
        const descriptionLines = doc.description.split('\n');
        const tipIndex = descriptionLines.findIndex(line => line.trim().startsWith(':::'));
        if (tipIndex !== -1) {
            md += `${descriptionLines.slice(tipIndex).join('\n')}\n\n`;
        }
    }
    
    if (footerText) {
        md += `${footerText}\n\n`;
    }
    
    fs.writeFileSync(path.resolve(__dirname, `../docs/runtime-api/${fileName}`), md.trim() + '\n');
    console.log(`Generated ${fileName}`);
}

generateMarkdownForWindow();
generateMarkdownForInterface('Pengu', 'pengu.md', 'Pengu', 'This namespace provides information about current Pengu version and its settings.');
generateMarkdownForInterface('CommandBar', 'command-bar.md', 'CommandBar', `Since v1.1.0, we bring to you a new Command Bar 
that can provide access to app-level commands
and can be used with any navigation pattern.

Let's press \`Ctrl + K\` to open the Command Bar.

![](https://i.ibb.co/DWmwtSK/image.png)

### Keyboard shortcuts:

- Use arrow \`Down\` and \`Up\` to nagivate the selection.
- Press \`Enter\` or just click on an action to execute it.
- Press \`ESC\` to close the Command Bar.

<br>

To add your custom actions, please use the APIs below.`);
generateMarkdownForInterface('DataStore', 'data-store.md', 'DataStore', 'League Client does not store user data on disk, similar to incognito mode in web browsers. This namespace helps you to store user data on disk.');
generateMarkdownForInterface('Effect', 'effect.md', 'Effect', `This namespace supports changing window transparency/translucent effect.

<br>

![](https://user-images.githubusercontent.com/38210249/216951830-b3bb3ce3-7a5f-4e60-8a67-33d0bce799cf.png)`,
`![](https://user-images.githubusercontent.com/38210249/216951865-bb9c6676-58ec-4c81-ad96-67e94e91ac22.png)

## System compatibility

<!-- - These effects are currently supported only Windows 7+. -->

- On Windows 7, only the \`blurbehind\` is supported.
- On Windows 10, requires build 1703 or higher to use \`acrylic\`.
- \`mica\` and \`unified\` are only supported on Windows 11, but \`unified\` can be
  enabled on Windows 10 without different from \`acrylic\`.

::: warning

On Windows 10 build **1903** (19H1) and higher, enabling \`acrylic/mica/unified\` with
**Transparency effects** (in Personalize -> Color settings) will cause lag when
moving the Client window.

:::

## Listening for changes

Add a listener which will be triggered when effect changed.

\`\`\`js
window.addEventListener('effect-changed', (event) => {
  console.log(event.detail)
})
\`\`\``);
generateMarkdownForInterface('Toast', 'toast.md', 'Toast', 'This namespace is used to push your toast notifications onto the League Client screen.');
generateMarkdownForInterface('Rcp', 'rcp.md', 'rcp', `This object provides easy access and hook to the Riot Client Plugin (RCP) system.

Get the \`rcp\` in your plugin entry:

\`\`\`js
export function init(context) {
  const rcp = context.rcp
}
\`\`\`

Or get it globally via \`window\` object:

\`\`\`js
const rcp = window.rcp
\`\`\``);
generateMarkdownForInterface('Socket', 'socket.md', 'socket', `This namespace helps you to observe specific LCU APIs without creating a new WebSocket.
You cannot get it directly from \`window\`, instead use the context of the [\`init\` entry point](../guide/javascript-plugin#plugin-entry-points).`);
generateMarkdownForInterface('PluginFS', 'plugin-fs.md', 'PluginFS', `This API allows plugins to access **their own directory** and perform some basic file operations.

::: warning

**Top-level** plugin is not allowed since they don't own a directory.

This API currently does not support calls in **remote** script.

:::

::: tip

All paths passed into this API are relative to the root directory of your plugin.

:::`);
