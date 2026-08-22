const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));
if (!fs.existsSync('users.json')) fs.writeFileSync('users.json', '[]');
if (!fs.existsSync('posts.json')) fs.writeFileSync('posts.json', '[]');
function menu(u){
return `<div style="background:#0a1931;padding:20px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10;border-bottom:2px solid #c5a86a">
<a href="/?user=${u||''}" style="display:flex;align-items:center;gap:12px;text-decoration:none">
<div style="width:58px;height:58px;background:#c5a86a;color:#0a1931;display:flex;align-items:center;justify-content:center;font-weight:bold;border-radius:12px;font-size:30px">G</div>
<span style="color:#c5a86a;font-weight:bold;font-size:23px">GMK ARROW</span>
</a>
<div style="display:flex;align-items:center;gap:18px">
<a href="/?user=${u||''}" style="color:white;text-decoration:none;font-size:19px;font-weight:bold">Fil</a>
${u?`<a href="/profil?user=${u}" style="color:white;text-decoration:none;display:flex;align-items:center;gap:8px;font-size:16px"><div style="width:44px;height:44px;background:#c5a86a;color:#0a1931;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold">G</div> ${u.split('-')[0]}</a>`:''}
</div>
</div>`;
}
app.get('/',(req,res)=>{
const posts=JSON.parse(fs.readFileSync('posts.json'));
const user=req.query.user;
res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"><title>GMK ARROW</title></head><body style="margin:0;background:#0a1931;font-family:Arial;color:white">
${menu(user)}
<div style="max-width:600px;margin:0 auto;padding:20px">
<div style="background:#112240;border-radius:20px;padding:20px;border:1px solid #1a365d">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:15px"><div style="width:50px;height:50px;background:#c5a86a;color:#0a1931;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:22px">G</div><b style="font-size:18px">${user?user.split('-')[0]+' - Fondateur':'Invité'}</b></div>
<form method="POST" action="/post?user=${user||''}"><textarea name="content" placeholder="Quoi de neuf Chef?" 
style="width:100%;background:#0a1931;border:1px solid #2a4a7a;color:white;padding:16px;border-radius:12px;font-size:17px;box-sizing:border-box" rows="3"></textarea><button style="margin-top:12px;background:#c5a86a;color:#0a1931;border:none;padding:12px 24px;border-radius:25px;font-weight:bold;font-size:16px">→ Envoyer ARROW</button></form>
</div>
${posts.reverse().map(p=>`<div style="background:#112240;margin-top:16px;border-radius:16px;padding:16px;border:1px solid #1a365d"><b>${p.user}</b><p style="margin:10px 0 0;font-size:16px">${p.content}</p></div>`).join('')}
</div></body></html>`);
});
app.post('/post',(req,res)=>{
const posts=JSON.parse(fs.readFileSync('posts.json'));
posts.push({user:req.query.user||'Anonyme',content:req.body.content,date:new Date()});
fs.writeFileSync('posts.json',JSON.stringify(posts));
res.redirect('/?user='+(req.query.user||''));
});
app.get('/profil',(req,res)=>{
const user=req.query.user;
res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Profil</title></head><body style="margin:0;background:#0a1931;font-family:Arial;color:white">${menu(user)}<div style="padding:40px;text-align:center"><div style="width:90px;height:90px;background:#c5a86a;color:#0a1931;border-radius:50%;display:flex;align-
items:center;justify-content:center;font-weight:bold;font-size:40px;margin:0 auto">G</div><h2>${user||'Profil'}</h2></div></body></html>`);
});
app.listen(process.env.PORT||10000);  
