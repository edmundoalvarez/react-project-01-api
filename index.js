const express = require('express');
const GamesRoute = require('./routes/router.js')
const cors = require('cors')
const AccountRoute = require('./routes/account.js')

const app = express()
app.use(express.json())
app.use(cors())

app.use(GamesRoute)
app.use('/api', AccountRoute)


const port = process.env.PORT || 2023;

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
    console.log(`Port running in: http://localhost:${port}`);
 });
 