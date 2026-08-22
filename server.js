const express = require('express');
const fs = require('fs');
const multer = require('multer');
const app = express();
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(__dirname));
if (!fs.existsSync('users.json')) fs.writeFileSync('users.json', '[]');
if (!fs.existsSync('posts.json')) fs.writeFileSync('posts.json', '[]');
const upload = multer({ storage: multer.memoryStorage() });

function getUser(name){ try{ let u=JSON.parse(fs.readFileSync('users.json')); return u.find(x=>x.name===name); }catch(e){ return null; } }

function menu(userName){
 let u=getUser(userName);
 let photoHtml = u && u.photo? `<img src="${u.photo}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">` : `<div 
 style="width:32px;height:32px;border-radius:50%;background:#C9A86A;display:flex;align-items:center;justify-content:center;font-weight:bold;">${userName?userName[0].toUpperCase():'G'}</div>`;
 return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#111;color:#C9A86A;"><a href="/?user=${userName}" style="color:#C9A86A;text-decoration:none;font-weight:bold;">GMK ARROW</a><a href="/profile?user=${userName}" style="display:flex;align-items:center;gap:8px;color:white;text-decoration:none;">${photoHtml}<span>${userName}</span></a></div>`;
}
function pageRegister(msg=''){
 return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GMK ARROW</title></head>
 <body style="margin:0;font-family:sans-serif;background:#0a0a0a;color:white;">
 <div style="max-width:400px;margin:40px auto;padding:20px;">
 <h1 style="color:#C9A86A;text-align:center;">GMK ARROW</h1>
 <p style="color:red;text-align:center;">${msg}</p>
 <form action="/register" method="post" enctype="multipart/form-data" style="display:flex;flex-direction:column;gap:12px;">
 <input name="name" placeholder="Ton nom" required style="padding:12px;border-radius:8px;border:none;">
 <label style="background:#222;padding:12px;border-radius:8px;text-align:center;cursor:pointer;">📷 Choisir photo de profil <input type="file" 
name="photo" accept="image/*" style="display:none;" onchange="let r=new FileReader();r.onload=e=>{document.getElementById('prev').innerHTML='<img src='+e.target.result+' style=width:100%;border-radius:8px;max-height:200px;object-fit:cover>'};r.readAsDataURL(this.files[0])"></label>
 <div id="prev"></div>
 <input name="password" type="password" placeholder="Mot de passe" required style="padding:12px;border-radius:8px;border:none;">
 <button style="padding:12px;background:#C9A86A;border:none;border-radius:8px;font-weight:bold;">S'inscrire ARROW</button>
 </form>
 <p style="text-align:center;margin-top:12px;"><a href="/login" style="color:#C9A86A;">Déjà inscrit? Se connecter</a></p>
 </div></body></html>`;
}
app.get('/register',(req,res)=>res.send(pageRegister()));
app.get('/login',(req,res)=>{
res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;font-family:sans-serif;background:#0a0a0a;color:white;"><div style="max-width:400px;margin:40px auto;padding:20px;"><h1 style="color:#C9A86A;text-align:center;">Connexion</h1><form action="/login" method="post" style="display:flex;flex-direction:column;gap:12px;"><input name="name" placeholder="Nom" required style="padding:12px;border-radius:8px;border:none;"><input name="password" type="password" placeholder="Mot de passe" required style="padding:12px;border-radius:8px;border:none;"><button style="padding:12px;background:#C9A86A;border:none;border-radius:8px;font-weight:bold;">Entrer</button></form><p style="text-align:center;"><a href="/register" style="color:#C9A86A;">Créer compte</a></p></div></body></html>`);
});
app.post('/register', upload.single('photo'), (req,res)=>{
 let users=JSON.parse(fs.readFileSync('users.json'));
 if(users.find(x=>x.name===req.body.name)) return res.send(pageRegister('Nom déjà pris'));
 let photoBase64 = '';
 if(req.file){ photoBase64 = 'data:'+req.file.mimetype+';base64,'+req.file.buffer.toString('base64'); }
 users.push({name:req.body.name,password:req.body.password,photo:photoBase64});
 fs.writeFileSync('users.json', JSON.stringify(users));
 res.redirect('/?user='+encodeURIComponent(req.body.name));
});

app.post('/login',(req,res)=>{
 let u=getUser(req.body.name);
 if(!u || u.password!==req.body.password) return res.send('Mauvais mot de passe <a href=/login>Retour</a>');
 res.redirect('/?
user='+encodeURIComponent(req.body.name));
});

app.get('/',(req,res)=>{
 if(!req.query.user) return res.redirect('/register');
 let posts=JSON.parse(fs.readFileSync('posts.json')).reverse();
 let htmlPosts=posts.map(p=>{
  let user=getUser(p.user);
  let pPhoto=user&&user.photo?`<img src="${user.photo}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">`:`<div style="width:30px;height:30px;border-radius:50%;background:#C9A86A;display:flex;align-items:center;justify-content:center;">${p.user[0]}</div>`;
  let img=p.photo?`<img src="${p.photo}" style="width:100%;border-radius:10px;margin-top:10px;max-height:400px;object-fit:cover;">`:'';
  return `<div 
style="background:#1a1a1a;padding:12px;border-radius:10px;margin-bottom:12px;"><div style="display:flex;align-items:center;gap:8px;">${pPhoto}<b>${p.user}</b></div><div style="margin-top:8px;">${p.text}</div>${img}</div>`;
 }).join('');
 res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GMK ARROW</title></head><body style="margin:0;font-family:sans-serif;background:#0a0a0a;color:white;">
 ${menu(req.query.user)}
 <div style="max-width:500px;margin:0 auto;padding:12px;">
 <form action="/post?user=${encodeURIComponent(req.query.user)}" method="post" enctype="multipart/form-data" style="background:#1a1a1a;padding:12px;border-radius:10px;display:flex;flex-direction:column;gap:10px;margin-bottom:15px;">
 <textarea name="text" placeholder="Quoi de neuf ${req.query.user}?" style="padding:12px;border-radius:8px;border:none;min-height:60px;"></
 textarea>
 <div id="prevPost"></div>
 <label style="background:#222;padding:10px;border-radius:8px;text-align:center;cursor:pointer;">📷 Ajouter une photo <input type="file" name="photo" accept="image/*" style="display:none;" onchange="let r=new FileReader();r.onload=e=>{document.getElementById('prevPost').innerHTML='<img src='+e.target.result+' style=width:100%;border-radius:8px;max-height:250px;object-fit:cover>'};r.readAsDataURL(this.files[0])"></label>
 <button style="padding:12px;background:#C9A86A;border:none;border-radius:8px;font-weight:bold;">ARROW ➤ Poster</button>
 </form>
 ${htmlPosts || '<p style=text-align:center;color:#666>Aucun post encore. Sois le premier!</p>'}
 </div></body></html>`);
});
app.post('/post', upload.single('photo'), (req,res)=>{
 let posts=JSON.parse(fs.readFileSync('posts.json'));
 let photoBase64='';
 if(req.file){ photoBase64='data:'+req.file.mimetype+';base64,'+req.file.buffer.toString('base64'); }
 posts.push({user:req.query.user,text:req.body.text||'',photo:photoBase64,time:Date.now()});
 fs.writeFileSync('posts.json', JSON.stringify(posts));
 res.redirect('/?user='+encodeURIComponent(req.query.user));
});
app.get('/profile',(req,res)=>{
 let u=getUser(req.query.user);
 if(!u) return res.redirect('/register');
 let photo=u.photo?`<img src="${u.photo}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;">`:`<div style="width:100px;height:100px;border-radius:50%;background:#C9A86A;display:flex;align-items:center;justify-content:center;font-size:40px;">${u.name[0].toUpperCase()}</div>`;
 res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;font-family:sans-serif;background:#0a0a0a;color:white;">${menu(req.query.user)}<div style="max-width:400px;margin:20px auto;padding:20px;text-align:center;"><div style="display:flex;justify-content:center;">${photo}</div><h2>${u.name}</h2><form action="/update-photo?user=${encodeURIComponent(req.query.user)}" method="post" enctype="multipart/form-data" style="margin-top:15px;display:flex;flex-direction:column;gap:10px;"><div id="prevProf"></div><label 
 style="background:#C9A86A;color:black;padding:10px;border-radius:8px;cursor:pointer;">📷 Changer photo <input type="file" name="photo" accept="image/*" style="display:none;" onchange="let r=new FileReader();r.onload=e=>{document.getElementById('prevProf').innerHTML='<img src='+e.target.result+' style=width:100%;border-radius:8px;max-height:200px;object-fit:cover>'};r.readAsDataURL(this.files[0])"></label><button style="padding:10px;background:#222;color:white;border:none;border-radius:8px;">Enregistrer</button></form><br><a href="/?user=${encodeURIComponent(req.query.user)}" style="color:#C9A86A;">Retour fil d'actu</a></div></body></html>`);
});
app.post('/update-photo', upload.single('photo'), (req,res)=>{
 let users=JSON.parse(fs.readFileSync('users.json'));
 let idx=users.findIndex(x=>x.name===req.query.user);
 if(idx>=0 && req.file){ users[idx].photo='data:'+req.file.mimetype+';base64,'+req.file.buffer.toString('base64'); fs.writeFileSync('users.json', JSON.stringify(users)); }
 res.redirect('/profile?user='+encodeURIComponent(req.query.user));
});

app.get('/reset-gmk-2024',(req,res)=>{ fs.writeFileSync('users.json','[]'); fs.writeFileSync('posts.json','[]'); res.send('Reset OK <a href=/register>Register</a>'); });

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log('GMK ARROW on '+PORT));


 
