const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { delete } = require('../src/app')
const supertest = require('supertest')

describe.only('Auth Endpoints',()=>{
    let db

    const {testUsers}= helpers.makeThingsFixtures()
    const testUser= testUsers[0]

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/auth/login`, ()=>{
        beforeEach('insert users',()=>{
            //db.into('thingful').insert(testThings)
            helpers.seedUsers(db,testUsers)
        })
        const requiredFields=[`user_name`,`password`]
        requiredFields.forEach(field=>{
            const loginAttemptBody = {
                user_name: testUser.user_name,
                password: testUser.password
            }
            it(`responds with 400 when ${field} is missing`,()=>{
                delete loginAttemptBody[field]
                return supertest(app).post(`api/auth/login`)
                    .send(loginAttemptBody)
                    .expect(400,{error:`Missing ${field} in request body`})
            })
        })

    })
})