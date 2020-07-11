# NOTES:
    # PROBLEMS:
        Error server when using invalid credential with protected endpoints
        username and password are in the headers for every req, which can be decoded
    #JSON Web Tokens (JWT): 
        compact, self-contained tokens
        only represents credentials. It doesn't actually contain the username/passwrod, but can do the same job as them
        Tokens are split into 3 data segments separated by (.): Header, Payload, cryptographic signature

# ASSIGNMENT:
    Create a POST/login endpoint that responds with a JWT(JSON Web Tokens)
    Update login form to store the JWT from the res in local storage 
    Change middleware to verify the JWT instead of verifying the base64 encoded basic auth header