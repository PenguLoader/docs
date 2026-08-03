<br />

<p align="center">
  <img src="./public/icons/4274.jpg" width="128" height="128" />
  <h1 align="center">Pengu Docs</h1>
  <p align="center">Official Pengu Loader documentation, built with VitePress.</p>
  <p align="center">👉 <a target="_blank" href="https://pengu.lol/">https://pengu.lol</a></p>
</p>

<br />
<br />

## How to run?

> **Node.js** version 18 or higher and **pnpm** are required to run the project.

Clone the repo:

```
git clone https://github.com/PenguLoader/docs
```

Install dependencies and start development.

```
pnpm i
pnpm dev
```

Build and preview the production.

```
pnpm build
pnpm preview
```

## Help us translate the docs

First, you need to create a new folder in the **docs** folder. For example, `vi`
for Vietnamese.

```
docs/
  |__guide/           |
  |__runtime-api/     | -> english docs
  |__index.md         |
  ...
  |__vi/              | -> vietnamese docs
```

Next, copy the doc files and folders from the root of the docs folder (except
the language folders) and then paste them into your language folder.

```
docs/
  |__vi/
    |__guide/
    |__runtime-api/
    |__index.md
```

Finally, add your language to the .vitepress/config.ts (see the
[i18n](https://vitepress.dev/guide/i18n#internationalization) section on
VitePress docs to learn more).

```ts
export default defineConfig({
  ...
  locales: {
    root: {   // root english
      label: 'English',
      lang: 'en',
    },
    'vi': {   // added vietnamese
      label: 'Tiếng Việt',
      lang: 'vi',
      link: '/vi/',
    }
  }
  ...
})
```

When you have finished editing the translation, push your changes to your forked
repo, and then open a new Pull Request.
