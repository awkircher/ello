import userDatabase from './userDatabase.json'
import boardDatabase from './boardDatabase.json'
import listDatabase from './listDatabase.json'
import cardDatabase from './cardDatabase.json'

export const api = function() {
    const authenticateAndGetUser = async function(username, password) {
        try {
            const isValidUser = (user) => user.username === username && user.password === password;
            let index = await Promise.resolve(userDatabase.Users.findIndex(isValidUser));
            if (index === -1) {
                throw new Error(`username or password are incorrect`)
            } else {
                return userDatabase.Users[index]
            }
        } catch(error) {
            console.log(error)
        }
    }
    const getUser = async function(uid) {
        // get the user specified by the uid
        try {
            const isUser = (user) => user.uid === uid;
            let index = await Promise.resolve(userDatabase.Users.findIndex(isUser));
            if (index === -1) {
                throw new Error(`user not found`)
            } else {
                return userDatabase.Users[index]
            }
        } catch(error) {
            console.log(error)
        }
    }
    const getBoard = async function(uid) {
        // get the board specified by the uid
        try {
            const isBoard = (board) => board.uid === uid;
            let index = await Promise.resolve(boardDatabase.Boards.findIndex(isBoard));
            if (index === -1) {
                throw new Error(`board not found`)
            } else {
                return boardDatabase.Boards[index];
            }
        } catch(error) {
            console.log(error)
        }
    }
    const getList = async function(uid) {
        // get the list specified by the uid
        try {
            const isList = (list) => list.uid === uid;
            let index = await Promise.resolve(listDatabase.Lists.findIndex(isList));
            if (index === -1) {
                throw new Error(`list not found`)
            } else {
                return listDatabase.Lists[index];
            }
        } catch(error) {
            console.log(error)
        }
    }
    const getCard = async function(uid) {
        // get the card specified by the uid
        try {
            const isCard = (card) => card.uid === uid;
            let index = await Promise.resolve(cardDatabase.Cards.findIndex(isCard));
            if (index === -1) {
                throw new Error(`card not found`)
            } else {
                return cardDatabase.Cards[index];
            }
        } catch(error) {
            console.log(error)
        }
    }
    const getBoardsByUserId = async function(userId) {
        // return an array of board objects
        try {
            let user = await getUser(userId);
            if (!user) {
                throw new Error('user not found')
            } else {
                try {
                    let boardPromises = user.boardIds.map(async id => getBoard(id)); //user.details.boardIds.map(async id => getBoard(id));
                    if (boardPromises.length < 1) {
                        throw new Error('no boards found')
                    } else {
                        // wait until all mapped Promises are fulfilled
                        return await Promise.all(boardPromises);
                    }
                } catch(error) {
                    console.log(error)
                }
            }
        } catch(error) {
            console.log(error)
        }
    }
    const getListsByBoardId = async function(boardId) {
        // return an array of list objects
        console.log('looking for ' + boardId)
        try {
            let board = await getBoard(boardId);
            if (!board) {
                throw new Error('board not found')
            } else {
                try {
                    let listPromises = board.listIds.map(async id => getList(id));
                    console.log(listPromises)
                    // wait until all mapped Promises are fulfilled
                    return await Promise.all(listPromises);
                } catch(error) {
                    console.log(error)
                }
            }
        } catch(error) {
            console.log(error)
        }
    }
    const getCardsByListId = async function(listId) {
        // return an array of card objects
        try {
            let list = await getList(listId);
            if (!list) {
                throw new Error('list not found')
            } else {
                try {
                    let cardPromises = list.cardIds.map(async id => getCard(id));
                    // wait until all mapped Promises are fulfilled
                    return await Promise.all(cardPromises);
                } catch(error) {
                    console.log(error)
                }
            }
        } catch(error) {
            console.log(error)
        }
    }
    return { authenticateAndGetUser, getUser, getBoard, getList, getCard, getBoardsByUserId, getListsByBoardId, getCardsByListId }
}