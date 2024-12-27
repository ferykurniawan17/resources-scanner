type PageFileName = string | ((path: string) => boolean) | undefined;

type Exts = `.${string}`;

type SourceFiles = Record<string, `${string}.json`>;

interface Parser {
  parseFuncFromString: (...args: any) => any;
  parseTransFromString: (...args: any) => any;
  parseAttrFromString: (...args: any) => any;
}

type I18next = {
  list: Array<string>;
  transform: (parser: Parser, content: string) => any;
};

type TransformResourceGroupKey = (key: string) => string;

export type Config = {
  folders: Array<string>;
  pageFileName?: PageFileName;
  whitelistGlobalFiles: Array<string>;
  exts: Array<Exts>;
  output: string;
  sourceFiles: SourceFiles;
  alias: Record<string, string>;
  i18next?: I18next;
  transformResourceGroupKey?: TransformResourceGroupKey;
};

export type Files = Array<string>;

export type KeysMap = Record<string, string>;

export type FilesMap = {
  files?: Files;
  keys?: KeysMap;
};

export type KeysFileMap = Record<string, KeysMap>;
