# LEARNING A NEW CODEBASE:   
    # TAKE NOTES:

    # PROJECT GENERAL IDEA:
        To list the dir:            tree -I node_modules -d
        To install tree:            brew install tree || sudo apt i tree
        To show avai commands:      npm run
    # FIGURE OUT HOW TO RUN THE PROJECT
        To create db:               CREATE DATABASE <dbName> OWNER <roleName>;
        To run migrate:             npm run migrate
        To seed db:                 psql -U <roleName> <dbName> -f <filePath>
                                    copy <dbName> FROM <filePath>
    # FIND THE INTERFACE OF THE PROJECT:
        Frontend:   through the browser, using buttons on the page,and routes in the address bar
        Backend:    through API endpoints
        Tests:
            Files:  xxx.test.js || xxx.spec.js
            Syntax: npm run migrate:test (run the migrations for the test database)
    # DISCUSSION:

# PROTECTED ENDPOINTS:
    # ENCODED VALUES: 
        values that human wouldn't be able to read and understand w/o using a machine
        window.btoa() === ``
        window.localStorage.setItem('name', 'value') -> Check at application/storage/localStorage
        TokenService.saveAuthToken(
            TokenService.makeBasicAuthToken(value1,value2)
        )
    # SENDING CREDENTIALS IN REQ:
    