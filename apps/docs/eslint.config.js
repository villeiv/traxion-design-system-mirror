import {config} from "@repo/eslint-config/react-internal";
import storybook from "eslint-plugin-storybook";

/**
 * ESLint config for the Storybook app (`apps/docs`)
 * Extends the monorepo's internal config + Storybook plugin.
 */
export default [...config,
    {
        files: ["**/*.stories.@(ts|tsx|js|jsx|mdx)", ".storybook/**/*.{ts,tsx,js,jsx}"],
        plugins: {
            storybook,
        },
        rules: {
            ...storybook.configs.recommended.rules,
        },
    },
    {
        ignores: ["dist", "storybook-static"],
    },
];
