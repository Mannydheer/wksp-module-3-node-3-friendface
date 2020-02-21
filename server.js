'use strict';
const express = require('express');
const morgan = require('morgan');
const {
    users
} = require('./data/users');
const PORT = process.env.PORT || 8000;

let currentUser = null;


const handleHome = (req, res) => {
    //if someone goeds to handlehome directly. 
    if (!currentUser) {
        res.redirect('/signinPage');
        return;
    }
    let friendsHolder = [];
    //for each
    currentUser.friends.forEach(friend => {
        users.forEach(user => {
            if (friend === user.id) {
                friendsHolder.push(user);
            }
        })
    });
    res.render('pages/homepage', {
        title: "UserNames!",
        user: currentUser,
        friends: friendsHolder
    })
}
const handleSignin = (req, res) => {

    res.render('pages/signinPage', {
        title: "Signin to Friendface!"
    })
}
const handleUser = (req, res) => {
    //holding the current user passed. 
    let userId = req.params.id;
    const friendsHolder = [];
    let userNow = {};

    users.forEach(user => {
        if (user.id === userId) {
            userNow = user;
        }
    });

    userNow.friends.forEach(friend => {
        users.forEach(user => {
            if (friend === user.id) {
                friendsHolder.push(user);
            }
        })
    });
    res.render('pages/homepage', {
        title: "Current",
        friends: friendsHolder,
        user: userNow
    })
}
const handleName = (req, res) => {

    const firstName = req.query.firstName;

    currentUser = users.find(user => user.name === firstName) || null;
    res.redirect(`${currentUser ? `/` : '/signinPage'}`);
}
// handle all friends function. 
const handleallFriends = (req, res) => {
    //First need to show everyone accept for the people that are already his friends. 
    let oldFriends = [];
    let allFriends = users;
    let newFriends = [];

    //keep track of all old friends. 
    currentUser.friends.forEach(friend => {
        users.forEach(user => {
            if (friend === user.id) {
                oldFriends.push(user);
            }
        })
    });

    
    //I tried doing an || or a forEach.... not working so hard coded :(
    newFriends = allFriends.filter(friend => friend !== oldFriends[0]);
    newFriends = newFriends.filter(friend => friend !== oldFriends[1]);
    newFriends = newFriends.filter(friend => friend !== oldFriends[2]);
    newFriends = newFriends.filter(friend => friend !== currentUser);
    

    res.render('pages/suggested', {
        title: "People you may know :)",
        //passing it all of the array of objects of users. 
        friends: newFriends,
        //user will always be the current user at the
        user: currentUser

    })
}
// -----------------------------------------------------
// server endpoints
express()
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(express.urlencoded({
        extended: false
    }))
    .set('view engine', 'ejs')
    // endpoints
    .get('/', handleHome)
    .get('/signinPage', handleSignin)
    .get('/user/:id', handleUser)
    // .get('/user/user/:id', handleUser)
    .get('/getname', handleName)
    //
    .get('/allfriends', handleallFriends)


    .get('*', (req, res) => {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    })



    .listen(PORT, () => console.log(`Listening on port ${PORT}`));