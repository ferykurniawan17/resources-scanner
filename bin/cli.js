#!/usr/bin/env node

const path = require("path");
const { Command } = require("commander");
const pkg = require("../package.json");
const scanner = require("../dist");

const program = new Command();

program
  .version(pkg.version)
  .usage("[options] <file ...>")
  .option("--config <config>", "Path to the config file", "");

program.parse(process.argv);

const options = program.opts();

if (!options.config) {
  program.help();
  process.exit(1);
}

const configPath = path.resolve(process.cwd(), options.config);

console.log(`Using config file: ${configPath}`);

try {
  const config = require(configPath);
  scanner(config);
} catch (error) {
  console.error(error);
  console.error(`Failed to load config file: ${configPath}`);
  process.exit(1);
}
