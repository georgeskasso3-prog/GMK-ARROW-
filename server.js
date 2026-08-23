const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

let posts = [];
// Charger si fichier existe
try {
  if(fs.existsSync('data.json')){
    posts = JSON.parse(fs.readFileSync('data.json'));
  }
} catch(e){}

function save(){
  try{ fs.writeFileSync('data.json', JSON.stringify(posts)); }catch(e){}
}
app.get('/', (req,res)=>{
return res.send(`
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{background:#001f3f;color:#FFD700;font-family:Arial;text-align:center;padding:20px;margin:0;}
.logo{width:95vw;height:auto;border-radius:50%;max-width:95vw;display:block;margin:0 auto 20px auto;border:5px solid #FFD700;}
</style>
</head><body>
<img src="https://i.imgur.com/8QJ4sQq.png" class="logo" alt="GMK ARROW LOGO">
<h1 style="font-size:50px;">GMK ARROW</h1>
<h2 style="font-size:28px;">Bienvenue Chef Georges-Marie Kasso</h2>
<br>
<a href="/register" style="background:#FFD700;color:#001f3f;padding:20px 45px;text-decoration:none;font-size:22px;font-weight:bold;border-radius:10px;">ENTRER</a>
<br><br>
<a href="/dashboard?user=Georges-Marie Kasso" style="color:white;font-size:18px;">Voir Dashboard</a>
</body></html>
`);
});

app.get('/register',(req,res)=>{res.send('<h1>Register OK</h1>');});
app.get('/dashboard',(req,res)=>{res.send('<h1>Dashboard OK Chef</h1>');});

app.listen(PORT, ()=>console.log('GMK ARROW RUNNING on '+PORT));
});
