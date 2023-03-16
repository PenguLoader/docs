# docs
Pengu Loader Docs, built on top of [VitePress](https://vitepress.dev/).

## How to run?

You need NodeJS 16+ and Yarn installed. Then clone the repo:

```
git clone https://github.com/PenguLoader/docs
```

Install dependencies and start development.
```
yarn install
yarn dev
```

Build and preview the production.
```
yarn build
yarn preview
```

## Help us translate the docs

First, you need to create a new folder in the **docs** folder. For example, `vi` for Vietnamese.

```
docs/
  |__guide/           |
  |__runtime-api/     | -> english docs
  |__index.md         |
  ...
  |__vi/              | -> vietnamese docs
```

Next, copy the doc files and folders from the root of the docs folder (except the language folders) and then paste them into your language folder.

```
docs/
  |__vi/
    |__guide/
    |__runtime-api/
    |__index.md
```

Finally, add your language to the .vitepress/config.ts (see the [i18n](https://vitepress.dev/guide/i18n#internationalization) section on VitePress docs to learn more).

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

When you are finished editing the translation, push your changes to your forked repo, and then open a new Pull Request.