import { MongoClient, ObjectId } from 'mongodb';
import GamesService from './games.js'
import JudgesService from './judges.js'

const client = new MongoClient('mongodb+srv://edmundoalvarezok:Checho.150566@api-edi.six0hm3.mongodb.net/')
const db = client.db("api-juegos")
const judgeVotesCollection = db.collection('votes');

async function findVote(idJudge){
    await client.connect()

    return judgeVotesCollection.find({judge_id: new ObjectId(idJudge)}).toArray()
}

//!CHEQUEAR
async function hasVotedForGame(idJudge, gameId) {
    await client.connect();

    const existingVote = await judgeVotesCollection.findOne({
        judge_id: new ObjectId(idJudge),
        game_id: new ObjectId(gameId),
    });

    // Devuelve true si ya votó
    return !!existingVote;
}


async function createVote(idJudge, vote){
    await client.connect()

    const gameId = vote.game_id;

    const hasVoted = await hasVotedForGame(idJudge, gameId);
    if (hasVoted) {
        throw new Error('El juez ya ha votado por este juego');
    }

    if(vote.game_id){
        vote.game_id = new ObjectId(vote.game_id)
        
    }

    const game = await GamesService.getGameById(vote.game_id)

    const judge = await JudgesService.getJudgeById(idJudge)

    const newVote = {
        ...vote,
        judge_id: new ObjectId(idJudge),
        judge_email: judge.email,
        game_name: game.name,

    }

    if(game.totalVotes) {
        game.totalVotes += vote.jugabilidad
        game.totalVotes += vote.arte
        game.totalVotes += vote.sonido
        game.totalVotes += vote.afinidadALaTematica
    
        GamesService.updateTotalVotes(game.totalVotes, vote.game_id)
    
    } else {
        game.totalVotes = 0
        game.totalVotes += vote.jugabilidad
        game.totalVotes += vote.arte
        game.totalVotes += vote.sonido
        game.totalVotes += vote.afinidadALaTematica

        GamesService.updateTotalVotes(game.totalVotes, vote.game_id)

    }

    if(game.promJugabilidad){

        let voteJugabilidad = vote.jugabilidad;
        let voteArte = vote.arte;
        let voteSonido = vote.sonido;
        let voteAfinidadALaTematica = vote.afinidadALaTematica;

        for (const v of game.votes) {

            voteJugabilidad += v.jugabilidad
            voteArte += v.arte
            voteSonido += v.sonido
            voteAfinidadALaTematica += v.afinidadALaTematica

        }

        game.promJugabilidad = voteJugabilidad / (game.votes.length + 1)
        game.promArte = voteArte / (game.votes.length + 1)
        game.promSonido = voteSonido / (game.votes.length + 1)
        game.promAfinidadALaTematica = voteAfinidadALaTematica / (game.votes.length + 1)

        GamesService.updatePromVotes(game.promJugabilidad, game.promArte, game.promSonido, game.promAfinidadALaTematica, vote.game_id)

    } else {

        game.promJugabilidad = vote.jugabilidad
        game.promArte = vote.arte
        game.promSonido = vote.sonido
        game.promAfinidadALaTematica = vote.afinidadALaTematica

        GamesService.updatePromVotes(game.promJugabilidad, game.promArte, game.promSonido, game.promAfinidadALaTematica, vote.game_id)

    }

    await judgeVotesCollection.insertOne(newVote)

    GamesService.pushVotes(newVote, vote.game_id)
    JudgesService.pushVotes(newVote, idJudge)

    return newVote
}

export default {
    findVote,
    createVote
}