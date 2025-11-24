import { addons, State } from 'storybook/manager-api';
import traxionTheme from "./traxionTheme";

addons.setConfig({
    theme: traxionTheme,
    toolbar: {
        zoom: { hidden: true }
    },
});