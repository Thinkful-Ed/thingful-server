CLIENT:
    https://github.com/gdreid13/thingful-client/blob/duy/src/services/thing-api-service.js
        headers: {
            //Authorization: `Schema ${userName}:${password}
            'authorization': `basic ${TokenService.getAuthToken}`,
        }
    App component:
        path={`/login'} && path={`/register`}:  PublicOnlyRoute
        path={`/thing/:thingId`}:               PrivateRoute
SERVER:
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
TEST:
    https://github.com/gdreid13/thingful-server/blob/Duy/test/CP5-auth-endpoints.spec.js 