const express = require('express')
const app = express()
const port = 3000

const _ = require("lodash");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sushantsharma:Sush123@cluster0.piqwrgw.mongodb.net/TodoListDB", {useNewUrlParser: true});

const ItemsSchema = new mongoose.Schema({
  name: {
    type: String
   // required: [true, "Please check entry, no name is specified"]
  }
});


const Item = mongoose.model("Item", ItemsSchema);

//const currentDay=require(__dirname + "/date.js");
//imports today'date from data.js module

const item1 = new Item({
 name: "Welcome to your todoList!"
});

const item2 = new Item({
 name: "Hit the + button to add a new item"
});

const item3 = new Item({
 name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const ListSchema = {
  name: String,
  items: [ItemsSchema]
};

const List = mongoose.model("List", ListSchema); 

app.use(express.static("public"));
// this is to use static file(CSS) in data.ejs 


//var items=[];
//var workItems=[];



app.set('view engine', 'ejs');
// this is to use ejs in our project


app.get('/', (req, res) => {
  
  //let date = currentDay.getdate();
  // let day = currentDay.getday();

  // var arr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  // for(let i=0;i<7;i++){
  // 	if(i==day){
  // 		day=arr[day];
  // 	}
  // }
  // this for loop is not used im project, this is just a logic to get todays day name

  Item.find({}, function(err, foundItems){
    if(foundItems.length==0){
   
        Item.insertMany(defaultItems, function(err){
             if(err){
             console.log(err);
             }
             else{
             console.log("Success");
             }
    });
    res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today" , newListItems: foundItems});
    }   
  })

  
});


app.post('/', (req,res) => {
  
   var item = req.body.newItem;
   var ListName= req.body.list;

   if(ListName!="Today"&&item==""){
      res.redirect("/" + ListName);
      return;
   }
   else if(ListName=="Today"&&item==""){
      res.redirect("/");
      return;
   }

 
   console.log(req.body.list);
   console.log(item);

   let newitem = new Item({
    name: item
  });

   
   if(req.body.list=="Today"){
    newitem.save();
    res.redirect("/");
   }
  else{

   List.findOne({name: ListName}, function(err, foundList){
        foundList.items.push(newitem);
        foundList.save();
   })
   console.log(item);
   res.redirect("/" + ListName);
}

// this nested if else statement is to handle empty string if someone click + button without entering text 

});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName == "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
     if(!err){
      console.log("Successfuly deleted Item");
      res.redirect("/");
     }
  })
  }
  else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }

  
});

app.get("/:customListName",(req,res)=> {
     const customListName = _.capitalize(req.params.customListName);

     List.findOne({name: customListName}, function(err, foundList){
      if(!err){
        if(!foundList){
          console.log(customListName);
          
          const list = new List({
          name: customListName,
          items: defaultItems
        });
        
         list.save();
         res.redirect("/" + customListName);
        }
        else{
          res.render("list", {listTitle: foundList.name , newListItems: foundList.items});
        }
      }
     });

     
     
});

app.get("/about", (req,res)=>{
   res.render("about");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})