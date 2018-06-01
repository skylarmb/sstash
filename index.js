require('dotenv').config()
const serverless = require('serverless-http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MainController = require('./app/controller/main.controller')
const controller = new MainController()
// parse request bodies as JSON
app.use(bodyParser.json())

app.get('/*', async (req, res) => {
    // make sure we are connected to the db (could be a cold start)
    let result = await controller.show(req)
    res.send(result)
})

app.post('/*', async (req, res) => {
    let result = await controller.create(req)
    res.send(result)
})


module.exports.handler = serverless(app)
