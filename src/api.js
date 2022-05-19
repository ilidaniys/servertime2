const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const helmet = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser');
const addAuth = require('./route/auth')
const User = require('./model/user')
const authMiddleware = require('./middleware/authentificateToken')
const serverless = require("serverless-http");
const router = express.Router()

const port = process.env.PORT || 5000;
const URI = process.env.URL

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet())
app.use(compression())


app.use('/', addAuth)

app.get('/api/hello', (req, res) => {
    res.send({express: 'Hello From Express'});
});

app.get('/api/profile', authMiddleware, async (req, res) => {
    const email = req.userEmail.email
    const user = await User.findOne({email})
    if (!user) {
        res.status(401)
    }
    user.amount()
    res.send(user)
});

app.get('/api/adminList', authMiddleware, async (req, res) => {
    const email = req.userEmail.email
    const user = await User.findOne({email})
    if (user.userRole === 'admin') {
        const userList = await User.find()
        res.send(userList);
    }
});

app.get('/api/profile/:id', authMiddleware, async (req, res) => {
    const userId = req.params.id
    const user = await User.findById(userId)
    res.send(user);
});

app.post('/api/startTime', authMiddleware, async (req, res) => {

    const email = req.userEmail.email
    const user = await User.findOne({email})
    await user.startTime(req.body)
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

app.get('/api/refreshStart', authMiddleware, async (req, res) => {
    const email = req.userEmail.email
    if (req.userEmail.email){
        const user = await User.findOne({email})
        if (user || null) {
            const unfinishedSession = () => {
                return user.sessions.session.find(session => {
                    if (session.startTime !== 0 && session.endTime === '0') {
                        console.log('checkMetod', session)
                        return session
                    }
                    return null
                })
            }
            const adminRole = (user.userRole === 'admin')
            const response = {
                unSession: unfinishedSession(),
                adminRole
            }
            res.send(response)
        }
    } else {
        const unRegister = false
        console.log('unRegister', unRegister)
        res.send(unRegister)
    }
})

app.post('/api/endTime', authMiddleware, async (req, res) => {
    console.log('req endTime', req.body);
    const email = req.userEmail.email
    const user = await User.findOne({email})
    await user.endTime(req.body)
    user.amount()
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});







// async function start() {
//     try {
//         await mongoose.connect(URI)
//         app.listen(port, () => console.log(`Listening on port ${port}`));
//     } catch (e) {
//         console.log(e)
//     }
// }
//
// start()

app.use(`/.netlify/functions/api`, router)
module.exports = app
module.exports.handler = serverless(app)

