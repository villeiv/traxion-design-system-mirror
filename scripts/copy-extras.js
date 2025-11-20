const { cpSync, mkdirSync } = require("node:fs");
const { dirname } = require("node:path");

function copy(from, to) {
    try {
        mkdirSync(dirname(to), { recursive: true });
        cpSync(from, to);
        console.log(`[design-system] Copied: ${from} -> ${to}`);
    } catch (err) {
        console.error(`[design-system] Error copying ${from}:`, err);
        process.exit(1);
    }
}

copy("./src/styles/theme.css", "./dist/theme.css");
copy("./src/tokens/tokens.json", "./dist/tokens.json");
copy("./src/tailwind/tailwind-preset.cjs", "./dist/tailwind-preset.cjs");
