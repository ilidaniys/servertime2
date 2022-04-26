require('dotenv').config()
const {Router} = require('express')
const User = require("../model/user");
const router = Router()
const jwt = require('jsonwebtoken')


function generationToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '99999999999s'})
}

router.post('/api/login', async (req, res) => {
    try {
        console.log('data', req.body)
        const userEmailToken = {email: req.body.email}
        console.log('userEmail',userEmailToken)
        const user = await User.findOne(userEmailToken)
        if (user){
            const accessToken = generationToken(userEmailToken)
            console.log('token login', accessToken)
            if (user.pwdCompare){
                if (user.userRole === 'admin'){
                    console.log('admin connect')
                    res.send({accessToken, status: true, adminStatus: true})
                }
                console.log('user Connect')
                res.send({accessToken, status: true, adminStatus: false})
            }
        }
        res.send({status: false, errMassage: true})

    } catch (e){
        console.log(e)
    }


})



router.get('/api/logout',  (req, res) => {
    res.send({express: 'Logout'});
})

router.post('/api/register', async (req, res) => {
    try {
        const {name, email, password, repeat} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            console.log(candidate)
            res.send({
                newCandidate: false,
                errMassage: true
            })
        } else {
            const user = new User({
                email, name, password, userRole:'user', sessions: {session: []},
            })
            await user.save()
            res.send({
                newCandidate: true
            })
        }
    } catch (e) {
        console.log(e)
    }
});

module.exports = router