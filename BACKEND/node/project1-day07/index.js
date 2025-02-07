const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    fs.readdir('./files', function(err, files) {
        if (err) {
            console.error("Could not list the files.", err);
            return res.render("index", { files: [] }); // Render with an empty array on error
        }
        console.log(files);
        res.render("index", { files: files }); // Render the files
    });
});

app.post("/create", function(req, res) {
    const fileName = req.body.title.split(' ').join('_') + '.txt'; // Replace spaces with underscores
    const filePath = `./files/${fileName}`;
    
    fs.writeFile(filePath, req.body.details, function(err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Error creating file.");
        }

        // After writing the file, redirect to the main page to show the updated file list
        res.redirect("/");
    });
});

app.get('/files/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(404).send("File not found.");
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});
app.get('/edit/:filename', function(req, res) {
    res.render('edit',{filename:req.params.filename});
 });
 

 app.post('/edit', function(req, res) {
    const oldFileName = req.body.previous;
    const newFileName = req.body.new;

    // Check if both fields are provided
    if (!oldFileName || !newFileName) {
        return res.status(400).send("Both old and new filenames are required.");
    }

    // Rename the file
    fs.rename(`./files/${oldFileName}`, `./files/${newFileName}`, function(err) {
        if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).send("Error renaming file.");
        }

        // Redirect to the homepage after renaming
        res.redirect('/');
    });
});



app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
