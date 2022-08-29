import express from 'express'
import config from './config'
import cors from 'cors'
import router from './routes/index.routes'

const app = express()

const port = config.PORT || 8080;

app.use(express.json())

const corsOptions = {
    origin: 'https://teppafrontend-c0569.web.app',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST, PATCH, DELETE"
}

app.use(cors(corsOptions));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use(express.urlencoded({ extended: true }))

app.use(express.static('src/public'))
app.use('/images', express.static('images'));

app.use(router)

app.listen(port, () => {
    console.log(`Server listening port ${port}`)
})