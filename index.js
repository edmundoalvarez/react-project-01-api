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

app.get("/", (req, res) => {
    const htmlResponse = `
    <html>
        <head>
            <title>Api Votación de Juegos</title>
        </head>
        <body>
            <h1>Accediste a la api de votación de juegos</h1>
        </body>
    </html>
    `;
    res.send(htmlResponse);
});

 app.listen(port, () => {
    console.log(`El servidor está corriendo: http://localhost:${port}`);
 });
 