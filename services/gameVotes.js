import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb+srv://edmundoalvarezok:Checho.150566@api-edi.six0hm3.mongodb.net/')
const db = client.db("api-juegos")
const gameVotesCollection = db.collection('judges_votes');

async function findVote(idGame){
    await client.connect()
    return gameVotesCollection.find({game_id: new ObjectId(idGame)}).toArray()
    
}

export default {
    findVote
}