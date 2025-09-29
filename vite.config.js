import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    root: "src/",
    publicDir: "../static/",
    base: "./",
    server: {
      host: true,
      ...(isDev && {
        https: {
          key: fs.readFileSync(
            path.resolve(__dirname, "certs/localhost-key.pem")
          ),
          cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost.pem")),
        },
      }),
    },
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      sourcemap: true,
    },
  };
});
