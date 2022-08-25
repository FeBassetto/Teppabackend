import express from 'express'
import config from './config'
import cors from 'cors'
import router from './routes/index.routes'

const app = express()

const port = config.PORT || 8080;

app.use(express.json())

app.use(
    cors({
        origin: "*",
    })
);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.urlencoded({ extended: true }))

app.use(express.static('src/public'))
app.use('/images', express.static('images'));

app.use(router)

app.listen(port, () => {
    console.log(`Server listening port ${port}`)
})