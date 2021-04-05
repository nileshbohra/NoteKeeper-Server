const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = process.env.PORT || 3001;
const cors = require('cors');
const Schema = mongoose.Schema;
const Note = require('./models/Note');

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const DB = {
    url: process.env.DB_URL
}

mongoose.connect(DB.url, { useNewUrlParser: true, useUnifiedTopology: true }).then((res) => console.log("DB connected"));

app.route('/create')
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const note = new Note({
            title: title,
            content: content
        });

        note.save(err => {
            if (err) {
                console.log(err);
            } else {
                res.send("Saved to Database")
            }
        });
    });

app.route('/read').get((req, res) => {
    Note.find({}, (err, note) => {
        if (err) {
            res.send(err);
        }
        res.send(note);
    })
});

app.route('/delete/:id').delete((req, res) => {
    const id = req.params.id;
    Note.findByIdAndDelete(id, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

app.listen(port, () => {
    console.log(`server started at port ${port}`);
})