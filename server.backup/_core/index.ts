import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(express.static(path.join(__dirname, '../../dist/client')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/client/index.html'))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/client/index.html'))
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`)
})
