require("dotenv").config(); // <- Importar dotenv
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose'); // <- Mongoose
const cors = require("cors"); // <- cors

//Iniciar conexión a la DB
mongoose.connect(process.env.DB, {
    useUnifiedTopology: true
})
.then((x)=>{
    console.log(`Connect to Mongo! Database name: "${x.connections[0].name}"`)
}).catch((err)=>{
    console.log("Error connecting to mongo", err)
});

const app = express();

//CORS después de inicializar express
//Da permiso a otras apps
app.use(cors({origin:["http://localhost:3000", "https://www.paginasubida.com"], credentials: true}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Estas son las rutas, por practica se añade API
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;
