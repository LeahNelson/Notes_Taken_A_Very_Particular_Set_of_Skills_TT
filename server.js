const express = require('express');
const notesdb = require('./db/db.json');
const path = require('path');
const utilfs = require('./helpers/fsUtils')//readFromFile, writeToFile, readAndAppend 
const ids = require('./helpers/uuid')
const PORT = process.env.PORT || 3001;
const fs = require('fs');

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
    //res.json(`${req.method} request received`);
    console.log(notesdb)
    res.json(notesdb)});

// app.get('/api/notes/:note', (req, res) => {
//     // Coerce the specific search term to lowercase
//     const requestedTerm = req.params.note.toLowerCase();
//     //:note is a generic that will be placed by user http://.../notes/note if note was requested
//     console.log(req)
//         // Iterate through the terms name to check if it matches `req.params.term`
//         for (let i = 0; i < notesdb.length; i++) {
//             if (requestedTerm === notesdb[i].title.toLowerCase()) {
//                 return res.json(notesdb[i]);
//         }
//     }
//     // Return a message if the term doesn't exist in our DB
//     return res.json('No match found');
// });
// app.get('/api/notes/:id', (req, res) => {
//     const requestedId = req.params.id;
//     console.log(requestedId)
//     for (let i = 0; i < notesdb.length; i++) {
//         if (requestedId === notesdb[i].id) {
//             return res.json(notesdb[i]);
//     }
// }
// Return a message if the term doesn't exist in our DB
// return res.json('No match found');
// });
app.delete('/api/notes/:id', (req, res) => {
    const requestedId = req.params.id;
    console.log(requestedId)
    for (let i = 0; i < notesdb.length; i++) {
        if (requestedId === notesdb[i].id) {
            //const removed = notesdb.splice(i,i);
            const removed = notesdb.splice(i,1);
            console.log(removed);
            utilfs.writeToFile('./db/db.json',notesdb);
            utilfs.readAndAppend(removed, './db/removed.json');
            return res.json(notesdb);
    }
}
// Return a message if the term doesn't exist in our DB
return res.json('No match found');
});
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
    const { title, text } = req.body;
    console.log("back New Note",req.body);
    // Prepare a response object to send back to the client
    if (title && text) {
    const newNote = {
        title,
        text,
        id: ids(),
    };
    const response = {
        status: 'success',
        data: newNote,
        
      };
      console.log(response);
      readAndAppend(newNote, './db/db.json');
    res.json(`Tip added successfully 🚀`);
  } else {
    res.error('Error in adding tip');
  }
});
    //   console.log(response);
    //   const noteString = JSON.stringify(newNote);
    //     fs.readFile(notesdb, 'utf8', (err, data) => {
    //       if (err) {
    //         console.error(err);
    //       } else {
    //         const parsedData = JSON.parse(data);
    //         parsedData.push(noteString);
    //         writeToFile(notesdb, parsedData);
    //       }
    //     });
    
        //utilfs.readAndAppend(noteString, notesdb)
      // Write the string to a file
    //   fs.writeFile(`./db/${newNote.title}.json`, noteString, (err) =>
    //     err
    //       ? console.error(err)
    //       : console.log(
    //           `Note for ${newNote.title} has been written to JSON file`
    //         )
    //   );
  
    //   const response = {
    //     status: 'success',
    //     body: newNote,
    //   };
  
    //   console.log(response);
    //   res.status(201).json(response);
//     } else {
//       res.status(500).json('Error in posting note');
//     }
//   });

  
// app.post('/api/notes', (req, res) => {
//     res.json(`${req.method} request received Notes Gonna Do IT!`)
    
//     let response;
//     if (req.body){
//     //if (req.body && req.body.title && req.body.text) {
//         response = {
//             status: 'success',
//             data: req.body,
//         };
//     res.json(`Note for ${response.data.title} has been added!`)
//     } else {
//         res.json('Note must contain a Title and a message')
//     }
//     console.info('Here is what is up my Dude. We just finished a post.')
//     console.log(req.body);
//     console.log(req.body.title);
//     console.log(req.body.text);
// });

//rediredct for bad url
app.get('*', (req, res) =>
  res.send(
    `Abandon All Hope Ye Who Enter Here! <a href="http://localhost:${PORT}/">http://localhost:${PORT}/</a>`
  )
);
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

// USE TO DELETE?
app.get('/api/notes/:id', (req, res) => {
    if (req.params.id) {
      console.info(`${req.method} request received to get a note`);
      console.log(req);
      const noteId = req.params.id;
      for (let i = 0; i < notesdb.length; i++) {
        const currentNoteDel = notesdb[i];
        if (currentNoteDel.id === noteId) {
            return res.json(notesdb[i])
          //res.json(currentNoteDel);
          //return;
        }
      }
      res.status(404).send('Review not found');
    } else {
      res.status(400).send('Review ID not provided');
    }
  });

const readAndAppend = (content, file) => {
  console.log("server Append", content);
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        utilfs.writeToFile(file, parsedData);
      }
    });
  };