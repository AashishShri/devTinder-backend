const express = require('express')

const app = express()


app.use('/test',(req,res)=>{
    res.send("I m from dev tinder test")

})

app.use('/',(req,res)=>{
    res.send("I m from dev tinder")

})

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000 ...");
})