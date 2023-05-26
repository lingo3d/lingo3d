import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import monacoEditorPlugin from "vite-plugin-monaco-editor"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        {
            name: "isolation",
            configureServer(server) {
                server.middlewares.use((_req, res, next) => {
                    res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
                    res.setHeader(
                        "Cross-Origin-Embedder-Policy",
                        "require-corp"
                    )
                    next()
                })
            }
        },
        preact(),
        monacoEditorPlugin({})
    ]
})
