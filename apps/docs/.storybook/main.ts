import type {StorybookConfig} from '@storybook/react-vite';

import {dirname, resolve} from "path"

import {fileURLToPath} from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

const config: StorybookConfig = {
    "stories": [
        "../stories/**/*.mdx",
        "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    "addons": [
        //getAbsolutePath('@chromatic-com/storybook'),
        getAbsolutePath('@storybook/addon-docs'),
        getAbsolutePath("@storybook/addon-a11y"),
        //getAbsolutePath("@storybook/addon-vitest")
    ],
    "framework": {
        "name": getAbsolutePath('@storybook/react-vite'),
        "options": {}
    },
    features: {
        interactions: false,
    },
    async viteFinal(config) {
        // Configure path aliases for the design-system package
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': resolve(__dirname, '../../../packages/design-system/src'),
        };
        return config;
    },
};
export default config;