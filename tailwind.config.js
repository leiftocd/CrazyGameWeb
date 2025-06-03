/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "450px", // Custom 450px breakpoint
      },
      colors: {
        "custom-blue": "#1DA1F2", // Custom color
        "header-color": "rgba(33, 34, 51, 0.9);",
        "search-header-color": "#373952;",
        "white-100": "#f9faff",
        "button-violet": "rgb(104, 66, 255);",
        "gray-bg": "rgba(255, 255, 255, 0.1);",
        "scrollbar-color": "rgb(170, 173, 190)",
      },
      spacing: {
        18: "4.5rem", // Custom spacing (450px / 100 = 4.5rem)
      },
      boxShadow: {
        "custom-inset": "inset 0px -20px 20px 20px #000000",
      },
    },
  },
  plugins: [],
};
