# Getting Started

## Installation

```sh
npm install --save-dev resources-scanner
```

or

```sh
npm install -g resources-scanner
```

Examples: [Here](https://github.com/ferykurniawan17/resources-scanner/tree/main/examples)

## Usage CLI

```sh
resources-scanner --config your-config-path.js
```

## Results

config

```js
{
  ...,
  locales: ["en", "id"],
  output: "json-sources",
  pageFileName: "page",

  // without transformResourceGroupKey
}

```

Project Structure with Nextjs app router

```
- src
  - app
    - layout.tsx
    - page.tsx
    - about-us
      - page.tsx
    - contact
      - page.tsx
```

Resources output

```
- json-sources
  - en.json
  - id.json
  - about-us
    - en.json
    - id.json
  - contact
    - en.json
    - id.json
```

## Config file

```js
module.exports = {
  folders: ["src/app"],
  pageFileName: "index",
  whitelistGlobalFiles: [],
  exts: [".js", ".ts", ".tsx"],
  output: "your-generated-folder",
  sourceFiles: {
    en: "your-messages-path/en.json",
    fr: "your-messages-path/fr.json",
  },
  alias: {},
  i18next: {
    transform: function (parser, content) {
      return {};
    },
    list: ["t", "i18next.t", "i18n.t"],
  },
  transformResourceGroupKey: function (pagePath) {
    const removeExt = pagePath.replace(/\.(tsx|js|jsx|ts|mjs)$/, "");

    // remove spalsh to underscore
    const removeSlash = removeExt.replace(/\//g, "_");

    return removeSlash;
  },
};
```

### folders

```js
{
  ...,
  folders: ["src/app"],
}
```

Allow multiple folder group pages

### pageFileName

```js
{
  ...,
  pageFileName: "page",
}
```

The name of the page file, typically used to reference the main entry point of the page.

### whitelistGlobalFiles

```js
{
  ...,
  whitelistGlobalFiles: ["template", "layout", "error"],
}
```

Use for layout, template, and other templating pages. Add further descriptions as needed.

### exts

```js
{
  ...,
  exts: [".js", ".ts", ".tsx"],
}
```

Specify the file extensions to be scanned. This allows the scanner to process only the files with the given extensions.

### output

```js
{
  ...,
  output: "your-generated-folder",
}
```

Specify the folder where the generated files will be saved. This is the output directory for the scanned resources.

### sourceFiles

```js
{
  ...,
  sourceFiles: {
    en: "your-messages-path/en.json",
    fr: "your-messages-path/fr.json",
  },
}
```

Specify the paths to the source files for different languages. These files contain the messages that will be scanned and processed. The keys represent the language codes, and the values are the paths to the corresponding message files.

### alias

```js
{
  ...,
  alias: {
    "@/": "src/",
  }
}
```

Specify path aliases to simplify module imports. This allows you to use shorter paths when importing modules, making the code cleaner and easier to maintain.

### i18next.transform

```js
{
  ...,
  i18next: {
    transform: function (parser, content) {
      parser.parseFuncFromString(
        content,
        { list: ['t', 'i18next.t', 'i18n.t'] },
        function(key) {
          parser.set(key, {
                ...options,
                nsSeparator: false,
                keySeparator: false,
                defaultNs: "",
              });
        }
      );

      parser.parseTransFromString(content, function(key, options) {
        options.defaultValue = key; // use key as the value
        parser.set(key, options);
      });

      parser.parseAttrFromString(content, function(key) {
        const defaultValue = key; // use key as the value
        parser.set(key, defaultValue);
      });

      const result = parser.get();

      if (result.en && result.en.translation) {
        return result.en.translation;
      }

      return {};
    },
    ...
  },
}
```

The `transform` function is used to customize how the content is parsed and transformed. In this example,

use standard API of [i18next-scanner](https://github.com/i18next/i18next-scanner/blob/master/README.md) to parse the content.

this `transform` required to return the keys

```js
return parser.get();
```

### i18next.list

```js
{
  ...,
  list: ["t", "i18next.t", "i18n.t"],
}
```

list - An array of strings representing different ways to access the translation function in i18next. This property contains a list of possible identifiers for the translation function used in i18next.

It includes shorthand notations and fully qualified names to ensure compatibility with various usage patterns.

### transformResourceGroupKey

```js
{
  ...,
  transformResourceGroupKey: function (pagePath) {
    const removeExt = pagePath.replace(/\.(tsx|js|jsx|ts|mjs)$/, "");

    // remove spalsh to underscore
    const removeSlash = removeExt.replace(/\//g, "_");

    return removeSlash;
  },

  // Output
  - json-sources
    - pages_about-us_page
      - en.json
      - id.json
    - pages_page
      - en.json
      - id.json
    - pages_article_bussines_page
      - en.json
      - id.json
}
```

Transform the path to match your URL structure.

- @param {string} pagePath - The path of the page to be transformed.
- @returns {string} - The transformed page path with no file extension and slashes replaced by underscores.

If there are duplicate group keys, the keys within them will be merged.

## License

MIT
