const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers= require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe.only('Users Endpoints',()=>{
    let db
    const {testUsers}= helpers.makeThingsFixtures()
    const testUser= testUsers[0]
    before('make knex instance',()=>{
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db',db)
    })
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`,()=>{
        context(`User Validation`,()=>{
            beforeEach('insert users',()=>{
                helpers.seedUsers(db,testUsers)
            })

            const requiredFields= ['user_name','password','full_name']
            requiredFields.forEach(field=>{
                const registerAttemptBody={
                    user_name: 'test user_name',
                    password: 'test password',
                    full_name: 'test full_name',
                    nickname: 'test nickname'
                }
                it(`respond with 400 when ${field} is missing`,()=>{
                    delete registerAttemptBody[field]
                    return supertest(app).post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400,{
                            error: `Missing ${field} in request body`})
                })
                it(`respond 400 when password less than 8 characters`,()=>{
                    const userShortPassword={
                        user_name: 'test user_name',
                        password: '',
                        full_name: 'test full_name',
                    }
                    return supertest(app).post('/api/users')
                        .send(userShortPassword)
                        .expect(400,{error:'Password must be longer than 8 characters'})
                })
                it(`respond 400 when password longer than 72 characters`,()=>{
                    const userLongPassword={
                        user_name: 'test user_name',
                        password: '',
                        full_name: 'test full_name',
                    }
                    return supertest(app).post('/api/users')
                        .send(userLongPassword)
                        .expect(400,{error:'Password must be shorter than 72 characters'})
                })
                it(`respond 400 when password starts with spaces`,()=>{
                    const userPasswordStartsSpaces={
                        user_name: 'test user_name',
                        password: '',
                        full_name: 'test full_name',
                    }
                    return supertest(app).post('/api/users')
                        .send()
                        .expect(400,{error:'Password must not start or end with empty spaces'})
                })
                it(`respond 400 when password ends with spaces`,()=>{
                    const userPasswordEndsSpaces={
                        user_name: 'test user_name',
                        password: '',
                        full_name: 'test full_name',
                    }
                    return supertest(app).post('/api/users')
                        .send(userPasswordEndsSpaces)
                        .expect(400,{error:'Password must not start or end with empty spaces'})
                })
                it(`respond 400 error when password isn't complex enough`,()=>{
                    const userPasswordNotComplex={
                        user_name: 'test user_name',
                        password: '',
                        full_name: 'test full_name',
                    }
                    return supertest(app).post('/api/users')
                        .send(userPasswordNotComplex)
                        .expect(400,{error:'Password must contain 1 upper case,lower case,number and special character'})
                })
                it(`respond 400 when username already taken`,()=>{
                    const duplicateUser= {
                        user_name: testUser.user_name,
                        password: '11AAaa!!',
                        full_name: 'test full_name',
                    }
                    return supertest(app).post('/api/users')
                        .send()
                        .expect(400,{error:'Username already taken'})
                })
            })
        })
        context(`Happy path`,()=>{
            it(`responds 201,serialized user,storing bcryped password`,()=>{
                const newUser={
                    user_name: 'test user_name',
                    password: '11AAaa!',
                    full_name: 'test full_name'
                }
                return supertest(app).post('/api/users')
                    .send(newUser).expect(201)
                    .expect(res=>{
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.not.have.property('password')

                        expect(res.body.user_name).to.eql(newUser.user_name)
                        expect(res.body.full_name).to.eql(newUser.full_name)
                        expect(res.body.nickname).to.eql('')
                        
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`) 

                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    //after the POST req has responded, the db will look for a user with the ID in the respond body, then we can make sure that the user in the db has the same fields
                    expect(res=>
                        db.from('thing_users')
                            .select()
                            .where()
                            .first()
                            .then(row=>{

                                //make sure the password is hashed before it's stored
                                return bcrypt.compare(newUser.password,row.password)
                            })
                            .then(compareMatch=>{
                                expect(compareMatch).to.be.true
                            })
                        )
                    })
            })
        })
    })
})