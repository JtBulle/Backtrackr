import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte({
      compilerOptions: {
        runes: true,
      },
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: "src/popup/popup.html",
      },
      output: {
        entryFileNames: "popup.js",
        chunkFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "popup.css") return "popup.css";
          return "[name].[ext]";
        },
      },
    },
    copyPublicDir: false,
  },
});
