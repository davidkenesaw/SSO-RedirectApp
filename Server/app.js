const express = require('express')
const axios = require('axios')
//const {DecodeToken, verifyToken} = require('sso-npm')
const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
})


const app = express()
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../Client/views'));//show express the views directory
app.use('/Partials',express.static(path.join(__dirname, '../Client/Partials')));
app.use('/images', express.static(path.join(__dirname, '../Client/images')));

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
    if(!Token){
        return res.redirect("/")
    }
    let response = await DecodeToken(Token)
    if(response.error == "Invalid token" || response.error == "expired" || !Token){
        return res.redirect("/")
    }next()
}



app.get("/", (req, res) => {
    
    res.redirect('http://www.protectesso.org/Login')

})
app.get("/home/:Token", verifyToken, async(req, res) => {
    let Token = req.params.Token 
    console.log("token" + Token)
    const response = await DecodeToken(Token)
    console.log(response)
    res.cookie("Token", Token)
    res.render('Dashboard',{response})

})

app.listen(3005, (req, res) => {
    console.log('listening on 3005')
})