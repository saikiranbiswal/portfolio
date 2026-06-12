/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // warm cream — used for text/accents that sit ON video
        primary: '#DEDBC8',
        // clay design system (shared with the rest of the portfolio)
        paper: '#f3efe7',
        'paper-2': '#ece6da',
        card: '#faf8f3',
        ink: '#1c1815',
        'ink-soft': '#3a342d',
        muted: '#6f675b',
        faint: '#a59c8d',
        line: '#d8d0c1',
        clay: '#B06C3D',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
      },
    },
  },
  plugins: [],
};
