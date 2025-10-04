import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rastaRed: '#dc2626',
        rastaGold: '#facc15',
        rastaGreen: '#16a34a',
      },
      boxShadow: { neon: '0 0 30px rgba(22,163,74,0.35)' },
      keyframes: {
        glow: {
          '0%,100%': { filter: 'drop-shadow(0 0 0 rgba(22,163,74,.7))' },
          '50%': { filter: 'drop-shadow(0 0 14px rgba(250,204,21,.7))' },
        },
      },
      animation: { glow: 'glow 2s ease-in-out infinite' },
    },
  },
  plugins: [],
}
export default config
