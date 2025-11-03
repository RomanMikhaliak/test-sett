import { defineConfig, loadEnv } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { visualizer } from "rollup-plugin-visualizer";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import path from "path";

const gameName = process.env.VITE_GAME_NAME || "garden";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";
  const enableAnalyzer = env.ANALYZE === "true";

  return {
    base: "./",

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@core": path.resolve(__dirname, "./src/core"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@games": path.resolve(__dirname, "./src/games"),
        "@config": path.resolve(__dirname, "./src/config.ts"),
        "@app": path.resolve(__dirname, "./src/App.ts"),
      },
    },

    define: {
      __GAME_NAME__: JSON.stringify(gameName),
      __DEV__: JSON.stringify(!isProduction),
    },

    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: `assets/${gameName}/*`,
            dest: "assets",
          },
          {
            src: `assets/${gameName}/icon.png`,
            dest: ".",
            rename: "favicon.png",
          },
        ],

        hook: "writeBundle",
      }),

      ViteImageOptimizer({
        png: {
          quality: 80,
        },
        jpeg: {
          quality: 60,
        },
        jpg: {
          quality: 60,
        },

        webp: {
          quality: 75,
        },
        svg: {
          multipass: true,
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  cleanupNumericValues: false,
                  removeViewBox: false,
                },
              },
            },
            "sortAttrs",
            {
              name: "addAttributesToSVGElement",
              params: {
                attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
              },
            },
          ],
        },
        cache: true,
        cacheLocation: "./node_modules/.cache/vite-plugin-image-optimizer",
      }),

      enableAnalyzer &&
        visualizer({
          filename: "./dist/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
          template: "treemap",
        }),
    ].filter(Boolean),

    build: {
      target: "es2020",
      outDir: "dist",
      assetsDir: "assets",

      minify: true,

      sourcemap: !isProduction,

      cssCodeSplit: true,

      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log", "console.debug", "console.trace"],
              passes: 2,
            },
            mangle: {
              safari10: true,
              keep_classnames: true,
              keep_fnames: true,
            },
            format: {
              comments: false,
              safari10: true,
            },
            toplevel: false,
            module: false,
          }
        : {},

      rollupOptions: {
        output: {
          chunkFileNames: "chunks/[name]-[hash].js",
          entryFileNames: "entry/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("three")) {
                return "vendor-three";
              }

              if (id.includes("pixi")) {
                return "vendor-pixi";
              }

              if (id.includes("gsap")) {
                return "vendor-gsap";
              }

              if (id.includes("howler")) {
                return "vendor-howler";
              }

              return "vendor-other";
            }
          },
        },

        treeshake: isProduction
          ? {
              moduleSideEffects: false,
              propertyReadSideEffects: false,
              tryCatchDeoptimization: false,
            }
          : false,
      },
    },
    optimizeDeps: {
      include: ["three", "pixi.js", "gsap", "howler"],
      exclude: [],
    },

    server: {
      port: 3000,
      open: true,
      cors: true,
    },

    preview: {
      port: 4173,
      open: true,
    },
  };
});
