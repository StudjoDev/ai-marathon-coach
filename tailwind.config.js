/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F4F7F2",
        surface: "#FFFFFF",
        "surface-soft": "#EEF5F0",
        "surface-selected": "#E4F0EC",
        "surface-success": "#E8F5EE",
        "surface-warning": "#FFF5E4",
        "surface-danger": "#FBEAEA",
        primary: "#2F6F64",
        success: "#2F8F66",
        warning: "#B7791F",
        danger: "#B94040",
        muted: "#6F7974",
        ink: "#16231E",
        line: "#DDE5DE",
        "race-c": "#6B5A78",
        "race-c-soft": "#F0ECF7",
        "race-c-line": "#DCD4E8"
      },
      boxShadow: {
        card: "0 4px 18px rgba(29, 49, 42, 0.06)",
        nav: "0 -12px 30px rgba(29, 49, 42, 0.08)",
        modal: "0 -18px 50px rgba(22, 35, 30, 0.22)",
        raised: "0 14px 34px rgba(47, 111, 100, 0.13)"
      },
      borderRadius: {
        card: "8px",
        sheet: "18px",
        control: "8px",
        pill: "999px"
      }
    }
  },
  plugins: []
};
