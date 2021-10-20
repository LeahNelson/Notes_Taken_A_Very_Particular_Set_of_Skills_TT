const express = require('express');
const notesdb = require('./db/db.json');
const path = require('path');
const utilfs = require('./helpers/fsUtils')//readFromFile, writeToFile, readAndAppend 
const ids = require('./helpers/uuid')
const PORT = 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req,res) =>
res.sendFile(path.join(__dirname, 'public/notes.html'))
);
app.get('/api/notes', (req, res) => {
    res.json(notesdb)});

app.get('/api/notes/:note', (req, res) => {
    // Coerce the specific search term to lowercase
    const requestedTerm = req.params.note.toLowerCase();
    //:note is a generic that will be placed by user http://.../notes/note if note was requested
    console.log(req)
        // Iterate through the terms name to check if it matches `req.params.term`
        for (let i = 0; i < notesdb.length; i++) {
            if (requestedTerm === notesdb[i].title.toLowerCase()) {
                return res.json(notesdb[i]);
        }
    }
    // Return a message if the term doesn't exist in our DB
    return res.json('No match found');
});

// // GET request for reviews
// app.get('/api/reviews', (req, res) => {
//   // Send a message to the client
//   res.json(`${req.method} request received to get reviews`);

//   // Log our request to the terminal
//   console.info(`${req.method} request received to get reviews`);
// });

// app.post('/db', (req, res) => {
//     // Log that a POST request was received
//     console.info(`${req.method} request received to add a review`);
//     // Destructuring assignment for the items in req.body
//     const { title, text } = req.body;
//     // If all the required properties are present
//     if (title && text) {
//       // new note variable
//       const newNote = {
//         title,
//         text,
//         note_id: ids(),
//       };
//       //get any existing notes and append to the same file
//       utilfs.readAndAppend(newNote, notesdb);
//     };
// });
//rediredct for bad url
app.get('*', (req, res) =>
  res.send(
    `Turn back before it is too late! <a href="http://localhost:${PORT}/">http://localhost:${PORT}/</a>`
  )
);
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);