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
});
