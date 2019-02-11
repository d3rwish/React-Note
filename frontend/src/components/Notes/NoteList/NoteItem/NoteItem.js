import React from 'react';

import './NoteItem.css';

const noteItem = props => (
    <li key={props.noteId} className="note__list-item">
        <div>
            <h1>{props.title}</h1>
            <div className="note__list-item-content">
                {props.content}
            </div>
            <h2>{props.creationDate}</h2>
            {/* 
                new Date(props.creationDate).toLocaleDateString()
                Pierw trzeba zmienić od strony serwera 
            */}
            <div className="note__list-item-control">
                <button className="btn btn-more" onClick={props.onDetail.bind(this, props.noteId)}>
                    Details
                </button>
            </div>
        </div>
    </li>
);

export default noteItem;