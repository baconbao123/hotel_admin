import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "path";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), envCompatible()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },

});
