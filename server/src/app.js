import express from 'express';


const app = express();


app.use('/', (req, res)=>{
    res.send(`Server is working`)
})



export default app;