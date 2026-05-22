module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          background: '#0a0a0a',
          surface: '#121212',
          primary: '#00F0FF',
          secondary: '#7B2CBF',
          success: '#00E676',
          danger: '#FF1744',
          text: '#FFFFFF',
          textMuted: '#9E9E9E',
        },
        light: {
          background: '#F5F7FA',
          surface: '#FFFFFF',
          primary: '#0052FF',
          secondary: '#4A148C',
          success: '#00C853',
          danger: '#D50000',
          text: '#111827',
          textMuted: '#6B7280',
        }
      }
    },
  },
  plugins: [],
}
