const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Things Endpoints', function() {
  let db
  const {testUsers,testThings,testReviews,} = helpers.makeThingsFixtures()
  const testUser=testUsers[0]

  before('makeAuthHeader knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('cleanup', () => helpers.cleanTables(db))
  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/things`, () => {
    context(`Given no things`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/things')
          //.set('Authorization',helpers.makeAuthHeader(testUser,secret=process.env.JWT_SECRET))
          .expect(200, [])
      })
    })
    context('Given there are things in the database', () => {
      beforeEach('insert things', () =>
        helpers.seedThingsTables(
          db,
          testUsers,testThings,testReviews,)
      )
      it('responds with 200 and all of the things', () => {
        const expectedThings = testThings.map(thing =>
          helpers.makeExpectedThing(
            testUsers,thing,testReviews,)
        )
        return supertest(app)
          .get('/api/things')
          //.set('Authorization',helpers.makeAuthHeader(testUser,secret=process.env.JWT_SECRET))
          .expect(200, expectedThings)
      })
    })
    context(`Given an XSS attack thing`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousThing,
        expectedThing,
      } = helpers.makeMaliciousThing(testUser)

      beforeEach('insert malicious thing', () => {
        return helpers.seedMaliciousThing(
          db,
          testUser,
          maliciousThing,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/things`)
          //.set('Authorization',helpers.makeAuthHeader(testUser,secret=process.env.JWT_SECRET))
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedThing.title)
            expect(res.body[0].content).to.eql(expectedThing.content)
          })
      })
    })
  })

  describe(`GET /api/things/:thing_id`, ()=>{
    console.log(helpers.makeAuthHeader(testUser))
    context(`Given no XSS attack`,()=>{
      beforeEach('insert test table',()=>helpers.seedThingsTables(db,testUsers,testThings,testReviews))
      it(`Given thing doesn't exist`,()=>{
        const thingId = 123456
        return supertest(app).get(`/api/things/${thingId}`)
          .set('Authorization',helpers.makeAuthHeader(testUser))
          .expect(404, { error: `Thing doesn't exist` })
      })
      it(`Given thing does exist`,()=>{
        const thingId = 2
        const expectedThing = helpers.makeExpectedThing(
          testUsers,testThings[thingId - 1],testReviews,
        )
        return supertest(app).get(`/api/things/${thingId}`)
          .set('Authorization',helpers.makeAuthHeader(testUser))
          .expect(200, expectedThing)
      })

    })
    context(`Given an XSS attack`,()=>{
      const {maliciousThing,expectedThing,} = helpers.makeMaliciousThing(testUser)
      beforeEach('insert malicious thing', () => {
        return helpers.seedMaliciousThing(
          db,testUser,maliciousThing,
        )
      })
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/things/${maliciousThing.id}`)
          .set('Authorization',helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedThing.title)
            expect(res.body.content).to.eql(expectedThing.content)
          })
      })
    })
  })

  describe(`GET /api/things/:thing_id/reviews`,()=>{
    context(`Given no XSS attack`,()=>{
      beforeEach('insert test table',()=>helpers.seedThingsTables(db,testUsers,testThings,testReviews))
      it(`Given review for thing that doesn't exist`,()=>{
        const thingId = 123456
        return supertest(app).get(`/api/things/${thingId}/reviews`)
          .set('Authorization',helpers.makeAuthHeader(testUser))
          .expect(404, { error: `Thing doesn't exist` })
      })
      it(`Given review for thing that does exist`,()=>{
        const thingId = 2
        const expectedReviews = helpers.makeExpectedThingReviews(
          testUsers,thingId,testReviews
        )
        //console.log(`expected review`,expectedReviews)
        return supertest(app).get(`/api/things/${thingId}/reviews`)
          .set('Authorization',helpers.makeAuthHeader(testUser))
          .expect(200, expectedReviews)
      })
    })
    context.skip(`Given an XSS attack`,()=>{

    })

  })
  /*
  describe(`GET /api/things/:thing_id`, () => {
    context(`Given no things`, () => {
      beforeEach(()=>db.into('thingful_users').insert(testUsers))
      it(`responds with 404`, () => {
        const thingId = 123456
        
      })
    })
    context('Given there are things in the database', () => {
      beforeEach('insert things',()=>helpers.seedThingsTables(db,testUsers,testThings,testReviews))
      it('responds with 200 and the specified thing', () => {
        
      })
    })
    context(`Given an XSS attack thing`, () => {
      
    })
  })
*/
  
})
