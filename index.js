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
        res.render("index", { files: files, message: null })
    })
})
app.get('/files/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        if (err) {
            res.send("Error Something went wrong.")
        } else {
            res.render('show',{filename: req.params.filename, filedata: filedata, message: null})
        }
    })
})

app.get('/edit/:filename', (req, res) => {
    res.render("edit", {filename: req.params.filename, message: null})
})

app.post('/create', (req, res) => {
    if (!req.body.title) {
        return res.render('index', { files: [], message: 'Please enter a file name' });
    }
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function (err) {
        if (err) {
            return res.status(500).render('index', { files: [], message: 'Error writing file' });
        }
        fs.readdir(`./files`, function (err, files) {
            res.render("index", { files: files, message: 'File created successfully' })
        })
    });
});
app.post('/edit', (req, res)=>{
    if (!req.body.previous || !req.body.new) {
        return res.render('edit', { filename: req.body.previous, message: 'Please enter both previous and new file names' });
    }
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err){
        if (err) {
            return res.render('edit', { filename: req.body.previous, message: 'Error Occured' });
        }else{
            fs.readdir(`./files`, function (err, files) {
                res.render("index", { files: files, message: 'File renamed successfully' })
            })
        }
    })
})

app.post('/delete', (req, res) => {
    if (!req.body.filename) {
        return res.render('show', { filename: req.body.filename, filedata: '', message: 'Please enter a file name' });
    }
    fs.unlink(`./files/${req.body.filename}`, function(err) {
        if (err) {
            return res.status(500).render('show', { filename: req.body.filename, filedata: '', message: 'Error deleting file' });
        }
        fs.readdir(`./files`, function (err, files) {
            res.render("index", { files: files, message: 'File deleted successfully' })
        })
    });
});

app.listen(3000)

