import express from "express"
import dotenv from "dotenv"
import Approutes from "./src/route/index.js"
dotenv.config()


const app = express()
app.use(express.json())
app.use('/api',Approutes)

//const PORT=6000
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`))