import express from "express";
import { connection } from "./db/connectpg";
import * as dotenv from 'dotenv'
import {register} from "./contollers/authController"
import authRoutes from './routes/authRoutes'
dotenv.config()
const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

app.use('/', authRoutes)

const start =async () => {
    try {
       await connection();
        console.log('it has connected oo')
        app.listen(port, ()=>{
            console.log(`app connected on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
    
}
start()




