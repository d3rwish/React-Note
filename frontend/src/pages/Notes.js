import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import NoteList from '../components/Notes/NoteList/NoteList';
import Spinner from '../components/Spinner/Spinner';

import './Notes.css';

class NotesPage extends Component {
    state = {
        noteCreating: false,
        notes: [],
        isLoading: false,
        selectedNote: null
    };
    
    isActive = true;

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElement = React.createRef();
        this.contentElement = React.createRef();
    }

    componentDidMount() {
        this.fetchNotes();
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    startNoteCreatingHandler = () => {
        this.setState({noteCreating: true});
    }

    confirmModalHandler = () => {
        const title = this.titleElement.current.value;
        const content = this.contentElement.current.value.replace(/(\r\n|\n|\r)/gm, "\\n");
        const creationDate = new Date().toLocaleString();
        const creator = this.context.userId;

        if (title.trim().length === 0 || (content.trim().length === 0)) {
            console.log("Podaj zawartość!");
            return;
        }      

        const note = {title, content, creationDate, creator};

        const requestBody = {
            query:`
                mutation {
                    createNote(noteInput: {title: "${note.title}", content: "${note.content}", creationDate: "${note.creationDate}", creator: "${note.creator}"}) {
                        _id
                        title
                        content
                        creationDate
                    }
                }
            `
        };

        const token = this.context.userToken;      

        fetch('http://localhost:8140/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            this.setState(prevState => {
                const updatedNotes = [...prevState.notes];
                updatedNotes.push({
                    _id: resData.data.createNote._id,
                    title: resData.data.createNote.title,
                    content: resData.data.createNote.content,
                    creationDate: resData.data.createNote.creationDate,
                    creator: {
                        _id: this.context.userId,
                    }
                });
                return {notes: updatedNotes};
            });
        })
        .catch(err => {
            console.log(err);
        });

        this.setState({noteCreating: false});
    }

    deleteModalHandler = () => {
        console.log("Delete!!!");
        
    }

    cancelModalHandler = () => {
        this.setState({noteCreating: false, selectedNote: null});
    }

    showDetailHandler = noteId => {
        this.setState(prevState => {
            const selectedNote = prevState.notes.find(e => e._id === noteId);
            return {selectedNote: selectedNote}
        })
    }

    fetchNotes() {
        const userId = this.context.userId;
        this.setState({ isLoading: true });

        const requestBody = {
            query:`
                query {
                    userNotes(userId: "${userId}") {
                        _id
                        title
                        content
                        creationDate
                    }
                }
            `
        };

        const token = this.context.userToken;

        fetch('http://localhost:8140/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const notes = resData.data.userNotes;
            if (this.isActive) {
                this.setState({ notes: notes });
                this.setState({ isLoading: false });
            }
        })
        .catch(err => {
            console.log(err);
            if (this.isActive) {
                this.setState({ isLoading: false });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                {(this.state.noteCreating || this.state.selectedNote) && <Backdrop />}
                {this.state.noteCreating && 
                    <Modal 
                        title="Add New Note" 
                        confirmText="Create" 
                        onConfirm={this.confirmModalHandler}
                        onCancel={this.cancelModalHandler}>
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Note Title</label>
                                <input type="text" id="title" ref={this.titleElement}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="content">Note Content</label>
                                <textarea id="content" rows="5" ref={this.contentElement}/>
                            </div>
                        </form> 
                    </Modal>
                }
                {this.state.selectedNote && 
                    <Modal   
                        title={this.state.selectedNote.title}
                        confirmText="Delete" 
                        onConfirm={this.deleteModalHandler}
                        onCancel={this.cancelModalHandler}>
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Note Title</label>
                                <input type="text" id="title" readOnly value={this.state.selectedNote.title}/>
                            </div>
                            <div className="form-control">
                                <label htmlFor="content">Note Content</label>
                                <textarea id="content" rows="5" readOnly value={this.state.selectedNote.content}/>
                            </div>
                        </form> 
                    </Modal>
                }
                {!this.state.isLoading && <div className="notes-control">
                    <button className="btn" onClick={this.startNoteCreatingHandler}>Create New Note</button>
                </div>}
                {this.state.isLoading ? (
                    <Spinner /> ) : (
                    <NoteList 
                        notes={this.state.notes}
                        onViewDetail={this.showDetailHandler}
                    />)
                }
            </React.Fragment>
        );
    }
}

export default NotesPage;