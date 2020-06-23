const { ApolloServer, gql, PubSub } = require('apollo-server');
const models = require('../models');
const pubsub = new PubSub();

const POST_ADDED = 'POST_ADDED';

const posts = require('./data');


const typeDefs = gql`
    type Post { 
        text: String,
        author: String
    }

    type Query {
        posts: [Post]
        post(author: String!): Post
    }

    type Mutation {
        addPost(text: String!, author: String!): Post
    }

    type Subscription {
        postAdded: Post
    }
`;

const resolvers = {
    Query: {
        posts: () => posts,
        post(parent, args, context, info) {
            return posts.find(post => post.author === args.author)
        }
    },

    Mutation: {
        addPost(root, args, context) {
            pubsub.publish(POST_ADDED, { postAdded: args });
            return { args }
        }
    },

    Subscription: {
        postAdded: {
            subscribe: () => pubsub.asyncIterator([POST_ADDED]),
        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          return connection.context;
        } else {
          // check from req
          const token = req.headers.authorization || "";
    
          return { token };
        }
      },
});


server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  });