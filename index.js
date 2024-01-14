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

 app.listen(port, () => {
    console.log(`Port running in: http://localhost:${port}`);
 });
 