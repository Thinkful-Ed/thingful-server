# NOTES:
    
    #Logout:
# ASSIGNMENT:
    CLIENT:
        Implement the logout button functionality to clear the token in local storage:
            components/Header/header.js:
                + TokenService.clearAuthToken()
    SERVER:
        Install bcryptjs: npm i bcryptjs
        Update db seeding data to use hashed passwords, using bcrypt:
            RUN :           bcrypt.hash('password',12).then(hash=>console.log({hash}))
            UPDATE DATA:    ./seeds/seed.thingful_tables.sql
            SEED DATA:      psql -U dunder_mifflin -d thingful -f ./seeds/seed.thingful_tables.sql
        Update basic-auth middleware to use bcrypts to compare the password in the basic token with the hash
            ./src/middleware/basic-auth.js:     update requireAuth() (using bcrypt.compare())
        Others:
            ./test/test-helps.js :              Add seedUsers(), Edit seedThingsTables
            ./test/things-endpoints.spec.js:    use seedUsers() beforeEach test
   
        
        
        
