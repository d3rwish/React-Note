import React from 'react';

import NoteItem from './NoteItem/NoteItem';
import './NoteList.css';

const noteList = props => {
    const notes = props.notes.map(note => {
        return (
            <NoteItem 
                key={note._id}
                noteId={note._id}
                title={note.title}
                content={note.content}
                creationDate={note.creationDate}
                onDetail={props.onViewDetail}
            />
        );
    });
    return <ul className="note__list">{notes}</ul>;
};

export default noteList;