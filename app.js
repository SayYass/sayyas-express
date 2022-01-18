const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const methodOveride = require('method-override')
const port = process.env.PORT || 3000;

//set template engine  as ejs
app.set('view engine' , 'ejs');


//middleware for method overide
app.use(methodOveride('_method'));


//ROUTE FOR
app.get("/" , (req, res) => { 
res.render('Home')
});
//serving static file
app.use(express.static('public'))

//body parses
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//database url
const url = 'mongodb+srv://Sayyas:1234@cluster0.cdwlw.mongodb.net/Diary?retryWrites=true&w=majority' ;

//connecting aplication with database
mongoose.connect(url, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(console.log("Monggo DB Connected"))
.catch(e => console.log("error :" + e))

//Import diary model
const  Diary = require('./models/Diary');

app.get('/about' , (req, res) => {
    res.render('About')
});

app.get('/diary' , (req, res) => {
   
    Diary.find().then(data => {
        res.render('Diary' , {data:data})
    })
    .catch(e => console.log(e))
});
app.get('/add' , (req, res) => {
    res.render('Add');
});

//route for display description
app.get('/diary/:id', (req, res) => {
    Diary.findOne({
        _id:req.params.id
    }).then(data => res.render('Page' , {data:data}))
    .catch(e => console.log(e))
})


// route for edit page
app.get('/diary/edit/:id' , (req, res) => {
    Diary.findOne({
        _id:req.params.id
    }).then(data => res.render('Edit' , {data:data}))
    .catch(e => console.log(e))
})

// Edit data to database
app.put('/diary/edit/:id' ,(req, res) => {
    Diary.findOne({
        _id:req.params.id
    }).then(data => {
        data.title = req.body.title
        data.description = req.body.description
        data.date = req.body.date
        data.save().then(() => {
            res.redirect('/diary')
        })
        .catch(e => console.log(e))
    })
    .catch(e => console.log(e))
})

app.post('/add-to-diary' , (req, res) => {
   // Save data to database
   const Data = new Diary({
       title:req.body.title,
       description:req.body.description,
       date:req.body.date

   })
   Data.save().then(() => {
       res.redirect('/diary')
   }).catch(e => console.log(e))
});

// delete from database
app.delete('/data/delete/:id' , (req, res) => {
    Diary.remove({
        _id : req.params.id
    }).then(() => {
        res.redirect('/diary')
    }).catch(e => console.log(e))
})

//create a server
app.listen(port, () => { console.log('server is ready')});

