import { GameSchema } from "../schemas/gameSchema.js";

export function validateGame(req, res, next) {

    GameSchema.validate(req.body, {
        stripUnknown: true,
        abortEarly: false,

    })
    .then(async function (data) {
        req.body = data;
        next();
    })
    .catch(function (error) {
        res.status(400).json({msg: error.errors})
    })

}
