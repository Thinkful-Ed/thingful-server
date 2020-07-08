const bcrypt = require('bcryptjs')
const AuthService = require('../auth/auth-service');

function requireAuth(req,res,next) {
    //console.log(req.get(`Authorization`))
    const authToken = req.get(`Authorization`) || ''
    if (!authToken.toLowerCase().startsWith('basic')){
        return res.status(401).json({error:`Missing basic token`});
    }

    let basicToken=authToken.slice(6,authToken.length)
    const[tokenUserName, tokenPassword]= AuthService.parseBasicToken(basicToken)
    
    //console.log(tokenUserName)
    //console.log(basicToken)
    if (!tokenUserName || !tokenPassword) {
        return res.status(401).json({error:`Unauthorized request`})
    }
    let currentUser;
    AuthService.getUserWithUserName(req.app.get('db'),tokenUserName)
        .then(user=>{
            console.log(user) 
            if(!user) res.status(401).json({error:`Unauthorized request`})
            currentUser=user;
            console.log(currentUser.password)
            return AuthService.comparePasswords(tokenPassword,user.password) 
                .then(passwordsMatch=>{
                    if(!passwordsMatch) return res.status(401).json({error:'Unauthorized request'})
                    req.user=currentUser
                    next()
                })
        // if tokenPassword === currentUser.password
        })
        .catch(next)
    /*
    req.app.get('db')('thingful_users')
        .where({user_name: tokenUserName}).first()
        .then(user=>{
            if(!user || user.password !== tokenPassword) {
                return res.status(401).json({error: `Unauthorized request`})
            }
            //next()
        })
        .catch(next)*/
}

module.exports= {requireAuth}