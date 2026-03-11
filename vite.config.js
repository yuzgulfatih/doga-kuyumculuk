import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const GALLERY_EXT = /\.(jpg|jpeg|png|gif|webp|mp4|mov|webm|ogg)$/i

// public/assets klasöründeki medya dosyalarını listeler (dinamik galeri)
function galleryAssetsPlugin() {
  return {
    name: 'gallery-assets-list',
    resolveId(id) {
      if (id === 'virtual:gallery-assets') return '\0virtual:gallery-assets'
      return null
    },
    load(id) {
      if (id !== '\0virtual:gallery-assets') return null
      const dir = path.resolve(process.cwd(), 'public', 'assets')
      let list = []
      if (fs.existsSync(dir)) {
        list = fs.readdirSync(dir)
          .filter((name) => fs.statSync(path.join(dir, name)).isFile() && GALLERY_EXT.test(name))
          .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
      }
      return `export default ${JSON.stringify(list)}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    galleryAssetsPlugin(),
    // Kök assets klasörünü /assets olarak sun (dev) ve build'e kopyala
    {
      name: 'assets-from-root',
      configureServer(server) {
        server.middlewares.use('/assets', (req, res, next) => {
          const base = path.resolve(__dirname, 'assets')
          const target = path.join(base, req.url.replace(/^\//, '').split('?')[0])
          if (!target.startsWith(base)) return next()
          if (fs.existsSync(target) && fs.statSync(target).isFile()) {
            res.setHeader('Cache-Control', 'public, max-age=3600')
            fs.createReadStream(target).pipe(res)
          } else next()
        })
      },
      closeBundle() {
        const src = path.resolve(__dirname, 'assets')
        const dest = path.resolve(__dirname, 'dist', 'assets')
        if (fs.existsSync(src)) {
          fs.mkdirSync(dest, { recursive: true })
          for (const name of fs.readdirSync(src)) {
            const s = path.join(src, name)
            const d = path.join(dest, name)
            if (fs.statSync(s).isFile()) fs.copyFileSync(s, d)
          }
        }
      },
    },
  ],
  server: {
    proxy: {
      '/api/prices': {
        target: 'https://sukobfiyat.com',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('proxy error', err));
        },
      },
    },
  },
})
