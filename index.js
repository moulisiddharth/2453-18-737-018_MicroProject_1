var express= require('express');
var app=express();
const MongoClient=require('mongodb').MongoClient;
//connecting server file for awt
let server=require('./server');
//let config=require('./config');
let middleware=require('./middleware');
//const reponse=require('express');
//body parser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Database connection
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventori';
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});

//Get Hospital details
app.get('/hospitaldetails', middleware.checkToken,function(req, res) {
    console.log("Hospital details") ;
    var data=db.collection('Hospital').find().toArray().then(result=>res.json(result));
});

//Get Ventilator details
 app.get('/ventilatordetails', middleware.checkToken,function(req, res) {
    console.log("Ventilator details") ;
    var data=db.collection('Ventilator').find().toArray().then(result=>res.json(result));
 });

 //Search Ventilator details by status
 app.post('/searchventbydetails', middleware.checkToken,(req, res) => {
     var status=req.body.status;
     console.log(status);
     var ventilatordetails=db.collection('Ventilator') .find({"status":status}).toArray().then(result=>res.json(result));
    // res.send(ventilatordetails)
 });

 //Search Ventilator details by hospital name
 app.post('/searchventbyname', middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    console.log(name);
    var ventilatordetails=db.collection('Ventilator')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

//Get Hospital details by hospital name
app.post('/searchhospital', middleware.checkToken, (req, res) => {
    const name = req.query.name;
    console.log(name);
    const ventilatordeatils = db.collection('Hospital')
        .find({ 'name': new RegExp(name, 'i') }).toArray().then(result => res.json(result));
});

//Add Ventilator
app.post('/addventilator', middleware.checkToken,(req,res)=>{
    var hId=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    var item={hId:hId,ventilatorId:ventilatorId,status:status,name:name};
    db.collection('Ventilator')
    .insertOne(item).then(result=>res.json("item inserted"));
});

//Delete Ventilator by Ventilator Id
app.delete('/deleteventilator', middleware.checkToken,(req,res)=>{
    var ventilatorId=req.body.ventilatorId;
    db.collection('Ventilator')
    .deleteOne({"ventilatorId":ventilatorId}).then(result=>res.json("item deleted"));
});

//Update Ventilator details
app.put('/updateventilator', middleware.checkToken,(req, res) => {
    var ventid={ventilatorId:req.body.ventilatorId};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection('Ventilator')
    .updateOne(ventid,newvalues,function(err,result){
        res.json("1 doc updated");
        if(err) throw err;
    });
});
app.listen(1100);