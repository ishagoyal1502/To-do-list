

const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/todolistDB");
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const ejs=require("ejs");
const date=require(__dirname+"/day.js");
const _=require('lodash');

const dailyListSchema=new mongoose.Schema({
  log: String
});

const customListSchema=new mongoose.Schema({
  name:String,
  log:[dailyListSchema]
})

const DailyList= mongoose.model("dailyList",dailyListSchema);
const CustomList=mongoose.model("CustomList",customListSchema);


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("css"));


app.get("/",function(req,res){
  let value=date.getDate();
  let title="";
  DailyList.find({},function(err,arr){
    if(err)
      console.log(err);
    else
      {
        res.render("day",{day:value, items:arr, listTitle:title})
      }
  })
})

app.post("/",function(req,res){
  const item=req.body.newToDo;
  const listTitle=req.body.submit;
  const dailyList=new DailyList({
    log:item
  });
  if(listTitle==="")
  {
    dailyList.save();
    res.redirect("/");
  }
  else
  {
    CustomList.updateOne({name:listTitle},{$push: {log:[dailyList]}},function(err){
      if(err)
        console.log(err);
      else
      {
        console.log("updated custom list");
        res.redirect("/"+listTitle);
      }
    })
  }



})

app.post("/delete",function(req,res){
  const listTitle=req.body.listTitle;
  const id=req.body.todelete;
  if(listTitle==="")
  {
    console.log("delete from dailylist");
    DailyList.deleteOne({_id:id},function(err){
      if(err)
        console.log(err);
      else
      {
        res.redirect("/");
      }
    })
  }
  else
  {
    CustomList.updateOne({name:listTitle},{$pull: {log: {_id:id}}},function(err){
      if(err)
        console.log(err);
      else{
        res.redirect("/"+listTitle);
      }
    })
  }

})


app.get("/:title",function(req,res){
  const title=_.capitalize(req.params.title);
  CustomList.findOne({name:title},function(err,found){
    if(err)
      console.log(err);
    else
    {
      if(!found)
      {
        const customList=new CustomList({
          name:title,
          log:[]
        });
        customList.save();
        res.redirect("/"+title);
      }
      else
      {
        
        res.render("day",{day:title,items:found.log,listTitle:title})
      }
    }
  })
})


app.listen(3000,function(){
  console.log("active");
})
