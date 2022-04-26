const bcrypt = require('bcrypt')
const saltRounds = 10

const register = async (email, password) => {
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    try {

    } catch (e) {
        console.log(e)
    }
}



module.exports = {
    register
}