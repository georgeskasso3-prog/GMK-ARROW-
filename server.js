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
  process.env.SUPABASE_KEY
);

let membres = [{ nom:"Georges Kasso", email:"georgeskasso39@gmail.com", pseudo:"Georges - Marie Kasso", password:"1234" }];

app.get('/', (req,res)=> res.redirect('/register.html'));
app.post('/api/login', (req,res)=>{
  const { pseudo, email } = req.body;
  const s = (pseudo||email||"").toLowerCase().trim();
  let u = membres.find(m=> m.pseudo.toLowerCase()===s || m.email.toLowerCase()===s);
  if(!u) return res.json({success:false, message:"Non trouve"});
  res.json({success:true, user:u});
});

app.post('/api/register', (req,res)=>{ membres.push(req.body); res.json({success:true}); });

app.get('/api/posts', async (req,res)=>{
  const { data } = await supabase.from('posts').select('*').order('created_at',{ascending:false}).limit(100);
  res.json(data||[]);
});
app.post('/api/posts', async (req,res)=>{
  const { pseudo, content, text } = req.body;
  const finalText = content || text || "";
  const { data, error } = await supabase.from('posts').insert([{ pseudo: pseudo||'Toi', content: finalText }]).select();
  if(error) return res.status(500).json(error);
  res.json(data[0]);
});

const upload = multer({ storage: multer.memoryStorage() });
app.post('/api/upload', upload.single('file'), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({success:false});
    const ext = path.extname(req.file.originalname);
    const fileName = Date.now()+'-'+Math.random().toString(36).substring(7)+ext;
    const { error: upErr } = await supabase.storage.from('gmk-medias').upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert:true });
    if(upErr) throw upErr;
    const { data:{ publicUrl } } = supabase.storage.from('gmk-medias').getPublicUrl(fileName);
    const { pseudo, content } = req.body;
    const { data, error } = await supabase.from('posts').insert([{ pseudo: pseudo||'Toi', content: content||'', media_url: publicUrl, media_type: req.file.mimetype.startsWith('image')?'image':'video' }]).select();
    if(error) throw error;
    res.json({success:true, post: data[0], url: publicUrl});
  }catch(e){ res.status(500).json({success:false, error:e.message}); }
});

module.exports = app;






