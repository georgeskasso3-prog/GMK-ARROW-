const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

let posts = [{user:"Georges Kasso7", title:"Mon premier Poste", content:"Bienvenue sur GMK ARROW"}];
let membres = [{nom:"Georges Kasso7", email:"georgeskasso39@gmail.com", tel:"0552813337", date:new Date().toLocaleString()}];

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/chef', (req,res)=>{
  res.send(`
    <html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>GMK ARROW</title>
    <style>body{background:#001f3f;color:#FFD700;font-family:Arial;padding:20px;text-align:center}
    .card{background:#000;padding:20px;border-radius:15px;border:2px solid #FFD700;max-width:400px;margin:20px auto}
    .btn{background:#FFD700;color:#000;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;margin:5px}
    input,textarea{width:90%;padding:12px;margin:8px 0;background:#222;color:white;border:1px solid #555}
    </style></head><body>
    <img src="/logo.png" style="width:80px"><h1>GMK ARROW</h1>
    <p>Dashboard OK Chef - ${posts.length} posts - ${membres.length} membres</p>
    <div class="card"><h3>Créer un post</h3><input id="title" 
    placeholder="Titre..."><textarea id="content" placeholder="Contenu..."></textarea><button class="btn" onclick="createPost()">Publier</button></div>
    <button class="btn" onclick="location.href='/'">Voir Accueil Abonnés</button>
    <button class="btn" onclick="location.href='/feed.html'">Voir Feed</button>
    <script>async function createPost(){const t=document.getElementById('title').value;const c=document.getElementById('content').value;await fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:'Georges Kasso7',title:t,content:c,date:new Date().toLocaleString()})});alert('Post publié Chef!');document.getElementById('title').value='';document.getElementById('content').value='';}</script>
    </body></html>
  `);
});
app.get('/api/posts', (req,res)=> res.json(posts));
app.post('/api/posts', (req,res)=>{ posts.unshift(req.body); res.json({ok:true}); });
app.get('/api/membres', (req,res)=> res.json(membres));
app.post('/api/membres', (req,res)=>{ membres.push(req.body); res.json({ok:true}); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('GMK ARROW OK sur '+PORT));
