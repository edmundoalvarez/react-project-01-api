const express =  require("express");
const JudgesVotesController =  require('../controllers/judgesVote.js')

const route = express.Router();

route.route('/:idJudge/votes')
    .get(JudgesVotesController.getVotes)
    .post(JudgesVotesController.createVote)
  
export default route;