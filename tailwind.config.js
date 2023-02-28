/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        '500': '500ms',
      },
      keyframes: {
        slideUp: {
          '0%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
      },
      animation: {
        slideUp: 'slideUp 500ms ease-out',
        slideDown: 'slideDown 500ms ease-in'
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
