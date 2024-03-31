const express = require('express');
const bodyParser =require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db');
const app = express();
const userCreate = require('./routes/userRoutes');
const notes = require('./routes/noteRoutes');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json({extended:true,limit:'32mb'}));
app.use(bodyParser.urlencoded({limit:'32mb',extended:true}));

connectDB();

PORT = process.env.PORT||3000;

app.use("/auth",userCreate);
app.use("/",notes);

app.listen(PORT,()=>{console.log(`Server Running On Port ${PORT}`)});
