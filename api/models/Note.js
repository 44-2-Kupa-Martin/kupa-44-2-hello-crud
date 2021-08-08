const mongoose= require(`mongoose`);
//note model
const NoteSchema= new mongoose.Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    creationDate: {type: Date, default: Date.now},
    updateDate: {type: Date, default: Date.now}
})
//note obj
const Note= mongoose.model(`Note`, NoteSchema);

module.exports= Note;