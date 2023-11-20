const express = require('express');
const bodyParser =require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db');
const app = express();
require('dotenv').config();

const userCreate = require('./routes/userRoutes');
const notes = require('./routes/noteRoutes');

app.use(cors());
app.use(bodyParser.json({extended:true,limit:'32mb'}));
app.use(bodyParser.urlencoded({limit:'32mb',extended:true}));

connectDB();

PORT = process.env.PORT || 8080;

app.use("/auth",userCreate);
app.use("/",notes);

app.listen(PORT,()=>{console.log(`Server Running On Port ${PORT}`)});