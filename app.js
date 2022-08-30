//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Article = new mongoose.model("article",articleSchema);

app.route("/articles")
.get((req,res)=>{
  Article.find({},(err,articles)=>{
    if(err){
      res.send(err);
    }
    else{
      res.send(articles);
    }
  });
})

.post((req,res)=>{
  const article = new Article({
    title:req.body.title,
    content:req.body.content
  });
  article.save((err)=>{
    if(!err){
      res.send("Successfully added");
    }
    else{
      res.send(err);
    }
  });
})

.delete((req,res)=>{
  Article.deleteMany({},(err)=>{
    if(err){
      res.send(err);
    }
    else{
      res.send("deleted");
    }
  });
});

app.route("/articles/:articleTitle")
.get((req,res)=>{
  Article.findOne({title:req.params.articleTitle},(err,article)=>{
    if(!err){
      if(article){
      res.send(article);
      }
      else{
        res.send("Article not found");
      }
    }
    else{
      res.send(err);
    }
  });
})
.put((req,res)=>{
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    (err,result)=>{
      if(!err){
        if(result){
          res.send(result);
        }
        else{
          res.send("not found");
        }
      }
      else{
        res.send(err);
      }
    });
})
.patch((req,res)=>{
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body},
    (err)=>{
      if(!err){
        res.send("updated");
      }
      else{
        res.send(err);
      }
    }
  );
})
.delete((req,res)=>{
  Article.deleteOne({title:req.params.articleTitle},(err)=>{
    if(!err){
      res.send("deleted");
    }
    else{
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
