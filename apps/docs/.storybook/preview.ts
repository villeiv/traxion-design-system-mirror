import type {Preview} from '@storybook/react-vite'
import './globals.css';

const preview: Preview = {
    parameters: {
        layout: 'centered',
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
            expanded: false,
            disableSaveFromUI: true,
        },
        docs: {
            codePanel: true,
        },
        options: {
            storySort: {
                method: 'alphabetical',
            },
        },
    },
};

export default preview;