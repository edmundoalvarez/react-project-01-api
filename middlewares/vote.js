const { voteCreateSchema } = require('../schemas/voteSchema.js')

function validateVote(req, res, next){

    voteCreateSchema.validate(req.body, {
        stripUnknown: true,
    })
    .then(function(vote){
        
        req.body = vote
        console.log(req.body)
        next()
        
    })
    .catch(function(err){
        res.status(400).json({ error: err.message })
    })

}

export {
    validateVote
}