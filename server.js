const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
if (!fs.existsSync('users.json')) fs.writeFileSync('users.json', '[]');
if (!fs.existsSync('posts.json')) fs.writeFileSync('posts.json', '[]');
function pageRegister(msg=''){
return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>GMK ARROW - Inscription</title></head>
<body style="margin:0;background:#06162e;font-family:Arial;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:15px">
<div style="width:100%;max-width:380px;background:linear-gradient(180deg,#0a1f44 0%,#06162e 100%);border:1px solid #c5a86a;border-radius:20px;padding:25px 22px;text-align:center;box-shadow:0 0 20px rgba(197,168,106,0.2)">
<div style="margin:0 auto 10px;font-size:90px;line-height:1">➤</div>
<div style="width:0;height:0;margin:-85px auto 20px auto;border-left:30px solid transparent;border-right:30px solid transparent;border-bottom:55px solid #f5a623;filter:drop-shadow(0 0 10px #ff8c00);transform:rotate(0deg);position:relative"><div 
style="position:absolute;top:18px;left:-12px;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:22px solid #06162e"></div></div>
<div style="font-size:70px;color:#ffb338;margin-bottom:5px;text-shadow:0 0 15px #ff8c00">⮞</div>
<h1 style="color:#c5a86a;margin:5px 0 2px;font-size:24px;letter-spacing:1px">GMK ARROW</h1>
<p style="color:#c5a86a;font-size:11px;margin:0">La Nouvelle vision de la communication communautaire</p>
<p style="color:#c5a86a;font-size:10px;font-style:italic;margin:3px 0 5px">ensemble, nous irons plus loin!</p>
<h2 style="color:#c5a86a;margin:15px 0 3px;font-size:22px">GMK ARROW</h2>
<p style="color:white;font-size:11px;margin:0">La Nouvelle vision de la communication communautaire</p>
<p style="color:#c5a86a;font-size:10px;font-style:italic;margin:2px 0 20px">ensemble, nous irons plus loin!</p>
${msg?`<p style="color:#ff6b6b;font-size:13px">${msg}</p>`:''}
<form method="POST" action="/register">
<input name="name" placeholder="Georges Kasso7" required style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid #1a365d;background:#0a1931;color:#8aa0c0;font-size:14px;box-sizing:border-box;margin-bottom:10px">
<input name="email" type="email" placeholder="georgeskasso3@gmail.com" required style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid #1a365d;background:#0a1931;color:#8aa0c0;font-size:14px;box-sizing:border-box;margin-bottom:10px">
10px">
<input name="phone" placeholder="0552813337" required style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid #1a365d;background:#0a1931;color:#8aa0c0;font-size:14px;box-sizing:border-box;margin-bottom:10px">
<input name="password" type="password" placeholder="••••••••••" required style="width:100%;padding:12px 14px;border-radius:8px;border:1px solid #1a365d;background:white;color:#333;font-size:14px;box-sizing:border-box;margin-bottom:18px">
<button style="width:100%;background:#c5a86a;color:#0a1931;border:none;padding:13px;border-radius:8px;font-weight:bold;font-size:16px">S'inscrire</button>
</form>
<p style="color:#8aa0c0;font-size:13px;margin-top:15px">Déjà inscrit? <a href="/login" style="color:#c5a86a;text-decoration:none;font-weight:bold">Se connecter</a></p>
</div></body></html>`;
}
function menu(u){
return `<div style="background:#0a1931;padding:20px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;border-bottom:2px solid #c5a86a">
<a href="/?user=${u||''}" style="display:flex;align-items:center;gap:12px;text-decoration:none">
<div style="width:58px;height:58px;background:#c5a86a;color:#0a1931;display:flex;align-items:center;justify-content:center;font-weight:bold;border-radius:12px;font-size:30px">G</div>
<span style="color:#c5a86a;font-weight:bold;font-size:23px">GMK ARROW</span>
</a><div style="display:flex;gap:15px"><a href="/?user=${u}" style="color:white;text-decoration:none;font-weight:bold">Fil</a><a href="/profil?user=${u}" style="color:white;text-decoration:none">${u}</a></div></div>`;
}
app.get('/',(req,res)=>{
const user=req.query.user;
if(!user) return res.redirect('/register');
const posts=JSON.parse(fs.readFileSync('posts.json'));
res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>GMK ARROW</title></head><body style="margin:0;background:#0a1931;font-family:Arial;color:white">
${menu(user)}<div style="max-width:600px;margin:0 auto;padding:20px">
<div style="background:#112240;border-radius:20px;padding:20px;border:1px solid #1a365d">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:15px"><div style="width:50px;height:50px;background:#c5a86a;color:#0a1931;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold">G</div><b>${user} - Chef</b></div>
<form method="POST" action="/post?user=${user}"><textarea name="content" placeholder="Quoi de neuf Chef? - Envoyer une ARROW" style="width:100%;background:#0a1931;border:1px solid #2a4a7a;color:white;padding:16px;border-radius:12px;font-size:17px;box-sizing:border-box" rows="3"></textarea><button style="margin-top:12px;background:#c5a86a;color:#0a1931;border:none;padding:12px 24px;border-radius:25px;font-weight:bold">→ Envoyer ARROW</button></form></div>
${posts.reverse().map(p=>`<div style="background:#112240;margin-top:16px;border-radius:16px;padding:16px;border:1px solid #1a365d"><b>${p.user}</b><p style="margin:10px 0 0">${p.content}</p></div>`).join('')}
</div></body></html>`);
});
app.get('/register',(req,res)=>{ res.send(pageRegister()); });
app.get('/login',(req,res)=>{
res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Login</title></head><body style="margin:0;background:#06162e;font-family:Arial;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:15px"><div style="width:100%;max-width:380px;background:#0a1f44;border:1px solid #c5a86a;border-radius:20px;padding:25px;text-align:center"><div style="font-size:70px;color:#ffb338">⮞</div><h1 style="color:#c5a86a">GMK ARROW</h1><form method="POST" action="/login"><input name="email" placeholder="Email" required style="width:100%;padding:12px;border-radius:8px;border:1px solid #1a365d;background:#0a1931;color:white;margin-bottom:10px;box-sizing:border-box"><input name="password" type="password" placeholder="Mot de passe" required
style="width:100%;padding:12px;border-radius:8px;border:1px solid #1a365d;background:white;color:#333;margin-bottom:15px;box-sizing:border-box"><button style="width:100%;background:#c5a86a;color:#0a1931;border:none;padding:13px;border-radius:8px;font-weight:bold">Se connecter</button></form><p style="margin-top:15px"><a href="/register" style="color:#c5a86a;text-decoration:none">S'inscrire</a></p></div></body></html>`);
});
app.post('/register',(req,res)=>{
let users=JSON.parse(fs.readFileSync('users.json'));
if(users.find(u=>u.email===req.body.email)) return res.send(pageRegister('Email déjà utilisé Chef!'));
users.push(req.body); fs.writeFileSync('users.json',JSON.stringify(users));
res.redirect('/?user='+req.body.name);
});
app.post('/login',(req,res)=>{
let users=JSON.parse(fs.readFileSync('users.json'));
let u=users.find(x=>x.email===req.body.email && x.password===req.body.password);
if(!u) return res.send('Mauvais identifiants <a href="/login">Retour</a>');
res.redirect('/?user='+u.name);
});
app.post('/post',(req,res)=>{
let posts=JSON.parse(fs.readFileSync('posts.json'));
posts.push({user:req.query.user,content:req.body.content}); 
fs.writeFileSync('posts.json',JSON.stringify(posts));
res.redirect('/?user='+req.query.user);
});
app.get('/profil',(req,res)=>{ res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;background:#0a1931;color:white;font-family:Arial">${menu(req.query.user)}<div style="padding:40px;text-align:center"><h2>${req.query.user}</h2><a href="/register" style="color:#c5a86a">Déconnexion</a></div></body></html>`); });
app.listen(process.env.PORT||10000);
