const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(
  'https://tubbfizgirpkqugbwlvy.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1YmJmaXpn...'
);

let membres = [{ nom:"Georges Kasso", email:"georgeskasso39@gmail.com", pseudo:"Georges - Marie Kasso", password:"1234" }];
app.get('/', (req,res)=> res.redirect('/register.html'));

app.post('/api/login', (req,res)=>{
  const { pseudo, email } = req.body;
  const search = (pseudo||email||"").toLowerCase().trim();
  let user = membres.find(m=> m.pseudo.toLowerCase()===search || m.email.toLowerCase()===search);
  if(!user) return res.json({success:false, message:"Non trouvé"});
  res.json({success:true, user});
});

app.post('/api/register', (req,res)=>{
  membres.push(req.body);
  res.json({success:true});
});
// --- RECUPERER LES POSTS POUR QUE TOUT LE MONDE SE VOIT ---
app.get('/api/posts', async (req,res)=>{
  const { data } = await supabase.from('posts').select('*').order('created_at',{ascending:false});
  res.json(data || []);
});

// --- UPLOAD VERS GMK-MEDIAS + INSERT DANS POSTS ---
const upload = multer({ storage: multer.memoryStorage() });
app.post('/api/upload', upload.single('file'), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({success:false});
    const ext = path.extname(req.file.originalname);
    const fileName = Date.now() + '-' + Math.random().toString(36).substring(2) + ext;
 const { error: upError } = await supabase.storage.from('gmk-medias').upload(fileName, req.file.buffer, { contentType: req.file.mimetype });
    if(upError) throw upError;

    const { data: { publicUrl } } = supabase.storage.from('gmk-medias').getPublicUrl(fileName);

    const { pseudo, type } = req.body;
    await supabase.from('posts').insert([{ pseudo: pseudo||'Anonyme', media_url: publicUrl, media_type: type||'video' }]);

    res.json({success:true, url: publicUrl});
  }catch(e){
    console.log(e);
    res.status(500).json({success:false, error: e.message});
  }
});

module.exports = app;

  
