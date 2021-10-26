const express = require('express')
const indexRouter = require("./routes/index.js");
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/user');

//mount middleware
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(session({
    secret: 'sessiontest',
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/demos'})
}));

app.use((req,res, next)=>{
    if(!req.session.counter)
        req.session.counter = 1;
    else
        req.session.counter++;
    console.log(req.session);
    next();
});

//connect to the database
mongoose.connect('mongodb://localhost:27017/demos',
                {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(3000, () => {
        console.log('Express is running on port 3000');
    });
})
.catch(err=>console.log(err.message));

app.use('/', indexRouter);


