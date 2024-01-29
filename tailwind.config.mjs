const colors = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{tsx, ts}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          ["Inter", ...fontFamily.sans],
          { fontFeatureSettings: '"ss04"' },
        ],
      },
      aspectRatio: {
        photo: "3/2",
      },
      colors: {
        gray: colors.neutral,
        // accent: {
        //   DEFAULT: colors.sky[600],
        //   ...colors.sky,
        // },
      },
    },
  },
};
