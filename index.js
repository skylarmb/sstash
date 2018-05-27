require('dotenv').config()
const serverless = require('serverless-http')
const express = require('express')
const app = express()
const mongo = require('mongodb').MongoClient
const uuid = require('uuid/v5')
const validate = require('uuid-validate')
const bodyParser = require('body-parser')
let db

// parse request bodies as JSON
app.use(bodyParser.json())

// async init function to connect to db as this may be a cold start on lambda
const _init = () => {
    // if already warm, resolve
    if (db) return Promise.resolve()
    // otherwise initiate a new connection to mongo
    return new Promise(async (resolve, reject) => {
        let client = await mongo.connect(process.env.DB_URL).catch(err => reject(err))
        db = client.db(process.env.DB_NAME)
        return resolve(db)
    })
}

app.get('/*', async (req, res) => {
    // make sure we are connected to the db (could be a cold start)
    await _init()
    // slice leading slash
    let url = req.originalUrl.slice(1)
    // if the path is a valid uuid, just fetch that id
    // else hash the full path and use that as the id
    let id = validate(url) ? url : uuid(url, uuid.URL)
    // fetch document
    let result = await db.collection('Item').findOne({_id: id})
    res.send(result)
})

app.post('/*', async (req, res) => {
    // get payload
    let insertObj = req.body
    // dont allow storing of empty object
    if (!Object.keys(insertObj).length) throw new Error('Empty body')
    // make sure we are connected to the db (could be a cold start)
    await _init()
    // slice leading slash
    let url = req.originalUrl.slice(1)
    // if the path is a valid uuid, just fetch that id
    // else hash the full path and use that as the id
    let id = validate(url) ? url : uuid(url, uuid.URL)
    // set explicit id
    insertObj._id = id
    // save document
    await db.collection('Item').insertOne(insertObj)
    // fetch document
    // TODO: might be able to get away with not fetching this and just returning the insertObj + id
    let result = await db.collection('Item').findOne({_id: id})
    res.send(result)
})


module.exports.handler = serverless(app)
