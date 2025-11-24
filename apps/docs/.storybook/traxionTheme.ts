import { create } from 'storybook/theming';
import tokens from "@traxion-global/design-system/tokens.json";

export default create({
    base: 'light',

    colorPrimary: `hsl(${tokens.colors.primary})`,
    colorSecondary: `hsl(${tokens.colors.secondary})`,

    appBg: 'rgba(83, 86, 90, 0.02)',
    appContentBg: 'rgba(83, 86, 90, 0.02)',
    appPreviewBg: '#FFFFFF',
    appBorderRadius: 5,

    fontBase: '"Roboto", sans-serif',

    // Toolbar default and active colors
    barTextColor: '#9E9E9E',
    barSelectedColor: '#585C6D',
    barHoverColor: '#585C6D',
    barBg: 'rgba(83, 86, 90, 0.02)',

    buttonBorder: 'rgb(83, 86, 90)',
    booleanBg: 'rgb(83, 86, 90, 0.1)',
    booleanSelectedBg: '#FFF',

    brandTitle: 'Traxion Design System',
    //brandUrl: 'https://example.com',
    brandImage: 'https://traxion.global/hubfs/Traxion_LogotipoCT_Gris.png',
    brandTarget: '_self',
});