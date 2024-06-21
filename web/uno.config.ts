import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss';

export default defineConfig({
  presets: [
    // To force dark/light mode, set this to { dark: 'class' } and (for dark mode) add the `dark` class to `body` in `index.html`.
    presetUno({ dark: 'media' }),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        // You can swap these out for any existing Google fonts!
        sans: [
          { name: 'Open Sans', weights: ['300', '400', '500', '600', '700'] },
          {
            name: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            provider: 'none',
          },
        ],
        display: [
          {
            name: 'Poppins',
            weights: ['300', '400', '500', '600', '700', '800', '900'],
          },
          {
            name: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            provider: 'none',
          },
        ],
      },
    }),
  ],
  theme: {
    colors: {
      // Switch these out for alternative colors!
      // See https://www.tailwindshades.com/ to generate your own palette.
      primary: {
        DEFAULT: '#3B82F6',
        50: '#EBF0FE',
        100: '#D7E1FD',
        200: '#B0C7FB',
        300: '#89AEFA',
        400: '#6297F8',
        500: '#3B82F6',
        600: '#0B65E9',
        700: '#0850AF',
        800: '#053874',
        900: '#031D3A',
        950: '#010F1C',
      },
    },
    borderRadius: {
      // Input field corner radius
      input: '.5rem',
      // Button corner radius - set to '100rem' for fully rounded buttons!
      btn: '.5rem',
      // Larger buttons with more content inside
      bigbtn: '.75rem',
      // General "card" UI corner radius
      card: '1rem',
    },
  },
});
