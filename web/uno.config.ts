import { defineConfig, presetWebFonts, presetIcons, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Open Sans:300,400,500,600,700',
        display: 'Poppins:300,400,500,600,700,800,900',
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
      // primary: {
      //   '50': '#fffbeb',
      //   '300': '#fcd34d',
      //   '500': '#f59e0b',
      //   '600': '#d97706',
      //   '950': '#190601',
      // },
    },
  },
});
