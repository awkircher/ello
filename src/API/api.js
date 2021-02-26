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
            password: user.password,
            boardIds: user.boardIds
            };
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        const uid = snapshot.ref.id
        console.log('fromFirestore called with ', data)
        return new UserClass(data.email, uid, data.password, data.boardIds);
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
        let cardIds;
        console.log('fromFirestore called with ', data)
        if (data.cardIds === "") {
            cardIds = [];
        } else {
            cardIds = data.cardIds
        }
        return new ListClass(data.name, uid, cardIds)
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
    const addList = async function(list) {
        //add this object to the collection Lists
        try {
            let docRef = await db.collection("lists").withConverter(listConverter).add({
                name: `${list.name}`, 
                cardIds: `${list.cardIds}`})
            if (docRef) {
                const uid = docRef.id;
                const addedList = new ListClass(list.name, uid, list.cardIds);
                return addedList;
            }
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
        addList
    }
}