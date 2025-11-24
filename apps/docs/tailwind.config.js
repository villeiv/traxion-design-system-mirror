const traxionPreset = require("@traxion-global/design-system/tailwind-preset");

/** @type {import('tailwindcss').Config} */
export default {
    presets: [traxionPreset],
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../node_modules/@traxion-global/design-system/**/*.{js,ts,jsx,tsx}"
    ]
}

