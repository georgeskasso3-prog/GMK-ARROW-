const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// creer fichier base s'il n'existe pas
if (!fs.existsSync('users.json')) fs.writeFileSync('users.json', '[]');

app.get('/', (req,res) => res.redirect('/register'));
app.get('/register', (req,res) => res.sendFile(path.join(__dirname,'public','register.html')));
app.post('/register', (req,res) => {
  const users = JSON.parse(fs.readFileSync('users.json'));
  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    telephone: req.body.telephone,
    password: req.body.password,
    date: new Date().toLocaleString()
  };
  users.push(newUser);
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  console.log('UTILISATEUR SAUVEGARDE:', newUser);
  res.send(`<h1>Bienvenue ${newUser.name} !</h1><p>Tel: ${newUser.telephone} sauvegarde !</p><a href="/register">Retour</a> | <a href="/users">Voir tous les comptes</a>`);
});
app.get('/users', (req,res) => {
  const users = JSON.parse(fs.readFileSync('users.json'));
  let html = '<h1>Liste des comptes GMK ARROW ('+users.length+')</h1><a href="/register">Inscription</a><hr><ul>';
  users.forEach(u => { html += `<li><b>${u.name}</b> - ${u.email} - ${u.telephone} - ${u.date}</li>`; });
  html += '</ul>';
  res.send(html);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`GMK ARROW sur ${PORT}`));
