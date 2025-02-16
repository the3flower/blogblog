/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs:"375px",
      sm: "425px",
      md: "768px",
      lg: "976px",
      large: "1024px",
      xl: "1440px",
      xxl: "2048px",
    },
    colors: {
      blue: "#1fb6ff",
      purple: "#7e5bef",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#13ce66",
      yellow: "#ffc82c",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#d3dce6",
      "light-border": "#f5f5f5",
      "darker-border": "#e9e9e9",
      "primary-gray": "#3f3f3f",
      "secondary-gray": "#b6b6b6;",
    },
    fontFamily: {
      // sans: ["Graphik", "sans-serif"],
      // serif: ["Merriweather", "serif"],
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ffffff",

          secondary: "#000000",

          accent: "#3f3f3f",

          neutral: "#bebebe",

          "base-100": "#ffffff",

          info: "#1fb6ff",

          success: "#51d06d",

          warning: "#e5c000",

          error: "#ff6a6a",
        },
      },
    ],
  },
};
