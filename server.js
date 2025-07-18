const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const cors = require('cors');

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(cors());
app.use(express.static(initial_path));
app.use(fileupload());

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

app.get('/blog', (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date();
    let imagename = date.getDate() + date.getTime() + file.name;
    let uploadPath = path.join(initial_path, 'uploads', imagename);

    file.mv(uploadPath, (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'File upload failed' });
        } else{
            res.json(`uploads/${imagename}`)
        }
    })
})

app.get("/admin",(req,res) => {
    res.sendFile(path.join(initial_path, "dashboard.html"));
})

app.use((req, res) => {
    res.status(404).json("404");
})

app.listen(3000, () => {
    console.log('listening on port 3000......');
})