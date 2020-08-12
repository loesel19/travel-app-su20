require('dotenv').config()
const express = require('express') //imports express
const fs = require('fs') //imports file system functions
const path =require('path') //imports path utils
const hbs=require('hbs') //imports handlebars
const LocEntry = require('./models/LocEntry')
const mongoose = require('mongoose')
//add other imports here

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
})




const app = express(); //creates express application and returns an object
const port= process.env.PORT; //selects the port to be used
app.listen(port) // starts listening for client requests on specified port
app.use(express.json());

const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
app.use(express.static('./public')) //points to static resources like css, client side js etc.
app.set('view engine','hbs') //tells express top use handlebars templating engine
app.set('views',viewsPath) //sets the apps view directory to the viewsPath defined above
hbs.registerPartials(partialsPath)//registers the partials for the app

/* GET index listing. */
app.get('/', (req, res)=> {
    res.render('index', { title: 'The Travel Log', description: 'the one stop log for all things travel :)' });
    //This will embed the index.hbs view inside the body of layout.hbs
});

/* GET users listing. */
app.get('/entries', (req, res)=> {
    LocEntry.find({},(error,result)=>{
        if (error)
            console.log(error)
        else{
            lstNames=[]
            result.forEach(item=>lstNames.push({_id: item._id, title:item.title}))
            /*
            for (let i=0;i<result.length;i++){
                let x = {
                    _id: result[i]._id,
                    title:result[i].title
                }
                lstNames.push(x)
            }
            */
           res.send(lstNames)
        }
            
    })
});

/* GET users listing. */
app.get('/entries/:id', (req, res)=> {
    LocEntry.find({_id : req.params.id},(error,result)=>{
        if (error)
            console.log(error)
        else{
            console.log(result)
            if (result.length === 0){
                console.log('Here!')
                res.send({error : 'Entry not found'})
            }
            else
                res.send(result[0])
        }
            

    })
});



app.post('/entries', (req, res)=> {
    console.log(req.body)
    const entry = req.body
    LocEntry.create(entry,(error,result)=>{
        if(error){
            console.log(error)
            res.send({error: 'Error creating entry. Try again.'})
        }    
        else{
            console.log(result)
            res.send(entry)
        }
            
    })

});



/* GET 404 listing. */
app.get('*', (req, res)=> {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Page does not exist')
        res.end()
});






