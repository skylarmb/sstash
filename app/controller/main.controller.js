const validate = require('uuid-validate')
const uuid = require('uuid/v5')
const db = require('../../lib/db')
db.init()

class MainController {
    constructor() {
        //.keep
    }

    async show(req) {
        await db.init()
        // slice leading slash
        let url = req.originalUrl.slice(1)
        // if the path is a valid uuid, just fetch that id
        // else hash the full path and use that as the id
        let id = validate(url) ? url : uuid(url, uuid.URL)
        // fetch document
        let result = await db.client.collection('Item').findOne({_id: id})
        return result
    }

    async create(req) {
        await db.init()
        // get payload
        let insertObj = req.body
        // dont allow storing of empty object
        if (!Object.keys(insertObj).length) throw new Error('Empty body')
        // slice leading slash
        let url = req.originalUrl.slice(1)
        // if the path is a valid uuid, just fetch that id
        // else hash the full path and use that as the id
        let id = validate(url) ? url : uuid(url, uuid.URL)
        // set explicit id
        insertObj._id = id
        // save document
        await db.client.collection('Item').insertOne(insertObj)
        // fetch document
        // TODO: might be able to get away with not fetching this and just returning the insertObj + id
        let result = await db.client.collection('Item').findOne({_id: id})
        return result
    }

    async update(req) {
        await db.client.init()

    }

    async delete(req) {
        await db.client.init()

    }
}

module.exports = MainController
