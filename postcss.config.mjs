// Tailwind v4 is configured entirely in CSS (see src/app/(frontend)/globals.css),
// so there is no tailwind.config.js — this plugin is the whole build-side setup.
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
