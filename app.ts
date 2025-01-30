import express, { urlencoded } from 'express'; 
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import cors from 'cors';
import movieRouter from './src/router/movie';
import authRouter from './src/router/auth.router';
import userRouter from './src/router/user.router';
import commentsRouter from './src/router/comments.router';


const app = express(); 

dotenv.config({
    path: './.env'
});  


app.use(
    cors({
        origin: process.env.CORS_ORIGIN, 
        credentials:true
    })
)

//Common middlewares
app.use(express.json()); 
app.use(express.urlencoded({extended:true, limit:"16KB"}));
app.use(express.static("public"));


// async function fetchMovies(){
//     const movies = 
// }

app.get('/', (req, res)=>{
    res.send("Jai Shree Ram");
})
app.use('/movie',movieRouter ); 
app.use('/authentication', authRouter);
app.use('/user', userRouter);
app.use('/comments', commentsRouter);
export {app}; 