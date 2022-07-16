import express from 'express'
import connectDB from './db/connect.js'
import authRouter from './routes/v1/authRoutes.js'
import noteRouter from './routes/v1/noteRoutes.js'
import cors from "cors"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

const app = express()
const port = 8080
const url = 'mongodb+srv://Chase:Mdm190500@cluster0.ce8uh.mongodb.net/?retryWrites=true&w=majority'
app.use(cors())
app.use(express.json())
// const __dirname = dirname(dirname(fileURLToPath(import.meta.url)))
// app.use(express.static(path.resolve(__dirname, './frontend/build')))

app.get('/', (req, res) => {
  res.json({test:'Hello World!'})
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/note', noteRouter)

const start = async () => {
  try{
    await connectDB(url)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error);
  }
}

start()
