const express = require("express");
const GamesVotesController = require('../controllers/gamesVote.js')

const route = express.Router();

route.route('/:idGame/votes')
    .get(GamesVotesController.getVotes)
  
export default route;