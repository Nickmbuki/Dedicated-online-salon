import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        porcelain: "#ffeaf7",
        pearl: "#f8d7ff",
        champagne: "#ff9ecd",
        rosewood: "#b1167d",
        sage: "#8b35d8",
        ink: "#30113f"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(177, 47, 134, 0.16)"
      }
    }
  },
  plugins: []
} satisfies Config;
