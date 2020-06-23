const { gql } = require('apollo-server')

const typeDefs = gql`
    type Post { 
        text: String,
        author: String
    }

    type Query {
        posts: [Post]
        postsBy(author: String!): [Post]
    }

    type Mutation {
        addPost(text: String!, author: String!): Post
    }

    type Subscription {
        postAdded: Post
    }
`;

module.exports = typeDefs