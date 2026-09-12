import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/vows-invites-2/",
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
});
