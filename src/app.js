import express, { urlencoded } from "express";
import { asyncHandler } from "./utils/asyncHandler.js";
import cors  from "cors";
import cookieParser from "cookie-parser";

// import { customError as CustomError } from "./utils/customError";
import home from "./static/home.html";
const app = express();
const router = express.Router()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true, limit:'16kb'})) // try removing "express."
app.use(express.static("public"))
app.use(cookieParser())


class CustomError extends Error {
    
    constructor(messsage,statusCode){

        super(messsage || 'error')
        this.statusCode = statusCode || 500;
        this.isOperational = true;
    }

}

router.get('/',(req,res,nxt) => {
    console.log('middleware');
    nxt()
})

router.get('/home',(req,res,nxt) => {
    console.log('middleware 2');
    nxt()
})


// app.use(router)


// app.use(['/','/about'], [mFn1,mFn2,mFn3],mFn4)

app.get(['/','/home'],(req,res) => {
    res.send(home);
})

app.get('/about',(req,res) => {
    console.log('about');
    res.send("about");
})

app.get('/profile',asyncHandler(async(req,res,next) => {
    res.send('Profile')
}))

app.all('*',(req,res,next)=>{

    let err = new CustomError('Page not found!', 404);
    next(err)
})



app.use((err,req,res,next)=>{

    console.log('error');
    res.status(err.statusCode).json({
        status : err.statusCode,
        message : err.message
    })
})

export {app}
