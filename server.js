'use strict';
const express = require('express');
const morgan = require('morgan');
const {
    users
} = require('./data/users');
const PORT = process.env.PORT || 8000;

let currentUser = null;


const handleHome = (req, res) => {
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
    const id = req.params.id;
    let friendsPage = [];

    users.forEach(user => {
        if (user.id === id) {
            friendsPage.push(user);

        }

    });
    console.log(friendsPage);

    res.render('pages/homepage', {
        user:user,
        friends: friendsHolder,
        




    })
}

const handleName = (req, res) => {

    const firstName = req.query.firstName;
    currentUser = users.find(user => user.name === firstName) || null;
    res.redirect(`${currentUser ? `/` : '/signinPage'}`);
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
    .get('/getname', handleName)


    .get('*', (req, res) => {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    })



    .listen(PORT, () => console.log(`Listening on port ${PORT}`));