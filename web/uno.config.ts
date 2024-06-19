import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
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
      primary: {
        '50': 'rgb(239 246 255)',
        '300': 'rgb(147 197 253)',
        '500': 'rgb(59 130 246)',
        '600': 'rgb(37 99 235)',
        '950': 'rgb(11 23 39)',
      },
      // Example: switching out theme colors
      // primary: {
      //   '50': '#fef2f2',
      //   '300': '#fca5a5',
      //   '500': '#ef4444',
      //   '600': '#dc2626',
      //   '950': '#450a0a',
      // },
    },
    borderRadius: {
      // Input field corner radius
      input: '.25rem',
      // Button corner radius
      btn: '.5rem',
      // Larger buttons with more content inside
      bigbtn: '.75rem',
      // General "card" UI corner radius
      card: '1rem',
    },
  },
});
