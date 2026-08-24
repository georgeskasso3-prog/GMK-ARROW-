const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
let membres = [{nom:"Georges Kasso", email:"georgeskasso39@gmail.com", pseudo:"Georges - Marie Kasso", password:"1234"}];
app.get('/', (req,res)=>{ res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.post('/api/login', (req,res)=>{
 const {pseudo,email} = req.body;
 const search=(pseudo||email||"").toLowerCase().trim();
 let user=membres.find(m=>m.pseudo.toLowerCase()===search || m.email.toLowerCase()===search) || {nom:pseudo||email, pseudo:pseudo||email};
 res.json({success:true, user});
});
app.post('/api/register', 
(req,res)=>{ membres.push(req.body); res.json({success:true}); });
const PORT=process.env.PORT||3000;
app.listen(PORT, ()=>console.log('GMK sur '+PORT));
module.exports=app;
