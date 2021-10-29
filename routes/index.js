const express = require('express');
const router = express.Router();
const bot =  require('../public/scripts/boofbot')
const mongoose = require('mongoose');
const User = require('../models/user');
const { next } = require('cheerio/lib/api/traversing');
const session = require('express-session');
const { append } = require('domutils');

//Global Variables
var name = "khank";
var loggedIn = false;

//CALLS: index page
router.get('/', (req, res) => {
    res.render("index", {title: "Boof Bot"});
});

//CALLS: about page
router.get('/about', (req, res) => {
    res.render("about");
});

//CALLS: search page
router.get('/search', (req, res) => {
    let id = req.session.user;
    if(id){
    User.findById(id)
    .then(user=>res.render("search"))
    .catch(err=>next(err));
    } else {
        res.render("login");
    }
    
});

//GETS: user input from search form
router.post('/search/results', function(req,res) {

//Stores input to a variable
var idList = req.body.ids;
var county = req.body.county_name;

//Calls boof bot script
bot(idList, name, county);

//Takes user to completed search page
res.render('results');
});

//GETS: file for user download
router.post('/search/download', function(req,res) {

//Create element to download
var file ="../Boof Bot/public/csvfiles/" + name + ".csv";
res.download(file);
});

//CALLS: signup form
router.get('/new', (req, res)=>{
    res.render('new')
});

//creates new user
router.post('/create', (req, res)=>{
    let user = new User(req.body);
    user.save()
    .then(()=>res.render('login'))
    .catch(err=>next(err));
});

//CALLS: login page
router.get('/login', (req, res)=>{
    res.render('login')
});

//process login request
router.post('/login', (req, res)=>{
    //authenticate login
    let email = req.body.email;
    let password = req.body.password;

    //matches user to email
    User.findOne({email: email})
    .then(user=>{
        if(user) {
            //user found in database
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;//store user's id in the session
                    loggedIn = true;
                    res.redirect('/');
                } else {
                    console.log('Wrong password');
                    res.redirect('/login');
                }
            })
        } else {
            console.log('Wrong email address');
            res.redirect('/login');
        }
    })
    .catch(err=>next(err));
});

//logout user
router.get('/logout', (req, res, next)=>{
    req.session.destroy(err=>{
    if(err)
        return next(err);
    else
        res.redirect('/');
        loggedIn = false;
    });
});


module.exports = router;

