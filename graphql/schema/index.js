const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Note {
    _id: ID!
    title: String!
    creator: User!
    creationDate: String!
    content : String!
}

type User {
    _id: ID!
    email: String!
    password: String
    signUpDate: String!
}

input NoteInput {
    title: String!
    creator: String!
    creationDate: String!
    content: String!
}

input UserInput {
    email: String!
    password: String!
}

type RootQueries {
    userNotes(userId: ID!): [Note!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createNote(noteInput: NoteInput): Note
    createUser(userInput: UserInput): User

}

type AuthData {
    userId: ID!
    userToken: String!
    userTokenExp: Int!
}

schema {
    query: RootQueries
    mutation: RootMutation
}
`)