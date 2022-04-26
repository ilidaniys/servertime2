const jwt = require("jsonwebtoken");
// const {createLogger} = require("react-token-auth/lib/logger");

function authenticateToken (req, res, next) {
    const authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(' ')
    token = token[token?.length-1]
    if (token == null) return res.status(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userEmail) => {
        // console.log(userEmail)
        if (err) return res.status(403)
        req.userEmail = userEmail
        // console.log('user', userEmail)
        next()
    })

}

module.exports = authenticateToken