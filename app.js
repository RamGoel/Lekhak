//Importing Modules

const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const form = require('formidable')
const internal = require('stream')
const app = express()
const port = process.env.PORT || 3000;



//internate Mongo


//initialiizng the view engine to render response
app.set('view engine', 'ejs');
app.use(express.static('css'))
app.use(express.static('images'))
app.use(express.urlencoded({extended:true}))



//connecting to DB

mongoose.connect("mongodb+srv://lekhak-user:ram123@cluster0.wtutu.mongodb.net/lekhak?retryWrites=true&w=majority")

var PostSchema= new mongoose.Schema({
    title:String,
    content:String,
    cato:String,
    writer:String
})


var PostModel = mongoose.model('posts', PostSchema)



//validation Functions

// function mixQuery(query){
//     let qst=query.slice(-3)
//     console.log(qst)
//     if (qst =="ing"){
//         let qus=query-qst;
//         console.error(qus)
//         return qus;
//     }
//     else{
//         return true
//     }

// }
//validation Functions

function contentValidate(content){
    var contentArray=content.split(' ');

    console.log(contentArray)
    if (contentArray.length >10){
        return true
    }else{
        return false
    }
}

//get Request handling

app.get('/', (req, res) => {
    console.log(req.url)
    res.render('index', {
        mess: 'Register Now'
    })
});
app.get('/profile', async(req, res) => {
    console.log(req.url)
    
    var data= await PostModel.find({cato:"gaming"}).exec();
    
    res.render('profile',{data:data})
});




app.get('/read', async(req, res) => {
    console.log(req.url)
    const dt={}
    var data= await PostModel.find(dt).sort({_id:-1}).exec();
    
    res.render('Articles',{data:data})

});

app.post('/find',async(req,res) =>{
    
            var data = await PostModel.find({cato:req.body.item}).sort({_id:-1}).exec();
            if(!data){
                res.send('No Records Found')
            }else{
                res.render('search',{data:data})
            }
              
})


app.get('/add', (req, res) => {
    console.log(req.url)
    res.render('Add',{mess:''})
});


app.get('/search',(req,res) =>{
    console.log(req.url)
    res.render('search',{data:''})
})

app.get('/help', (req, res) => {
    res.render('help', {})
})


//POST Request handling

app.post('/post', (req, res) => {


    console.log(req.url)
    var checkContent=contentValidate(req.body.content)

    console.log(checkContent)

    if(checkContent==true){
        let cato=req.body.cato
        console.log(cato)
        req.body.cato=cato.toLowerCase()
        console.log(cato.toLowerCase())
        postData= new PostModel(req.body);
        postData.save()
        res.render('Add',{mess:'Post Submitted'})
    }else{
        res.render('Add',{mess:'Minimum 10 Words of content required'})
    }
});



app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
