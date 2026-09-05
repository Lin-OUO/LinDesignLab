import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const projectDirectory = resolve(process.cwd(), 'Materials', 'PROJECTS')
const imageExtension = /\.(avif|gif|jpe?g|png|webp)$/i
const videoExtension = /\.(m4v|mov|mp4|webm)$/i
const r2MediaBaseUrl = 'https://pub-47c9ae1d55ff424eaeb073930ad95ed1.r2.dev'
const r2ProjectVideos = {
  P1: ['01.mp4', '02.mp4'],
  P3: ['01.mp4'],
}

function parseIntroduction(text, label) {
  const nextLabel = '(?:封面标题|内标题|内容)'
  const match = text.match(new RegExp(`${label}：\\s*([\\s\\S]*?)(?=\\n\\s*${nextLabel}：|$)`))
  return match?.[1].trim() ?? ''
}

function getProjectManifest() {
  return readdirSync(projectDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map((entry) => {
      const folder = resolve(projectDirectory, entry.name)
      const entries = readdirSync(folder, { withFileTypes: true })
      const files = entries.filter((file) => file.isFile() && imageExtension.test(file.name)).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      const localVideos = entries.filter((file) => file.isFile() && videoExtension.test(file.name)).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      const videos = r2ProjectVideos[entry.name]
        ? r2ProjectVideos[entry.name].map((fileName) => `${r2MediaBaseUrl}/PROJECTS/${encodeURIComponent(entry.name)}/${encodeURIComponent(fileName)}`)
        : localVideos.map((file) => `/PROJECTS/${encodeURIComponent(entry.name)}/${encodeURIComponent(file.name)}`)
      const cover = files.find((file) => /^cover\./i.test(file.name)) ?? files[0]
      const introduction = entries.find((file) => file.isFile() && /^introduction\.(txt|md)$/i.test(file.name))
      const introductionText = introduction ? readFileSync(resolve(folder, introduction.name), 'utf8') : ''
      return {
        id: entry.name,
        cover: cover ? `/PROJECTS/${encodeURIComponent(entry.name)}/${encodeURIComponent(cover.name)}` : null,
        title: parseIntroduction(introductionText, '封面标题'),
        innerTitle: parseIntroduction(introductionText, '内标题'),
        description: parseIntroduction(introductionText, '内容'),
        videos,
        images: files.filter((file) => file.name !== cover?.name).map((file) => `/PROJECTS/${encodeURIComponent(entry.name)}/${encodeURIComponent(file.name)}`),
      }
    })
}

function projectManifestPlugin() {
  return {
    name: 'project-manifest',
    configureServer(server) {
      server.middlewares.use('/api/projects', (request, response, next) => {
        if (request.method !== 'GET') return next()
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(getProjectManifest()))
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'PROJECTS/projects-manifest.json', source: JSON.stringify(getProjectManifest()) })
    },
  }
}

// Keep user-managed assets in Materials. Vite serves and copies this folder as-is.
export default defineConfig({
  plugins: [react(), projectManifestPlugin()],
  publicDir: 'Materials',
  server: {
    watch: {
      // Media files are user-managed and may be open in an editor while the site is previewed.
      ignored: ['**/Materials/**'],
    },
  },
})
