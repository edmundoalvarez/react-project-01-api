import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb+srv://edmundoalvarezok:Checho.150566@api-edi.six0hm3.mongodb.net/')
const db = client.db("api-juegos")
const judgeCollection = db.collection('accounts');

function filterQueryToMongo(filter){

  const filterMongo = {}

  for (const field in filter) {
    
    if(isNaN(filter[field])){
      filterMongo[field] = filter[field]
    } 
  }
  return filterMongo;
}

async function getJudges(filter={}){
  await client.connect()

  const filterMongo = filterQueryToMongo(filter)

  return judgeCollection.find(filterMongo).toArray();
}

async function getJudgeById(id){
  await client.connect()
  return judgeCollection.findOne({_id: new ObjectId(id)});
}

async function pushVotes(data, id) {
  await client.connect()

  return judgeCollection.updateOne({_id: new ObjectId(id)}, { $push: {votes: data}})

}

export default {
    getJudges,
    getJudgeById,
    pushVotes,
    judgeCollection
  }

export {
  getJudgeById
}

