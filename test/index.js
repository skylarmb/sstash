require('dotenv').config()
const MainController = require('../app/controller/main.controller')
const controller = new MainController()
const chai = require('chai');
const validate = require('uuid-validate')
// const sinon = require('sinon');
const assert = chai.assert;
const expect = chai.expect;
const crypto = require('crypto')

describe('Main Functionality', async () => {
    let url;

    it('should create an object', async () => {
        url = '/foo/bar/' + await crypto.randomBytes(4).toString('hex')
        let req = {
            originalUrl: url,
            body: {
                a: 1,
                b: 'two',
                c: false
            }
        }

        let result = await controller.create(req)
        // original object returned
        expect(result.a).to.be.equal(1)
        expect(result.b).to.be.equal('two')
        expect(result.c).to.be.equal(false)
    })

    it('should retrieve the object', async () => {
        let req = {
            originalUrl: url
        }
        let result = await controller.show(req)
        // original object returned
        expect(result.a).to.be.equal(1)
        expect(result.b).to.be.equal('two')
        expect(result.c).to.be.equal(false)
        // returned with a valid id
        assert.isTrue(validate(result._id))


        req = {
            originalUrl: '/' + result._id
        }
        let idResult = await controller.show(req)

        // original object returned when fetched by ID instead of URL hash
        expect(idResult.a).to.be.equal(1)
        expect(idResult.b).to.be.equal('two')
        expect(idResult.c).to.be.equal(false)
        // returned with a valid id
        assert.isTrue(validate(idResult._id))
    })
})
