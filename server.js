import express from 'express';
import GamesRoute from './routes/router.js'
import cors from 'cors'
import AccountRoute from './routes/account.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use(GamesRoute)

app.use('/api', AccountRoute)

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de votación de juegos de Edmundo Alvarez')
})

app.listen(2023, function (){
    console.log("El servidor está levantado! http://localhost:2023")
  })