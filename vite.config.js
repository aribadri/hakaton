import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig(({ command }) => {
  return {
    root: "src/",
    publicDir: "../static/",
    base: "./",
    plugins: [mkcert()],
    server: {
      host: true,
      https: true, // Включаем HTTPS для работы камеры на мобильных
    },
    assetsInclude: ["**/*.glb"],
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      sourcemap: true,
    },
  };
});
