const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const { isUtf8 } = require("buffer")

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    fs.readdir(`./files`, function (err, files) {
        res.render("index", { files: files })
    })
})
app.get('/files/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        if (err) {
            res.send("Error Something went wrong.")
        } else {
            res.render('show',{filename: req.params.filename, filedata: filedata})
        }
    })
})

app.get('/edit/:filename', (req, res) => {
    res.render("edit", {filename: req.params.filename})
})

app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function (err) {
        if (err) {
            return res.status(500).send('Error writing file');
        }
        res.redirect('/');
    });
});
app.post('/edit', (req, res)=>{
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err){
        if (err) {
            return res.send('Error Occured');
        }else{
        res.redirect('/');
        }
    })
})

app.listen(3000)

