const express = require("express");
const path = require("path");
const uuid = require("./helpers/uuid");
const app = express();
const PORT = process.env.PORT || 3001;
const fs = require("fs");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Navigate to /send or /routes"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  const noteData = require("./db/db.json");
  res.json(noteData);
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    newNote = {
      title,
      text,
      noteId: uuid(),
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) => {
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated reviews!");

            res.header("Refresh", 1);
            res.json("Hi");
          }
        );
      }
    });
  }
});
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
