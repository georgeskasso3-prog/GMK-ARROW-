const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

let posts = [];

// PAGE ACCUEIL
app.get('/', (req, res) => {
  res.send(`
  <html><head><title>GMK ARROW</title></head>
  <body style="background:#001f3f; color:#FFD700; font-family:Arial; text-align:center; padding:50px;">
    <h1>GMK ARROW 🚀</h1>
    <h2>Bienvenue Chef Georges-Marie Kasso</h2>
    <a href="/register" style="background:#FFD700; color:#001f3f; padding:15px 30px; text-decoration:none; border-radius:10px; font-weight:bold;">S'inscrire</a>
  <br><br><br>
  <a href="/dashboard?user=Georges-Marie Kasso" style="color:white;">→ Mon Dashboard (Tour de contrôle)</a>
  </body></html>
  `);
});
// PAGE REGISTER
app.get('/register', (req, res) => {
  res.send(`
  <html><body style="background:#001f3f; color:#FFD700; font-family:Arial; text-align:center; padding:40px;">
    <h1>Inscription GMK ARROW</h1>
    <form action="/register" method="POST">
      <input name="nom" placeholder="Nom complet" required style="padding:10px; width:300px;"><br><br>
      <input name="email" placeholder="Email" required style="padding:10px; width:300px;"><br><br>
      <input name="tel" placeholder="Téléphone" style="padding:10px; width:300px;"><br><br>
      <button type="submit" style="background:#FFD700; padding:15px 30px; border:none; border-radius:10px; font-weight:bold;">S'inscrire</button>
    </form>
  </body></html>
  `);
});
app.post('/register', (req, res) => {
  const { nom, email, tel } = req.body;
  const date = new Date().toLocaleDateString('fr-FR');
  const ligne = \`\${nom} - \${email} - \${tel} - \${date}\n\`;
  fs.appendFileSync('membres.txt', ligne);
  res.redirect(\`/feed?user=\${encodeURIComponent(nom)}\`);
});

// PAGE FEED AVEC APERÇU PHOTO
app.get('/feed', (req, res) => {
  const user = req.query.user || 'Invité';
  const postsHTML = posts.map(p => \`
    <div style="background:#000; border:2px solid #FFD700; border-radius:15px; padding:20px; margin:20px auto; max-width:500px; text-align:left;">
      <b>\${p.user}</b> - \${p.date}<br><br>\${p.texte}
      \${p.photo ? \`<br><br><img src="\${p.photo}" style="width:100%; border-radius:10px;">\` : ''}
    </div>
 \`).join('');
 res.send(\`
  <html><head><title>Feed</title></head>
  <body style="background:#001f3f; color:#FFD700; font-family:Arial; padding:20px; text-align:center;">
    <h1>GMK ARROW - Feed de \${user}</h1>
    <div style="background:#000; padding:20px; border-radius:15px; border:2px solid #FFD700; max-width:500px; margin:auto;">
      <textarea id="texte" placeholder="Quoi de neuf Chef?" style="width:100%; height:80px; padding:10px; border-radius:10px;"></textarea><br><br>
      <input type="file" id="photoInput" accept="image/*" style="display:none;">
      <button onclick="document.getElementById('photoInput').click()" style="background:#fff; padding:10px; border-radius:5px;">📷 Ajouter une photo</button>
<div id="apercu" style="margin-top:15px; display:none;"><img id="apercuImg" style="width:100%; border-radius:10px;"><br><button onclick="supprimerPhoto()" style="color:red;">Supprimer</button></div>
      <br><br>
      <button onclick="publier()" style="background:#FFD700; color:#001f3f; padding:12px 30px; border:none; border-radius:10px; font-weight:bold; width:100%;">Publier</button>
    </div>
    <div id="posts">\${postsHTML}</div>
    <script>
      let photoBase64 = "";
      document.getElementById('photoInput').addEventListener('change', function(e){
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(ev){
          photoBase64 = ev.target.result;

      document.getElementById('apercuImg').src = photoBase64;
          document.getElementById('apercu').style.display = 'block';
        };
        reader.readAsDataURL(file);
      });
      function supprimerPhoto(){ photoBase64=""; document.getElementById('apercu').style.display='none'; }
      function publier(){
        const texte = document.getElementById('texte').value;
        if(!texte && !photoBase64) return alert('Ajoute un texte ou une photo Chef!');
        fetch('/post', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({user:'\${user}', texte, photo: photoBase64}) })
        .then(()=> location.reload());
      }
      </script>
    <br><a href="/dashboard?user=\${encodeURIComponent(user)}" style="color:#FFD700;">→ Aller au Dashboard</a>
  </body></html>
  \`);
});
app.post('/post', (req, res) => {
  const { user, texte, photo } = req.body;
  posts.unshift({ user, texte, photo, date: new Date().toLocaleString('fr-FR') });
  res.json({ ok: true });
});

// DASHBOARD TOUR DE CONTROLE - FOND BLANC
app.get('/dashboard', (req, res) => {
  fs.readFile('membres.txt', 'utf8', (err, data) => {
    if (err) data = '';
    const lignes = data.split('\\n').filter(l => l.trim() !== '');
    
    const aujourdhui = new Date().toLocaleDateString('fr-FR');
    const now = new Date();
    const debutSemaine = new Date(now); debutSemaine.setDate(now.getDate() - 7);
    const moisActuel = now.getMonth() + 1;
    const anneeActuelle = now.getFullYear();
     let countJour = 0, countSemaine = 0, countMois = 0, countAnnee = 0;

    lignes.forEach(ligne => {
      const parties = ligne.split(' - ');
      const dateStr = parties[parties.length - 1];
      if(!dateStr) return;
      if(dateStr.trim() === aujourdhui) countJour++;
      if(dateStr.includes(\`/\${moisActuel}/\`)) countMois++;
      if(dateStr.includes(\`/\${anneeActuelle}\`)) countAnnee++;
      countSemaine++; // simplifié pour l'instant
    });

    const membresHTML = lignes.map(ligne => 
      \`<div style="padding:15px; border-bottom:1px solid #eee; color:#333;">\${ligne.replace(/ - /g, ' | ')}</div>\`
    ).join('');

    res.send(\`
    <html><head><title>Dashboard GMK ARROW</title></head>
    <body style="background:#FFFFFF; color:#111; font-family:Arial; padding:30px;">
      <div style="max-width:900px; margin:auto;">
        <h1 style="text-align:center; color:#001f3f;">Dashboard GMK ARROW 👑</h1>
        <p style="text-align:center; color:#666;">Tour de contrôle - Vue générale des inscriptions</p>
        
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:20px; margin:30px 0;">
          <div style="background:#001f3f; color:#FFD700; padding:25px; border-radius:15px; width:160px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.2);">
            <div style="font-size:14px; opacity:0.8;">AUJOURD'HUI</div><div style="font-size:42px; font-weight:bold; margin-top:10px;">\${countJour}</div>
          </div>
<div style="background:#001f3f; color:#FFD700; padding:25px; border-radius:15px; width:160px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.2);">
            <div style="font-size:14px; opacity:0.8;">CETTE SEMAINE</div><div style="font-size:42px; font-weight:bold; margin-top:10px;">\${countSemaine}</div>
          </div>
          <div style="background:#001f3f; color:#FFD700; padding:25px; border-radius:15px; width:160px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.2);">
            <div style="font-size:14px; opacity:0.8;">CE MOIS</div><div style="font-size:42px; font-weight:bold; margin-top:10px;">\${countMois}</div>
          </div>
          <div style="background:#FFD700; color:#001f3f; padding:25px; border-radius:15px; width:160px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.2);">
<div style="font-size:14px; font-weight:bold;">CETTE ANNÉE</div><div style="font-size:42px; font-weight:bold; margin-top:10px;">\${countAnnee}</div>
          </div>
        </div>

        <h2 style="color:#001f3f; margin-top:40px;">Liste Complète des Membres (\${lignes.length})</h2>
        <div style="background:#f9f9f9; border:1px solid #ddd; border-radius:15px; padding:10px; max-height:400px; overflow:auto;">
          \${membresHTML || '<p style="padding:20px; color:#999;">Aucun membre pour le moment</p>'}
        </div>
        <br><br>
        <div style="text-align:center;">
          <a href="/feed?user=\$
{encodeURIComponent(req.query.user || '')}" style="background:#001f3f; color:#FFD700; padding:12px 25px; text-decoration:none; border-radius:10px; font-weight:bold;">← Retour Feed</a>
          <a href="/" style="margin-left:15px; color:#001f3f; text-decoration:underline;">Accueil</a>
        </div>
      </div>
    </body></html> §
    \`);
  });
});

app.listen(PORT, () => console.log('GMK ARROW Live sur ' + PORT)); 


          

