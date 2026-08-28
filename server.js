const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

const supabase = createClient(
  'https://tubbfzlcgirkpuqzdblw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YmJmZnpsY2dpcmtwdXF6ZGJsdyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzUxNjI5MTUxMSwiZXhwIjoyMDY3MjA1MTUxMX0.EszIv4xCIGNvEwMzOyMTTiWXQoA-8h7nM3tXJ3r5p6k7l8m9n0o1p2q'
);
let membres = [{nom:"Georges Kasso", email:"georgeskasso39@gmail.com", pseudo:"Georges - Marie Kasso", password:"1234"}];

app.get('/', (req,res)=>{ res.sendFile(path.join(__dirname, 'public', 'index.html')); });

app.post('/api/login', (req,res)=>{
  const {pseudo,email} = req.body;
  const search = (pseudo||email||"").toLowerCase().trim();
  let user=membres.find(m=>m.pseudo.toLowerCase()==search || m.email.toLowerCase()==search) || {nom:pseudo||email, pseudo};
  res.json({success:true, user});
});
app.post('/api/register', (req,res)=>{
  membres.push(req.body);
  res.json({success:true});
});

// NOUVEAU: UPLOAD QUI RESTE POUR TOUJOURS!
const upload = multer({ storage: multer.memoryStorage() });
app.post('/upload', upload.single('file'), async (req,res)=>{
  try{
    if(!req.file) return res.json({erreur:'Pas de fichier'});
    const fileName = Date.now()+"-"+req.file.originalname.replace(/\s/g,'_');
    const {error} = await supabase.storage.from('gmk-medias').upload(fileName, req.file.buffer, {contentType:req.file.mimetype});
    if(error) throw error;
    const {data} = supabase.storage.from('gmk-medias').getPublicUrl(fileName);
    res.json({url:data.publicUrl, success:true});
  }catch(e){ res.json({erreur:e.message}); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("GMK sur "+PORT));
module.exports=app;
