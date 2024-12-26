## Getting Started

```js
resources-scanner

resources-scanner --config your-config-path.js
```

### config file

```js
module.exports = {
  folders: ["app"],
  pageFileName: "index",

  // for next js app router
  // pageFileName: "page",

  // e.g ["layout", "error", "not-found", "template"]
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
