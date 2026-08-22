const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

let posts = [];

app.get('/', (req, res) => {
  res.send(`
  <html><head><title>GMK ARROW</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="background:#001f3f; color:#FFD700; font-family:Arial; text-align:center; padding:20px; margin:0; min-height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center;">
    <h1 style="font-size:50px; margin-bottom:10px;">GMK ARROW</h1>
    <h2 style="font-size:28px; margin-bottom:30px; padding:0 20px;">Bienvenue Chef Georges-Marie Kasso</h2>
    <a href="/register" style="background:#FFD700; color:#001f3f; padding:20px 45px; text-decoration:none; border-radius:15px; font-weight:bold; font-size:22px; display:inline-block;">S'inscrire</a>
    <br><br>
    <a href="/dashboard?user=Georges-Marie Kasso" style="color:white; font-size:18px; text-decoration:underline;">Mon Dashboard Tour de controle</a>
  </body></html>
  `);
});
app.get('/register', (req, res) => {
  res.send(`
  <html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="background:#001f3f; color:#FFD700; font-family:Arial; text-align:center; padding:20px;">
    <h1 style="font-size:36px;">Inscription GMK ARROW</h1>
    <form action="/register" method="POST" style="margin-top:30px;">
      <input name="nom" placeholder="Nom complet" required style="padding:18px; width:90%; max-width:400px; font-size:18px; border-radius:10px;"><br><br>
      <input name="email" placeholder="Email" required style="padding:18px; width:90%; max-width:400px; font-size:18px; border-radius:10px;"><br><br>
      <input name="tel" placeholder="Telephone" style="padding:18px; width:90%; max-width:400px; font-size:18px; border-radius:10px;"><br><br>
      <button type="submit" 
      style="background:#FFD700; color:#001f3f; padding:18px 45px; border:none; border-radius:12px; font-weight:bold; font-size:20px; margin-top:20px;">S'inscrire</button>
    </form>
  </body></html>
  `);
});
app.post('/register', (req, res) => {
  const nom = req.body.nom;
  const email = req.body.email.toLowerCase().trim();
  const tel = req.body.tel;
  const date = new Date().toLocaleDateString('fr-FR');

  let existData = '';
  try { existData = fs.readFileSync('membres.txt', 'utf8'); } catch(e) { existData = ''; }

  // 1. ANTI-DOUBLON : si email existe déjà, on ne rajoute pas
  if(existData.toLowerCase().includes(email)){
    console.log('Doublon bloqué: ' + email);
    return res.redirect('/feed?user=' + encodeURIComponent(nom));
  }
const ligne = nom + ' - ' + email + ' - ' + tel + ' - ' + date + '\n';
  fs.appendFileSync('membres.txt', ligne);
  res.redirect('/feed?user=' + encodeURIComponent(nom));
});

app.get('/feed', (req, res) => {
  const user = req.query.user || 'Invite';
  let postsHTML = '';
  for(let i=0;i<posts.length;i++){
    let p = posts[i];
    let img = p.photo? '<br><br><img src="'+p.photo+'" style="width:100%; border-radius:10px;">' : '';
    postsHTML += '<div style="background:#000; border:2px solid #FFD700; border-radius:15px; padding:20px; margin:20px auto; max-width:500px; text-align:left;"><b>'+p.user+'</b> - '+p.date+'<br><br>'+p.texte+img+'</div>';
  }
  res.send('<html><head><title>Feed</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body 
style="background:#001f3f; color:#FFD700; font-family:Arial; padding:20px; text-align:center;"><h1 style="font-size:28px;">GMK ARROW - Feed de '+user+'</h1><div id="posts">'+postsHTML+'</div><br><a href="/dashboard?user='+encodeURIComponent(user)+'" style="color:#FFD700; font-size:18px;">Aller au Dashboard Blanc</a></body></html>');
});
// Route spéciale pour nettoyer et repartir à 1 membre unique
app.get('/clean', (req, res) => {
  try {
    let data = fs.readFileSync('membres.txt', 'utf8');
    let lignes = data.split('\n').filter(l => l.trim()!== '');
    let uniqueMap = new Map();
    for(let l of lignes){
      let emailPart = l.split(' - ')[1];
      if(emailPart) uniqueMap.set(emailPart.toLowerCase().trim(), l);
    }
    let uniqueLignes = Array.from(uniqueMap.values());
    fs.writeFileSync('membres.txt', uniqueLignes.join('\n') + '\n');
    res.send('Nettoyé! Maintenant '+uniqueLignes.length+' membre unique. <br><a href="/dashboard?user=Georges-Marie Kasso">Retour Dashboard</a>');
  } catch(e){
    res.send('Fichier vide déjà');
     }
});
app.get('/dashboard', (req, res) => {
  fs.readFile('membres.txt', 'utf8', (err, data) => {
    if (err) data = '';
    const lignesBrutes = data.split('\n').filter(l => l.trim()!== '');

    // Dédupplication pour l'affichage
    let uniqueMap = new Map();
    for(let l of lignesBrutes){
      let parts = l.split(' - ');
      if(parts[1]) uniqueMap.set(parts[1].toLowerCase().trim(), l);
    }
    const lignes = Array.from(uniqueMap.values());

    const aujourdhui = new Date().toLocaleDateString('fr-FR');
    const now = new Date();
    const moisActuel = now.getMonth() + 1;
    const anneeActuelle = now.getFullYear();
    let countJour = 0, countMois = 0, countAnnee = 0;
    let countSemaine = lignes.length;
 for(let i=0;i<lignes.length;i++){
      let ligne = lignes[i];
      let parts = ligne.split(' - ');
      let dateStr = parts[parts.length - 1].trim();
      if(!dateStr) continue;
      if(dateStr === aujourdhui) countJour++;
      let dParts = dateStr.split('/');
      if(dParts.length===3){
        let m = parseInt(dParts[1], 10);
        let y = parseInt(dParts[2], 10);
       if(y === anneeActuelle) countAnnee++;
if(dateStr.includes('/'+moisActuel+'/') || dateStr.includes('/0'+moisActuel+'/') || m === moisActuel){
  countMois++;
}
      }
    }

    let membresHTML = '';
    for(let i=0;i<lignes.length;i++){
      membresHTML += '<div style="padding:15px; border-bottom:1px solid #eee; color:#333; font-size:16px;">'+lignes[i].split(' - ').join(' | ')+'</div>';
    }
    res.send(`
    <html><head><title>Dashboard GMK ARROW</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="background:#FFFFFF; color:#111; font-family:Arial; padding:15px; margin:0;">
      <div style="max-width:900px; margin:auto;">
        <h1 style="text-align:center; color:#001f3f; font-size:32px;">Dashboard GMK ARROW</h1>
        <p style="text-align:center; color:#666; font-size:18px;">Tour de controle - Fond Blanc - Version Corrigée</p>
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; margin:25px 0;">
          <div style="background:#001f3f; color:#FFD700; padding:25px; border-radius:15px; width:42%; max-width:160px; text-align:center;">
            <div style="font-size:14px;">AUJOURD HUI</div><div style="font-size:45px; font-weight:bold; margin-top:10px;">`+countJour+`</div>
 </div>
          <div style="background:#001f3f; color:#FFD700; padding:25px; border-radius:15px; width:42%; max-width:160px; text-align:center;">
            <div style="font-size:14px;">CETTE SEMAINE</div><div style="font-size:45px; font-weight:bold; margin-top:10px;">`+countSemaine+`</div>
          </div>
          <div style="background:#001f3f; color:#FFD700; padding:25px; border-radius:15px; width:42%; max-width:160px; text-align:center;">
            <div style="font-size:14px;">CE MOIS</div><div style="font-size:45px; font-weight:bold; margin-top:10px;">`+countMois+`</div>
          </div>
          <div style="background:#FFD700; color:#001f3f; padding:25px; border-radius:15px; width:42%; max-width:160px; text-align:center;">
            <div style="font-size:14px; font-weight:bold;">CETTE ANNEE</div><div style="font-size:45px; font-weight:bold; margin-top:10px;">`+countAnnee+`</div>
          </div>
           </div>
        <h2 style="color:#001f3f; font-size:22px;">Liste Complete (`+lignes.length+` membre unique)</h2>
        <div style="background:#f9f9f9; border:1px solid #ddd; border-radius:15px; padding:10px; max-height:400px; overflow:auto;">
          `+(membresHTML || '<p style="padding:20px; color:#999;">Aucun membre pour le moment</p>')+`
        </div>
        <br><br><div style="text-align:center; padding-bottom:30px;"><a href="/" style="background:#001f3f; color:#FFD700; padding:15px 30px; text-decoration:none; border-radius:10px; font-size:18px;">Accueil</a> &nbsp; <a href="/clean" style="background:#eee; color:#333; padding:15px 20px; text-decoration:none; border-radius:10px; font-size:14px;">Nettoyer doublons</a></div>
      </div>
    </body></html>
    `);
  });
});

app.listen(PORT, () => console.log('GMK ARROW Mobile Ready sur ' + PORT));      
