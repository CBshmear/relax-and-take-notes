const express = require("express");
const path = require("path");
const uuid = require("./helpers/uuid");
const app = express();
const PORT = process.env.PORT || 3001;
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
  const noteData = require("./db/db.json");
  res.json(noteData);
});

app.get("/api/notes/id", (req, res) => {
  const noteData = require("./db/db.json");
  req.JSON(noteData);
});
//app.get("/", (req, res) => res.send("Navigate to /send or /routes"));
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.post("/api/notes", (req, res) => {
  console.log("OH HEY!!!!!!");
  const { title, text } = req.body;

  if (title && text) {
    console.log(`In the if with title ${title} and text ${text}`);
    let newNote = {
      title,
      text,
      note_id: uuid(),
    };
    console.log("Past the let");
    try {
      fs.readFile("./db/db.json", "utf8", (err, data) => {
        console.log("In readFile callback");
        if (err) {
          console.error(err);
          res.status(500).json(err);
        } else {
          console.log("No error! Continuing");
          const parsedNotes = JSON.parse(data);

          parsedNotes.push(newNote);

          fs.writeFile(
            "./db/db.json",
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) => {
              console.log("In writeFileSync callback");
              if (writeErr) {
                console.error(writeErr);
                res.status(500).json(writeErr);
              } else {
                console.info("Successfully updated notes!");
                res.json("Success!");
              }
            }
          );
        }
      });
    } catch (e) {
      console.log("THE ERROR?!");
      res.status(500).json(e);
    }
  } else {
    console.log("In the else");
    res.status(400).json({ message: "Missing required parameters" });
  }
});

// app.delete("/api/notes/:id", (req, res) => {
//   const requestedTerm = req.params.noteId;
//   fs.readFile("./db/db.json", "utf8", (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       const parsedNotes = JSON.parse(data);

//       for (let i = 0; i < parsedNotes.length; i++) {
//         if (requestedTerm === parsedNotes[i].noteId) {
//           const newNotes = parsedNotes.splice([i]);
//           fs.writeFile(
//             "./db/db.json",
//             JSON.stringify(newNotes, null, 4),
//             (writeErr) => {
//               writeErr
//                 ? console.error(writeErr)
//                 : console.info("Successfully updated notes!");
//             }
//           );
//         }
//       }
//     }

//     return res.json("No match found");
//   });
// });

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
