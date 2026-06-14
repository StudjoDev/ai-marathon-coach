/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F4F7F2",
        surface: "#FFFFFF",
        "surface-soft": "#EEF5F0",
        primary: "#2F6F64",
        success: "#2F8F66",
        warning: "#B7791F",
        danger: "#B94040",
        muted: "#6F7974",
        ink: "#16231E",
        line: "#DDE5DE"
      },
      boxShadow: {
        card: "0 10px 30px rgba(29, 49, 42, 0.08)"
      },
      borderRadius: {
        card: "8px"
      }
    }
  },
  plugins: []
};
