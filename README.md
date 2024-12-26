## Getting Started

```js
resources-scanner

resources-scanner --config your-config-path.js
```

### config fils

```js
module.exports = {
  folders: ["app"],
  pageFileName: "index",

  // for next js app router
  // pageFileName: "page",
  whitelistGlobalFiles: [],
  exts: [".js", ".ts", ".tsx"],
  output: "your-generated-folder",
  sourceFiles: {
    en: "your-messages-path/en.json",
    fr: "your-messages-path/fr.json",
  },
  alias: {},
};
```
