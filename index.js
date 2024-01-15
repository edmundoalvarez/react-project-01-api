import express from 'express';
import GamesRoute from './routes/router.js'
import cors from 'cors'
import AccountRoute from './routes/account.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use(GamesRoute)
app.use('/api', AccountRoute)


const port = process.env.PORT || 3000;

app.listen(2023, function (){
    console.log(`El servidor está levantado! http://localhost:${port}`)
  })