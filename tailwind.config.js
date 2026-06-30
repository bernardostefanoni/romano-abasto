/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EC',
        creamDark: '#F1E9D8',
        crate: '#C8553D',
        crateDark: '#A8442F',
        mustard: '#D99A3D',
        leaf: '#2F5233',
        leafLight: '#4C7350',
        sage: '#8FA988',
        charcoal: '#2B2620',
        line: '#E4DAC4',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        tag: ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        soft: '0 6px 20px -8px rgba(43, 38, 32, 0.18)',
      },
    },
  },
  plugins: [],
}
