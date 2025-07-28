#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

/**
 * Recursively collect a tree of `dir` into the `lines` array.
 *
 * @param {string} dir     – directory to scan
 * @param {string} prefix  – prefix for this level (used internally)
 * @param {string[]} lines – array to collect each line of the tree
 */
function collectTree(dir, prefix, lines) {
  const entries = fs
    .readdirSync(dir)
    .map((name) => {
      const full = path.join(dir, name);
      return { name, full, isDir: fs.statSync(full).isDirectory() };
    })
    .sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.name.localeCompare(b.name);
    });

  entries.forEach((entry, idx) => {
    const isLast = idx === entries.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    lines.push(prefix + pointer + entry.name);

    if (entry.isDir) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      collectTree(entry.full, newPrefix, lines);
    }
  });
}

// --- Script entrypoint ---
const targetDir = process.argv[2] || ".";
const outputFile = process.argv[3] || "tree.txt";

const absTarget = path.resolve(targetDir);
const header = [absTarget];
const lines = [];

// build tree
collectTree(targetDir, "", lines);

// write to file
fs.writeFileSync(outputFile, header.concat(lines).join("\n") + "\n", "utf8");

console.log(`📁 Directory tree of "${absTarget}" written to ${outputFile}`);
