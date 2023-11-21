const express = require('express');
const bodyParser = require('body-parser');
const port=3000;
const app = express();
const fs=require('fs');
const cors=require('cors');
app.use(cors());
app.use(bodyParser.json());


function getAll(req,res){
  fs.readFile('todo.json','utf-8',(err,data)=>{
    if(err){
      console.error(err);
      return;
    }
    res.status(200).send(data);
  })
}

function addnew(req,res){
  var obj=req.body;
  obj.id=Math.random();
  fs.readFile('todo.json','utf-8',(err,data)=>{
    if(err){
        console.error("Error");
        return;
    }
    var data_new=JSON.parse(data);
    data_new.push(obj);
    var data_new1=JSON.stringify(data_new,null,2);
    fs.writeFile('todo.json',data_new1,(err)=>{
        if(err)
        {
            console.log("Error")
            return;
        }
    })
    res.status(201).json(obj);
  })
}

function update(req,res){
  var count_update=0;
  let ids=req.params.id;
  var obj_update=req.body;
  obj_update.id=ids;
  fs.readFile('todo.json','utf-8',(err,data)=>{
    if(err){
        console.log("Error")
        return;
    }
    var data_update=JSON.parse(data);
    for(let i=0;i<data_update.length;i++){
      if(data_update[i].id == ids){
        count_update++;
        data_update[i]=obj_update;
        break;
      }
    }
    if(count_update===1){
      var data_updatenew=JSON.stringify(data_update,null,2);
      fs.writeFile('todo.json',data_updatenew,(err)=>{
        if(err){
            console.log("Error")
            return;
        }
      })
    }
    res.status(200).send("Updated"); 
  })
}

function del(req,res){
  var count=0;
let ids=req.params.id;
fs.readFile('todo.json','utf-8',(err,data)=>{
    if(err){
        console.log("Error");
        return;
    }
    var delete_data1=JSON.parse(data);
    for(let i=0;i<delete_data1.length;i++){
      if(delete_data1[i].id == ids){
      delete_data1.splice(i,1);
      count+=1;
      break;
      }
    }
    if(count===1){
      var delete_data2=JSON.stringify(delete_data1,null,2);
        fs.writeFile('todo.json',delete_data2,(err)=>{
            if(err){
                console.log("Error")
                return;
            }
            res.status(200).send("Deleted");
        })
    }
      })
}

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html');
})
app.get('/todos',getAll)
app.post('/todos',addnew)
app.put('/todos/:id',update)
app.delete('/todos/:id',del)

app.listen(port,()=>{
  console.log('Listening on '+port);
})

