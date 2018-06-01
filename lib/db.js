const mongo = require('mongodb').MongoClient

class DB {
    constructor() {
        // .keep
        this.client = null;
    }

    // async init function to connect to db as this may be a cold start on lambda
    async init() {
        // if already warm, resolve
        if (this.client) return Promise.resolve(this.client)
        // otherwise initiate a new connection to mongo
        return new Promise(async (resolve, reject) => {
            let connection = await mongo.connect(process.env.DB_URL).catch(err => reject(err))
            this.client = connection.db(process.env.DB_NAME)
            return resolve(this.client)
        })
    }

}

module.exports = new DB()
