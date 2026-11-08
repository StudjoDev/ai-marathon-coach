/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E0E0E",
        paper: "#FFFFFF",
        soft: "#F3F3F3",
        line: "#EBEBEB",
        "line-dark": "#2E2E2E",
        muted: "#6B6B6B",
        "muted-dark": "#A3A3A3",
        accent: "#FF5A1F",
        "accent-ink": "#C2410C"
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", "sans-serif"],
        display: ["Barlow Condensed", "-apple-system", "PingFang TC", "Noto Sans TC", "sans-serif"]
      }
    }
  },
  plugins: []
};
