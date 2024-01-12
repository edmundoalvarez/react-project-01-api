import express from 'express'
import GamesController from '../controllers/games.js'
import GamesVotesRoute from './gamesVotes.js'
import JudgesController from '../controllers/judges.js'
import JudgesVotesRoute from './judgesVotes.js'
import { validateVote } from '../middlewares/vote.js'
import { verifySession } from '../middlewares/account.js'
import {validateGame} from '../middlewares/game.js'

const route = express.Router()

route.get('/games', GamesController.getGames)
route.post('/games', [validateGame], GamesController.createGame)
route.get('/games/:idGame', GamesController.getGameById)
route.patch('/games/:idGame', [validateGame], GamesController.updateGame)
route.delete('/games/:idGame', GamesController.deleteGame)
route.use('/games', GamesVotesRoute)

route.get('/judges', JudgesController.getJudges)
route.get('/judges/:idJudge', JudgesController.getJudgeById)
route.use('/judges', [validateVote], JudgesVotesRoute)

export default route