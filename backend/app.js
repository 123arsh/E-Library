require('dotenv').config();

const express = require('express')
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const path = require('path');
const { connectMongoDB } = require('./connection')
const userRoutes = require('./routes/routes');
const booksData = require('./routes/books')

/*Middlewares*/
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(express.static(path.resolve('./public')));

/*API Routes*/
app.use('/', userRoutes)
app.use('/book', booksData)

connectMongoDB(process.env.Mongo_DB)
.then(()=> console.log('DataBase has been connected...'))
.catch(()=>console.log('Something troubling!!!'));

app.listen(PORT, ()=> console.log(`Server has been connected succesfully at port number ${PORT}`))