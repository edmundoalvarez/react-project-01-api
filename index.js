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


app.get('/home', (req, res) => {
    res.status(200).json('Welcome, your app is working well');
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Export the Express API
module.exports = app