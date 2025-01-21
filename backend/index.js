const express=require('express')
const bodyParser=require('body-parser')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const router=require('./router/router')
const cors=require('cors')
const fileUpload = require("express-fileupload");

dotenv.config()
const port=process.env.PORT;
app.use(cors())
app.use(fileUpload());


mongoose.connect(process.env.MONGO_URL).then((e)=>console.log(`connected to mongoose`)).catch(error=>console.log(error));


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/api',router);

app.listen(port,()=>console.log(`Port is listening at ${port}`));
