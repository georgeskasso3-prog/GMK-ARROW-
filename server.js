const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let posts = [];
try {
  if(fs.existsSync('data.json')){
    posts = JSON.parse(fs.readFileSync('data.json'));
  }
} catch(e){}

function save(){
  fs.writeFileSync('data.json', JSON.stringify(posts));
}
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GMK ARROW</title>
    <style>
      body{background:#0a0a0a;color:#fff;font-family:Arial;text-align:center;padding:20px}
      .logo{width:120px;height:120px;border-radius:50%;border:3px solid #FFD700;object-fit:cover;margin:20px auto;display:block}
      h1{color:#FFD700;letter-spacing:2px}
      .card{background:#1a1a1a;border:1px solid #333;border-radius:15px;padding:20px;margin:15px auto;max-width:600px;text-align:left}
      .btn{background:#FFD700;color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer}

      input,textarea{width:100%;padding:12px;margin:8px 0;background:#222;border:1px solid #444;color:#fff;border-radius:8px}
    </style>
  </head>
  <body>
    <img src="/logo.png" class="logo" alt="GMK ARROW LOGO">
    <h1>GMK ARROW</h1>
    <p style="color:#aaa">Dashboard OK Chef - ${posts.length} posts</p>
    
    <div class="card">
      <h3 style="color:#FFD700">Créer un post</h3>
      <input id="title" placeholder="Titre...">
      <textarea id="content" placeholder="Contenu..."></textarea>
      <button class="btn" onclick="createPost()">Publier</button>
    </div>
    
<div id="posts">
      ${posts.map(p => `
        <div class="card">
          <h3>${p.title}</h3>
          <p>${p.content}</p>
          <small style="color:#666">${new Date(p.date).toLocaleString()}</small>
        </div>
      `).join('')}
    </div>

    <script>
      async function createPost(){
        const title=document.getElementById('title').value;
        const content=document.getElementById('content').value;
        if(!title||!content)return alert('Remplis tout Chef!');
        await fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,content})});
        location.reload();
      }
    </script>
 </body>
  </html>
  `);
});

app.get('/api/posts', (req,res)=> res.json(posts));

app.post('/api/posts', (req,res)=>{
  const newPost = {id:Date.now(), title:req.body.title, content:req.body.content, date:new Date()};
  posts.unshift(newPost);
  save();
  res.json(newPost);
});

app.listen(PORT, ()=> console.log('GMK ARROW OK sur '+PORT));



    
