import express from 'express'
import config from './config'
import cors from 'cors'
import router from './routes/index.routes'
import bodyParser from 'body-parser'
import User from './models/User'

const app = express()

app.use(express.json())

app.use(cors({ credentials: true, origin: 'http://localhost:8080' }))

app.use(express.urlencoded({ extended: true }))

app.use(express.static('src/public'))
app.use('/images', express.static('images'));

app.use(router)

app.listen(8080, () => {
    console.log(`Server listening port ${config.PORT}`)
})