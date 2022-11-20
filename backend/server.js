const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require('./routes/userRoute')
const errorHandler = require('./middleware/errorMiddleware')
const cookieParser = require('cookie-parser')
const app = express()


//middleware
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieParser())
//
app.use('/api/users',userRoute)

//undefined routes
app.use('*',(req,res)=>{
    res.status(404).json({
        message:"This route is not Found"
    })
})
//Error Middleware

app.use(errorHandler)
//db
mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('DB connected');
}).catch((err)=>{
    console.log(err);
})
//server 
const port =process.env.PORT || 5000
app.listen(port,()=>console.log(`server running in port ${port}`))