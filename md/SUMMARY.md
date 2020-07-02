# LEARNING A NEW CODEBASE:   
    # TAKE NOTES:
        db.raw && DISTINCT && author:
        leftjoin()
        json-function: 
            Link: https://www.postgresql.org/docs/9.5/functions-json.html  
            json_strip_nulls: Returns from_json with all object fields that have null values omitted. Other null values are untouched.
            json_build_object: Builds a JSON object out of a variadic argument list. By convention, the argument list consists of alternating keys and values.
        jwt-decode:
            Link: https://www.npmjs.com/package/jwt-decode 
            small library that helps decoding JWTs token which are Base64Url encoded.
        Treeize()
            Converts row data (in JSON/associative array format or flat array format) to object/tree structure based on simple column naming conventions. (https://www.npmjs.com/package/treeize)
            .grow() 

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
    #DEFINITION:
        Protected endpoint is an endpoint which can only be used by authenticated req
    # ENCODED VALUES: 
        values that human wouldn't be able to read and understand w/o using a machine (!= decode)
    # BASIC AUTH:
        involves Base64 endcoding 
        window.btoa() === ``
        window.localStorage.setItem('name', 'value') -> Check at application/storage/localStorage
        TokenService.saveAuthToken(
            TokenService.makeBasicAuthToken(value1,value2)
        )
    # BASIC TOKENS:
    # CREDENTIALS:
    # SENDING CREDENTIALS IN REQ:
# DATA PROTECTION:
    #Pseudonymised: 
        encryping PIN, masking info,hashing data
    #Hashing:
        Encrypt: secret code (can be converted)
        Hash: cannot be reverted, make it extremely difficult to guess
    #Bcrypt: 
        Definition:                                         A form of "hashing"
        Salt:                                               random text added to the string to be hashed (10->12)
        bcrypt.compare(bcrypt.hash('text'),'text')          compare a string with the hash we generated
        bcrypt.hashSync()
    #Logout:
# SECURE LOGIN:
    # PROBLEMS:
        Error server when using invalid credential with protected endpoints
        username and password are in the headers for every req, which can be decoded
    #JSON Web Tokens (JWT): 
        compact, self-contained tokens
        only represents credentials. It doesn't actually contain the username/passwrod, but can do the same job as them
        Tokens are split into 3 data segments separated by (.): Header, Payload, cryptographic signature
    