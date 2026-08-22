const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));
if (!fs.existsSync('users.json')) fs.writeFileSync('users.json', '[]');
if (!fs.existsSync('posts.json')) fs.writeFileSync('posts.json', '[]');
function menu(u){
 return `<div style="background:#0a1931;padding:10px 15px;display:flex;align-items:center;gap:15px;position:sticky;top:0;z-index:100;border-bottom:2px solid #c5a86a">
  <a href="/?user=${u||''}" style="display:flex;align-items:center;gap:10px;text-decoration:none">
    <img src="/logo.jpeg" style="width:45px;height:45px;border-radius:8px;object-fit:cover">
    <span style="color:#c5a86a;font-weight:bold;font-size:18px">GMK ARROW</span>
  </a>
   <a href="/?user=${u||''}" style="color:white;text-decoration:none;margin-left:20px">Fil</a>
  ${u?`<span style="margin-left:auto;color:#c5a86a;display:flex;align-items:center;gap:8px"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#c5a86a,#f0d27a);color:#0a1931;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid #c5a86a">${u[0].toUpperCase()}</div>${u} 👑</span>`:''}
 </div>`;
}
app.get('/',(req,res)=>{
  const posts=JSON.parse(fs.readFileSync('posts.json'));
  const user=req.query.user||'Georges-Marie Kasso-Fondateur';
  let feed=posts.slice().reverse().map(p=>`
    <div style="background:#112240;border:1px solid #c5a86a33;padding:15px;border-radius:16px;margin-bottom:15px;display:flex;gap:12px">
      <div style="width:48px;height:48px;min-width:48px;border-radius:50%;background:${p.author.includes('Fondateur')?'linear-gradient(135deg,#c5a86a,#f0d27a)':'#233a5e'};color:${p.author.includes('Fondateur')?'#0a1931':'white'};display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:18px;border:2px solid #c5a86a;overflow:hidden">${p.author[0].toUpperCase()}</div>
      <div style="flex:1">
      <div style="font-weight:bold;color:${p.author.includes('Fondateur')?'#c5a86a':'white'}">${p.author} ${p.author.includes('Fondateur')?'👑 Fondateur':''}</div>
        <div style="color:#8892b0;font-size:11px">${new Date(p.date).toLocaleString()}</div>
        <div style="color:white;margin-top:8px;line-height:1.4">${p.message}</div>
      </div>
    </div>`).join('');
  res.send(`${menu(user)}<div style="background:#0a1931;min-height:100vh;padding:20px"><div style="max-width:600px;margin:auto">
    <div style="background:#112240;padding:20px;border-radius:16px;border:1px solid #c5a86a;margin-bottom:20px">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
              <div style="width:45px;height:45px;border-radius:50%;background:linear-gradient(135deg,#c5a86a,#f0d27a);display:flex;align-items:center;justify-content:center;font-weight:bold;color:#0a1931">${user[0].toUpperCase()}</div>
        <span style="color:white;font-weight:bold">${user}</span>
      </div>
      <form action="/post?user=${user}" method="POST">
        <textarea name="message" placeholder="Quoi de neuf Chef?" style="width:100%;height:80px;background:#0a1931;border:1px solid #c5a86a55;color:white;padding:12px;border-radius:12px;outline:none"></textarea>
        <button style="margin-top:10px;background:#c5a86a;color:#0a1931;border:none;padding:12px 22px;border-radius:20px;font-weight:bold;cursor:pointer">🏹 Envoyer ARROW</button>
      </form>
    </div>
    ${feed}
  </div></div>`);
});

app.post('/post',(req,res)=>{
  const posts=JSON.parse(fs.readFileSync('posts.json'));
  posts.push({author:req.query.user||'Georges-Marie Kasso-Fondateur',message:req.body.message,date:new Date()});
  fs.writeFileSync('posts.json',JSON.stringify(posts));
  res.redirect('/?user='+(req.query.user||'Georges-Marie Kasso-Fondateur'));
});
app.get('/register',(req,res)=>{
  res.send(`${menu('')}<div style="background:#0a1931;min-height:100vh;padding:40px"><div style="max-width:400px;margin:auto;background:#112240;padding:25px;border-radius:16px;border:1px solid #c5a86a;text-align:center">
  <img src="/logo.jpeg" style="width:80px;border-radius:12px"><h2 style="color:#c5a86a">Rejoindre GMK ARROW</h2><p style="color:#8892b0">La Nouvelle vision de la communication communautaire</p>
  <form action="/register" method="POST">
    <input name="name" placeholder="Nom complet" required style="width:100%;padding:12px;margin:8px 0;background:#0a1931;border:1px solid #c5a86a;color:white;border-radius:8px">
    <input name="email" placeholder="Email" required style="width:100%;padding:12px;margin:8px 0;background:#0a1931;border:1px solid #c5a86a;color:white;border-radius:8px">
    <button 
    style="width:100%;background:#c5a86a;color:#0a1931;padding:12px;border:none;border-radius:20px;font-weight:bold;margin-top:10px">S'inscrire</button>
  </form></div></div>`);  
});
app.post('/register',(req,res)=>{
  const users=JSON.parse(fs.readFileSync('users.json'));
  users.push(req.body);
  fs.writeFileSync('users.json',JSON.stringify(users));
  res.redirect('/?user='+encodeURIComponent(req.body.name));
});
app.listen(process.env.PORT||3000,()=>console.log('GMK ARROW READY'));
