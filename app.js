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

mongoose.connect('mongodb+srv://lekhak-user:ramgoel@cluster0.wtutu.mongodb.net/lekhak?retryWrites=true&w=majority')

var PostSchema= new mongoose.Schema({
    title:String,
    content:String,
    cato:String
})


var PostModel = mongoose.model('posts', PostSchema)



//validation Functions

function contentValidate(content){
    var contentArray=content.split(' ');

    console.log(contentArray)
    if (contentArray.length >20){
        return true
    }else{
        return false
    }
}

//get Request handling

app.get('/', (req, res) => {
    res.render('index', {
        mess: 'Register Now'
    })
});



app.get('/read', async(req, res) => {
    const dt={}
    var data= await PostModel.find(dt).exec();
    console.log(data)
    res.render('Articles',{data:data})

});

app.post('/find',async(req,res) =>{
        
        var data = await PostModel.find({cato:req.body.item}).exec();
        if(!data){
            res.send('No Records Found')
        }else{
            res.render('search',{data:data})
        }
       
})


app.get('/add', (req, res) => {
    res.render('Add',{mess:''})
});


app.get('/search',(req,res) =>{
    res.render('search',{data:''})
})



//POST Request handling

app.post('/post', (req, res) => {

    var checkContent=contentValidate(req.body.content)

    console.log(checkContent)

    if(checkContent==true){

        postData= new PostModel(req.body);
        postData.save()
        res.render('Add',{mess:'Post Submitted'})
    }else{
        res.render('Add',{mess:'Minimum 20 Words of content required'})
    }
});



app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});