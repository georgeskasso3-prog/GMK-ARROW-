const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
if (!fs.existsSync('users.json')) fs.writeFileSync('users.json', '[]');
if (!fs.existsSync('posts.json')) fs.writeFileSync('posts.json', '[]');
function menu(u){return `<div style="background:#0a1931;padding:15px;display:flex;gap:20px;position:sticky;top:0;z-index:99;border-bottom:2px solid #c5a86a"><b style="color:#c5a86a;letter-spacing:2px">GMK ARROW</b><a href="/?user=${u||''}" style="color:white;text-decoration:none">Accueil</a><a href="/users?user=${u||''}" style="color:white;text-decoration:none">Utilisateurs</a><a href="/register" style="color:#c5a86a;text-decoration:none">Inscription</a><span style="margin-left:auto;color:#aaa">${u||'Invité'}</span></div>`}
app.get('/',(req,res)=>{
  const posts=JSON.parse(fs.readFileSync('posts.json'));
  const user=req.query.user||'';
  let feed=posts.slice().reverse().map(p=>`<div style="background:#112240;border:1px solid #c5a86a;padding:15px;margin:12px 0;border-radius:12px"><div style="display:flex;align-items:center;gap:10px"><div style="width:40px;height:40px;background:#c5a86a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#0a1931">T</div><b style="color:white">${p.author}</b><small style="color:#aaa;margin-left:10px">${p.date}</small></div><p style="color:white;margin:15px 0">${p.message}</p><button style="background:#c5a86a;color:#0a1931;border:none;padding:8px 15px;border-radius:8px;font-weight:bold">Répondre en Arrow</button></div>`).join('');
  res.send(`${menu(user)}<div style="background:#0a1931;min-height:100vh;padding:20px"><div style="max-width:700px;margin:0 auto"><div 
  style="background:#112240;padding:20px;border-radius:12px;border:1px solid #c5a86a"><h2 style="color:white">Bienvenue ${user||'Chef'} !</h2><form method="POST" action="/post?user=${user}"><textarea name="message" required style="width:100%;height:70px;background:#0a1931;color:white;border:1px solid #c5a86a;border-radius:8px;padding:10px" placeholder="Quoi de neuf?"></textarea><br><br><button style="background:#c5a86a;color:#0a1931;padding:12px 25px;border:none;border-radius:8px;font-weight:bold;width:100%">ENVOYER ARROW</button></form></div><h3 style="color:#c5a86a;text-align:center;margin:20px 0">Fil d actualite</h3>${feed||'<p style="color:white;text-align:center">Pas encore de post</p>'}</div></div>`);
});
app.post('/post',(req,res)=>{
  const posts=JSON.parse(fs.readFileSync('posts.json'));
  posts.push({author:req.query.user||'Anonyme',message:req.body.message,date:new Date().toLocaleString()});
  fs.writeFileSync('posts.json',JSON.stringify(posts,null,2));
  res.redirect('/?user='+(req.query.user||''));
});
app.get('/register',(req,res)=>res.sendFile(path.join(__dirname,'public','register.html')));
app.post('/register',(req,res)=>{
  const users=JSON.parse(fs.readFileSync('users.json'));
  users.push({id:Date.now(),name:req.body.name,email:req.body.email,telephone:req.body.telephone,password:req.body.password,date:new Date().toLocaleString()});
fs.writeFileSync('users.json',JSON.stringify(users,null,2));
  res.redirect('/?user='+encodeURIComponent(req.body.name));
});
app.get('/users',(req,res)=>{
  const users=JSON.parse(fs.readFileSync('users.json'));
  const user=req.query.user||'';
  let list=users.map(u=>`<div style="background:#112240;border:1px solid #c5a86a;padding:10px;margin:5px 0;border-radius:8px;color:white"><b style="color:#c5a86a">${u.name}</b> - ${u.email} - ${u.telephone}</div>`).join('');
  res.send(`${menu(user)}<div style="background:#0a1931;min-height:100vh;padding:20px"><div style="max-width:700px;margin:0 auto"><h2 style="color:#c5a86a">Communauté GMK ARROW (${users.length})</h2>${list}</div></div>`);
});
const PORT=process.env.PORT||3000;
app.listen(PORT,'0.0.0.0',()=>console.log('GMK ARROW BLEU MARINE ET OR sur '+PORT));
