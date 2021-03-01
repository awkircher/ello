import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import { UserClass } from '../Models/UserClass'
import { BoardClass } from '../Models/BoardClass'
import { ListClass } from '../Models/ListClass'
import { CardClass } from '../Models/CardClass'

const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_APIKEY}`,
    authDomain: `${process.env.REACT_APP_AUTHDOMAIN}`,
    projectId: `${process.env.REACT_APP_PROJECTID}`,
    storageBucket: `${process.env.REACT_APP_STORAGEBUCKET}`,
    messagingSenderId: `${process.env.REACT_APP_MESSENGINGSENDERID}`,
    appId: `${process.env.REACT_APP_APPID}`
};

firebase.initializeApp(firebaseConfig);

const userConverter = {
    toFirestore: function(user) {
        console.log('toFirestore called with ', user)
        return {
            email: user.email,
            boardIds: user.boardIds
            };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        const uid = snapshot.ref.id
        console.log('fromFirestore called with ', data)
        return new UserClass(data.email, uid, data.boardIds);
    }
}

const boardConverter = {
    toFirestore: function(board) {
        console.log('toFirestore called with ', board)
        return {
            name: board.name,
            ownerId: board.ownerId,
            listIds: board.listIds,
            memberIds: board.memberIds
        };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        const uid = snapshot.ref.id
        console.log('fromFirestore called with ', data)
        return new BoardClass(data.name, uid, data.ownerId, data.listIds, data.memberIds)
    }
}

const listConverter = {
    toFirestore: function(list) {
        console.log('toFirestore called with ', list)
        return {
            name: list.name,
            cardIds: list.cardIds
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        const uid = snapshot.ref.id
        console.log('fromFirestore called with ', data)
        return new ListClass(data.name, uid, data.cardIds)
    }
}

const cardConverter = {
    toFirestore: function(card) {
        console.log('toFirestore called with ', card)
        return {
            title: card.title
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        const uid = snapshot.ref.id
        console.log('fromFirestore called with ', data)
        return new CardClass(data.title, uid)
    }
}

export const api = function() {
    const db = firebase.firestore()
    const getUser = async function(uid) {
        // get the user specified by the uid
        console.log('getUser called with uid ', uid)
        try {
            const doc = await db.collection('users').doc(uid).withConverter(userConverter).get()
            if (doc.exists) {
                const user = doc.data();
                return user;
            } else {
                throw new Error('user not found')
            }
        } catch(error) {
            console.log(error)
        }
    }
    const authenticateAndGetUser = async function(email, password) {
        try {
            const response = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (response) {
                const uid = response.user.uid;
                const user = await getUser(uid)
                return user;
            }
        } catch(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage)
        };
    }
    const getBoard = async function(uid) {
        // get the board specified by the uid
        console.log('getBoard called with uid ', uid)
        try {
            const doc = await db.collection('boards').doc(uid).withConverter(boardConverter).get()
            if (doc.exists) {
                const board = doc.data();
                return board;
            } else {
                throw new Error('board not found')
            }
        } catch(error) {
            console.log(error)
        }
    }
    const getList = async function(uid) {
        // get the list specified by the uid
        console.log('getList called with ', uid)
        try {
            let doc = await db.collection('lists').doc(uid).withConverter(listConverter).get();
            if (doc.exists) {
                const list = doc.data();
                return list;
            } else {
                throw new Error(`list not found`);
            }
        } catch(error) {
            console.log(error)
        }
    }
    const getCard = async function(uid) {
        // get the card specified by the uid
        try {
            let doc = await db.collection('cards').doc(uid).withConverter(cardConverter).get();
            if (doc.exists) {
                const card = doc.data();
                return card;
            } else {
                throw new Error(`card not found`)
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
                    let boardPromises = user.boardIds.map(async id => getBoard(id));
                    if (boardPromises.length < 1) {
                        //all users should have at least one board, since they get one at account creation.
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
                    //fix this! when adding a new board the listIds field will be null.
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
            } else if (!list.cardIds) {
                return 'no cards in this list'
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
    const updateBoard = async function(boardId, listId) {
        try {
            const boardRef = db.collection("boards").doc(boardId);
            let response = await boardRef.update({
                    listIds: firebase.firestore.FieldValue.arrayUnion(listId)
                });
            return response;
        } catch(error) {
            console.log(error)
        }
    }
    const removeFromBoard = async function(boardId, listId) {
        try {
            const boardRef = db.collection("boards").doc(boardId);
            let response = await boardRef.update({
                listIds: firebase.firestore.FieldValue.arrayRemove(listId)
            });
            return response;
        } catch(error) {
            console.log(error)
        }
    }
    const removeFromList = async function(listId, cardId) {
        try {
            const listRef = db.collection("lists").doc(listId);
            let response = await listRef.update({
                cardIds: firebase.firestore.FieldValue.arrayRemove(cardId)
            });
            return response;
        } catch(error) {
            console.log(error)
        }
    }
    const addList = async function(list) {
        //add this object to the collection Lists
        try {
            let docRef = await db.collection("lists").withConverter(listConverter).add({
                name: list.name, 
                cardIds: list.cardIds})
            if (docRef) {
                const uid = docRef.id;
                const addedList = new ListClass(list.name, uid, list.cardIds);
                return addedList;
            }
        } catch(error) {
            console.log(error)
        }
    }
    const deleteList = async function(listId) {
        console.log("deleteList called with id ", listId)
        try {
            const listRef = db.collection("lists").doc(listId);
            let response = await listRef.delete()
            console.log(response)
        } catch(error) {
            console.log(error)
        }
    }
    const updateList = async function(listId, cardId) {
        try {
            const listRef = db.collection("lists").doc(listId);
            let response = await listRef.update({
                    cardIds: firebase.firestore.FieldValue.arrayUnion(cardId)
                });
            return response;
        } catch(error) {
            console.log(error)
        }
    }
    const addCard = async function(card) {
        //add this object to the collection Lists
        try {
            let docRef = await db.collection("cards").withConverter(cardConverter).add({
                title: card.title})
            if (docRef) {
                const uid = docRef.id;
                const addedCard = new CardClass(card.title, uid);
                return addedCard;
            }
        } catch(error) {
            console.log(error)
        }
    }
    const deleteCard = async function(cardId) {
        console.log("deleteCard called with id ", cardId)
        try {
            const cardRef = db.collection("cards").doc(cardId);
            let response = await cardRef.delete()
            console.log(response)
        } catch(error) {
            console.log(error)
        }
    }
    return { 
        authenticateAndGetUser, 
        getUser, 
        getBoard, 
        getList, 
        getCard, 
        getBoardsByUserId, 
        getListsByBoardId, 
        getCardsByListId,
        updateBoard,
        removeFromBoard,
        removeFromList,
        addList,
        deleteList,
        updateList,
        addCard,
        deleteCard
    }
}