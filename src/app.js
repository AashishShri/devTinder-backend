const express = require('express')

const app = express()

const { adminAuth } = require("./middlewares/auth")

app.use("/admin", adminAuth )


app.get('/admin/add',(req,res)=>{
    res.send("I m from dev tinder admin/add")

})

app.get('/admin/delete',(req,res)=>{
    res.send("I m from dev tinder admin/delete")

})

app.get('/test',(req,res)=>{
    res.send("I m from dev tinder test")

})

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000 ...");
})