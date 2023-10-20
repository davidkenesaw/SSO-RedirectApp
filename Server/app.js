const express = require('express')
const axios = require('axios')
//const {DecodeToken, verifyToken} = require('sso-npm')
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../../.env')
})


const app = express()

async function DecodeToken(Token) {
    //
    
    //
    let authResponse = await axios.post(process.env.REQHOST + "Token/decode_token",
    {//
        Token:Token,
        
    }).then(function(response) {
        //
        return response.data
    }).catch(function(error){
        //
        return error
    }); 
    //
    return authResponse
}


async function verifyToken(req,res,next){
    //verify if token is on users browser
    let Token = req.params.Token 
    let response = await DecodeToken(Token)
    if(response.error == "Invalid token" || response.error == "expired" || !Token){
        return res.redirect("/")
    }next()
}



app.get("/", (req, res) => {
    
    res.send('token expired')

})
app.get("/home/:Token", verifyToken, async(req, res) => {
    let Token = req.params.Token 
    console.log("token" + Token)
    const response = await DecodeToken(Token)
    console.log(response)
    res.send(response.user)

})

app.listen(3005, (req, res) => {
    console.log('listening on 3005')
})