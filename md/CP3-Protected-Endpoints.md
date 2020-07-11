# NOTES:
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
# ASSIGNMENT:
    Public:
        The GET /api/things 
    Basic auth:
        The GET /api/things/:thing_id 
        The GET /api/things/:thing_id/reviews 
        The POST /api/reviews endpoint (automatically assign a user_id)
    PrivateRoute:
        If a user tries to view reviews for a thing, they should be redirected to the login form page.
    PublicOnlyRoute:
        If a user attempts to view the login form when they're already logged in, they should be redirected to the thing list page.

    The thingful-client should store the base64 encoded credentials when the login form is submitted.
    The base64 encoded credentials should be sent in requests to protected endpoints.

# CLIENT:
    https://github.com/gdreid13/thingful-client/blob/duy/src/services/thing-api-service.js
        headers: {
            //Authorization: `Schema ${userName}:${password}
            'authorization': `basic ${TokenService.getAuthToken}`,
        }
    App component:
        path={`/login'} && path={`/register`}:  PublicOnlyRoute
        path={`/thing/:thingId`}:               PrivateRoute
# SERVER:
    https://github.com/gdreid13/thingful-server/blob/Duy/src/middleware/basic-auth.js 
        function requireAuth(req,res,next) {
            const authToken = req.get(`Authorization`) || ''
            if (!authToken.toLowerCase().startWith('basic')){
                return res.status(401).json({error:`Missing basic token`});
            }
            next()
        }
    router.js
        const {requireAuth} = require()
        + .all(requireAuth) for each Protected Route
# TEST:
    https://github.com/gdreid13/thingful-server/blob/Duy/test/CP5-auth-endpoints.spec.js 