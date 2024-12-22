/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cgold: "#C29B49", // Color dorado personalizado
        cgreen: "#01833D", // Color verde personalizado
      },
      fontFamily: {
        acumin: ['Acumin Pro', 'sans-serif'], // Fuente personalizada
      },
    },
  },
  plugins: [],
};
