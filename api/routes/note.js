const express= require(`express`);
const router= express.Router();
const Note= require(`../models/Note`);
const PORT= require(`../../index`);
//routes

//req all notes
router.get(`/notes`, (req, res, next) => {
    Note.find({}, `title text`).sort(`-updateDate`).exec((err, notes) => {
        if (err) return next(err);
        for (note of notes) {
            note.details= {
                method: `GET`,
                url: `${req.protocol}://${req.hostname}:${PORT}/api/notes/${note._id}`
            }
            delete note._id;
        }
        res.status(200).json({
            count: notes.length,
            notes: notes,
            create: {
                method: `POST`,
                url: `${req.protocol}://${req.hostname}:${PORT}/api/notes`
            }
        });
    });
});
//create a note
router.post(`/notes`, (req, res, next) => {
    const note= new Note({
        title: req.body.title,
        text: req.body.text
    });
    note.save((err, note) => {
        if (err) return next(err);
        res.status(201).json(note);
    });
});
//req a specific note
router.get('/notes/:id', (req, res, next) => {
    Note.findById(req.params.id)
      .select('title text creationDate updateDate')
      .exec((err, note) => {
        if (err) return next(err);
        if (!note) return res.status(404).json({msg: `Not found`});
        res.status(200).json({
          note: note,
          links: {
            update: {
              method: 'PUT',
              url: `${req.protocol}://${req.hostname}:${PORT}/api/notes/${note._id}`
            },
            delete: {
              method: 'DELETE',
              url: `${req.protocol}://${req.hostname}:${PORT}/api/notes/${note._id}`
            }
          }
        });
      });
});
//update a note
router.put('/notes/:id', (req, res, next) => {
    const note = {
      title: req.body.title,
      text: req.body.text,
      updateDate: Date.now()
    };
    const options = {
      new: true,
      omitUndefined: true
    };
    Note.findByIdAndUpdate(req.params.id, note, options).exec((err, note) => {
      if (err) return next(err);
      if (!note) return res.status(404).json({msg: `Not found`});
      delete note.__v;
      res.status(200).json(note);
    });
  });
//delete a note
router.delete(`/notes/:id`, (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
      .exec((err, note) => {
        if (err) return next(err);
        if (!note) return res.status(404).json({ msg: 'Not found' });
        res.status(200).json({ msg: 'Delete OK' });
    });
});

module.exports= router;