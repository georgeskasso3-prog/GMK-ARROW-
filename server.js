const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

let posts = [];
// Charger si fichier existe
try {
  if(fs.existsSync('data.json')){
    posts = JSON.parse(fs.readFileSync('data.json'));
  }
} catch(e){}

function save(){
  try{ fs.writeFileSync('data.json', JSON.stringify(posts)); }catch(e){}
  
}
<html><head><title>GMK ARROW</title><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{background:#001f3f;color:#FFD700;font-family:Arial;text-align:center;padding:20px;margin:0}</style>
</head><body>
<h1 style="font-size:50px;">GMK ARROW</h1>
<h2 style="font-size:28px;">Bienvenue Chef Georges-Marie Kasso</h2>
<a href="/register" style="background:#FFD700;color:#001f3f;padding:20px 45px;text-decoration:none;font-size:22px;font-weight:bold;border-radius:10px;display:inline-block;margin:20px;">S'inscrire</a>
<br><br>
<a href="/dashboard?user=Georges-Marie Kasso" style="color:white;font-size:18px;text-decoration:underline;">Voir Dashboard Blanc</a>
</body></html>
`);
});

app.get('/', (req, res) => {
res.send(`
app.get('/register', (req, res) => {
res.send(`
<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Register</title></head>
<body style="background:#001f3f;color:white;font-family:Arial;padding:20px;text-align:center;">
<h2 style="color:#FFD700;">Inscription GMK ARROW</h2>
<form method="POST" action="/register" style="max-width:400px;margin:auto;background:white;padding:20px;border-radius:15px;">
<input name="name" placeholder="Nom complet" required style="width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ccc;">
<input name="email" placeholder="Email" required style="width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ccc;">
<input name="phone" placeholder="Téléphone" required 
style="width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #ccc;">
<button type="submit" style="width:100%;padding:14px;background:#FFD700;color:#001f3f;font-weight:bold;border:none;border-radius:8px;font-size:18px;margin-top:10px;">Valider</button>
</form>
</body></html>
`);
});

app.post('/register', (req, res) => {
  let {name, email, phone} = req.body;
  name = (name||'').trim();
  email = (email||'').trim().toLowerCase();
  phone = (phone||'').trim();
  
  // ANTI-DOUBLON ULTRA STRICT
  let existe = posts.find(p => 
    p.email.toLowerCase() === email || 
    p.phone === phone ||
    p.name.toLowerCase() === name.toLowerCase()
  );
  if(!existe){
    let now = new Date();
    // Force date Afrique/Abidjan pour CE MOIS
    let dateStr = now.toLocaleDateString('fr-FR', {timeZone: 'Africa/Abidjan'});
    posts.push({name, email, phone, date: dateStr, timestamp: now.getTime()});
    save();
  }
  res.redirect('/feed?user='+encodeURIComponent(name));
});

app.get('/feed', (req, res) => {
  let user = req.query.user || 'Chef';
  let htmlPosts = posts.map(p => `<div style="background:white;color:#001f3f;padding:12px;margin:10px 0;border-radius:10px;text-align:left;"><b>${p.name}</b><br>${p.email}<br>${p.phone}<br><small>${p.date}</small></div>`).join('');
  res.send(`
<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="background:#001f3f;color:white;font-family:Arial;padding:15px;">
  <h2 style="color:#FFD700;text-align:center;">Feed de ${user}</h2>
  ${htmlPosts}
  <div style="text-align:center;margin-top:20px;"><a href="/dashboard?user=${encodeURIComponent(user)}" style="background:#FFD700;color:#001f3f;padding:15px 30px;text-decoration:none;border-radius:10px;font-weight:bold;">Aller au Dashboard Blanc</a></div>
  </body></html>
  `);
});
app.get('/dashboard', (req, res) => {
  let user = req.query.user || 'Chef';
  let now = new Date();
  let todayStr = now.toLocaleDateString('fr-FR', {timeZone: 'Africa/Abidjan'});
  let moisActuel = parseInt(todayStr.split('/')[1], 10);
  let anneeActuelle = parseInt(todayStr.split('/')[2], 10);
  
  let countToday = 0, countMois = 0, countAnnee = 0;

 posts.forEach(p => {
    try{
      let dParts = p.date.split('/');
      let m = parseInt(dParts[1], 10);
      let y = parseInt(dParts[2], 10);
      let a = parseInt(dParts[0], 10);
      
      if(p.date === todayStr) countToday++;
      if(m === moisActuel && y === anneeActuelle) countMois++;
      if(y === anneeActuelle) countAnnee++;
    }catch(e){}
  });
  // Calcul semaine (7 derniers jours)
  let countSemaine = 0;
  let sevenDaysAgo = now.getTime() - (7*24*60*60*1000);
  posts.forEach(p => { if(p.timestamp >= sevenDaysAgo) countSemaine++; });
  
  let liste = posts.map(p => `<div style="padding:12px;border-bottom:1px solid #eee;">${p.name} | ${p.email} | ${p.phone} | ${p.date}</div>`).join('');
  
  res.send(`
  <html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>
  body{font-family:Arial;margin:0;padding:15px;background:#f5f5f5}
  .card{background:#001f3f;color:#FFD700;padding:25px;border-radius:20px;text-align:center;margin:15px 0;font-weight:bold}
  .card span{font-size:14px;display:block;margin-bottom:10px}
  .card b{font-size:45px;display:block}
  .yellow{background:#FFD700;color:#001f3f}
  </style></head><body>
  <h2 style="color:#001f3f;">Dashboard Blanc de ${user}</h2>
  <div class="card"><span>AUJOURD HUI</span><b>${countToday}</b></div>
  <div class="card"><span>CETTE SEMAINE</span><b>${countSemaine}</b></div>
  <div class="card"><span>CE MOIS</span><b>${countMois}</b></div>
  <div class="card yellow"><span>CETTE ANNEE</span><b>${countAnnee}</b></div>
  <h3 style="color:#001f3f;margin-top:30px;">Liste Complete (${posts.length} membres)</h3>
  <div style="background:white;border-radius:15px;overflow:hidden;">${liste}</div>
  </body></html>
  `);
});

app.listen(PORT, () => console.log('HELLO WORLD! GMK ARROW Live on '+PORT));
