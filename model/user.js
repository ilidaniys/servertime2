const {Schema, model} = require('mongoose')

const user = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    allTime: {
        type: Number,
        default: 0
    },
    userRole: {
        type: String,
        default: 'user'
    },
    sessions: {
        session: [
            {
                startTime: {
                    type: String,
                    // default: 0
                },
                endTime: {
                    type: String,
                    // default: 0
                }
            }
        ]
    }
})

user.methods.startTime = function (date) {
    const session = [...this.sessions.session]
    const seconds = date.startData
    const unFinishSession = session.find(session => {
       if (session.endTime === '0') {
           return session
       }
    })
    console.log('unFinishSession',unFinishSession)
        if (!unFinishSession){
            session.push({
                startTime: seconds,
                endTime: '0'
            })
            this.sessions = {session}
            console.log('bd sessions',this.sessions)
        }

    return this.save()
}

user.methods.endTime = function (date) {
    const session = [...this.sessions.session]
    const seconds = date.endData
    const unFinishSession = session.findIndex(session => {
        if (session.endTime === '0') {
            return session
        }
    })
    // console.log('unFinishSession',unFinishSession)
    if (unFinishSession >= 0){
        session[unFinishSession].endTime = seconds
        this.sessions = {session}
    }
    return this.save()
}

user.methods.amount = function () {

    const sessionInitial = this.sessions.session.filter((session) => {
        if (session.endTime !== '0'){
            return session
        }
    })

    const amount = sessionInitial.reduce((total, session) => {
        const startTime = new Date(session.startTime)
        const endTime = new Date(session.endTime)
        const sessionDiff = endTime - startTime
        console.log(sessionDiff)
       return total + sessionDiff
    }, 0)
    console.log(amount)
    this.allTime = amount
    return this.save()
}

user.methods.pwdCompare = function (pwd) {
    const realPwd = this.password
    return realPwd === pwd;

}

module.exports = model('User', user)