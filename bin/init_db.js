require('dotenv').config()
const mongo = require('mongodb').MongoClient

const init = async () => {
    let client = await mongo.connect(process.env.DB_URL)
    let db = client.db(process.env.DB_NAME)
    await db.createCollection('Item')
    db.close()
    console.log('DB initialized.')
}

init()
