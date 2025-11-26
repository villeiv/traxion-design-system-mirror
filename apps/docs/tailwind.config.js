const traxionPreset = require("@traxion-global/design-system/tailwind-preset");

/** @type {import('tailwindcss').Config} */
export default {
    presets: [traxionPreset],
    content: [
        "./stories/**/*.{js,ts,jsx,tsx}",
        "./stories/sources/**/*.{js,ts,jsx,tsx}",
        "../../node_modules/@traxion-global/design-system/**/*.{js,ts,jsx,tsx}"
    ]
}

