const Note = require('../../models/note');
const User = require('../../models/user');
const { transformNote } = require('./merge');

module.exports = {

    // All Root Queries for Notes
    
    userNotes: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const notes = await Note.find({ creator: { $in: args.userId } });
            return notes.map(note => {
                return transformNote(note);
            });
        }
        catch (err) {
            throw err;
        }
    },

    // All Root Mutations for Notes

    createNote: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const note = new Note({
            title: args.noteInput.title,
            creator: args.noteInput.creator,
            creationDate: args.noteInput.creationDate,
            content: args.noteInput.content
        });
        let createdNote;
        try {
            const creator = await User.findById(note.creator);  
            if (!creator) {
                throw new Error('User not found.');
            }
            else {
                const result = await note.save();
                createdNote = transformNote(result);
            }
            return createdNote;
        }
        catch (err) {
            throw err;
        }
    }
};