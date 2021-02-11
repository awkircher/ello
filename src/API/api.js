import database from './database.json'

export const getUser = async function(username, password) {
    try {
        const isUser = (user) => user.username === username && user.password === password;
        let index = await Promise.resolve(database.Users.findIndex(isUser));
        if (index === -1) {
            throw new Error(`user not found`)
        } else {
            return database.Users[index];
        }
    } catch(error) {
        console.log(error)
    }
}

export const getBoards = async function(user) {
    // return the Board owned by this user
    // and the Boards they're a member on
}