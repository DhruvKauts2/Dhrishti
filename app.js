const { json } = require('express')
const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const Todo = require('./models/todo')
const { once } = require('events');
const { spawn } = require('child_process');
const { resolve } = require('path')
const { get } = require('http')
const DB = 'mongodb+srv://Kauts:balenciaga@dhrishtidb.06jmq.mongodb.net/dhrishtiDataBase?retryWrites=true&w=majority'
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
//lol

//middleware
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('connection successful');
}).catch((err)=>console.log('Connection Failed'));

app.use(cors(corsOptions))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.all('/:tbs', async (req,res) => {
    const {tbs} = req.params
    const records = await Todo.findOne({keyword:tbs})
    if(records == null || records.length == 0 ){
      
        var final_summary = await ask_for_summary(tbs)
        res.send(`${final_summary}`)
    }
    else{
      res.send(records.summary)
    }
    
    
    
})

app.post('/api/stuff', async(req, res, next) => {
  var token = req.body["token"];
  var text = req.body["text"];
  console.log(token);
  //console.log(text);

  const records = await Todo.findOne({keyword: token})
    if(records == null || records.length == 0 ){
      
        var final_summary = await ask_for_summary(token,text)
        res.send(`${final_summary}`)
    }
    else{
      res.send(records.summary)
    }

  res.status(201).send('Created Succesfully');
});

const ask_for_summary = async(search_token, search_text) =>  {
  var final_summary = await get_summary(search_text)
  const record = {keyword: search_token, summary: final_summary}
  const response = await Todo.create(record)
  console.log(response)
  return final_summary
}


const get_summary = async(search_text) =>{ //this function takes the keyword as parameter and returns the summary
   var summary;
  
   const childPython = await spawn('python', ['bert_summary.py', search_text]);
 
   childPython.stdout.on('data', (data) => {
       summary = data;
   });
 
   await once(childPython, 'close');
   console.log(`${summary}`)
   return summary;
}




app.listen(port,()=> {
  console.log('server is running on port 5000')
})