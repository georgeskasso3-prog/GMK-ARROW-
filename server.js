const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let posts = [{user:"Georges Kasso7", title:"Mon premier Poste", content:"Bienvenue sur GMK ARROW", date:"22/08/2026"}];
let membres = [{nom:"Georges Kasso7", email:"georgeskasso3@gmail.com", tel:"0552813337", date:"22/08/2026", timestamp:new Date()}];

app.get('/', (req,res)=>{
  res.send(`
  <html><head><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GMK ARROW</title>
  <style>body{background:#001f3f;color:#FFD700;font-family:Arial;padding:20px;text-align:center}
  .card{background:#000;padding:20px;border-radius:15px;border:2px solid #FFD700;max-width:400px;margin:20px auto}
   .btn{background:#FFD700;color:#000;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:bold;margin:5px}
  input,textarea{width:90%;padding:12px;margin:8px 0;background:#222;color:white;border:1px solid #444;border-radius:8px}
  </style></head><body>
  <img src="/logo.png" style="width:80px"><h1>GMK ARROW</h1>
  <p>Dashboard OK Chef - ${posts.length} posts - ${membres.length} membres</p>
  <div class="card">
    <h3 style="color:#FFD700">Créer un post</h3>
    <input id="title" placeholder="Titre...">
    <textarea id="content" placeholder="Contenu..."></textarea>
    <button class="btn" onclick="createPost()">Publier</button>
  </div>
  <div>
<button class="btn" onclick="location.href='/dashboard'">Voir Tour de Contrôle</button>
    <button class="btn" onclick="location.href='/feed?user=Georges%20Kasso7'">Voir Feed</button>
  </div>
  <script>
    async function createPost(){
      const title=document.getElementById('title').value;
      const content=document.getElementById('content').value;
      await fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,content,user:'Georges Kasso7'})});
      alert('Posté!'); location.href='/feed?user=Georges%20Kasso7';
    }
  </script>
  </body></html>`);
});
app.get('/dashboard', (req,res)=>{
  const now = new Date();
  const today = membres.length;
  res.send(`
  <html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Dashboard GMK ARROW</title>
  <style>
    body{background:white;color:black;font-family:Arial;padding:15px;text-align:center}
    .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;max-width:600px;margin:0 auto}
    .card{background:#111;color:#ff8c00;padding:15px;border-radius:12px}
    .card b{font-size:26px;display:block}
    .year{background:#ffcc00;color:black;padding:15px;border-radius:12px;width:180px;margin:15px auto;font-weight:bold}
    .membre{background:#f5f5f5;padding:10px;border-radius:8px;margin:6px auto;max-width:650px;text-align:left;font-size:12px;border:1px solid #ddd}
    .btn{background:#111;color:#ff8c00;padding:10px 20px;border-
    radius:8px;border:none;margin:5px;cursor:pointer}
  </style></head><body>
    <h1>Dashboard GMK ARROW</h1><p style="color:#666">Tour de controle - Nouvelle Maison Vercel</p>
    <div class="grid">
      <div class="card">AUJOURD'HUI<br><b>${today}</b></div>
      <div class="card">CETTE SEMAINE<br><b>${membres.length}</b></div>
      <div class="card">CE MOIS<br><b>${membres.length}</b></div>
    </div>
    <div class="year">CETTE ANNEE<br><b>${membres.length}</b></div>
    <div style="max-width:700px;margin:20px auto;text-align:left">
      <b>Liste Complete (${membres.length} membres)</b>
      ${membres.map(m=>`<div class="membre">${m.nom} | ${m.email} | ${m.tel} | ${m.date}</div>`).join('')}
    </div>
    <button class="btn" onclick="location.href='/'">Accueil - Créer un Poste</button>
    <button class="btn" onclick="location.href='/feed?user=Georges%20Kasso7'">Voir Feed</button>
  </body></html>`);
});

app.get('/feed', (req,res)=>{
  const user = req.query.user || 'Invité';
  const html = posts.map(p=>`<div style="background:#000;border:2px solid #FFD700;border-radius:15px;padding:20px;margin:10px auto;max-width:600px;text-align:left"><b>${p.user}</b> - ${p.date}<br><b>${p.title}</b><br>${p.content}</div>`).join('');
  res.send(`<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Feed</title></head><body style="background:#001f3f;color:#FFD700;font-family:Arial;padding:20px;text-align:center"><h1>GMK ARROW - Feed de ${user}</h1>${html}<br><button onclick="location.href='/'" style="background:#FFD700;color:black;padding:10px 20px;border-radius:8px;border:none">Retour Accueil</button></body></html>`);
});

app.post('/api/posts', (req,res)=>{
  const {title,content,user} = req.body;
  posts.push({title,content,user:user||'Georges Kasso7',date:new Date().toLocaleDateString('fr-FR')});
  res.json({ok:true});
});
app.post('/register', (req,res)=>{
  const {nom,email,tel} = req.body;
  const date = new Date().toLocaleDateString('fr-FR');
  membres.push({nom,email,tel,date,timestamp:new Date()});
  res.redirect('/feed?user='+encodeURIComponent(nom));
});

module.exports = app;



  
