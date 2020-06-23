const { ApolloServer, gql, PubSub } = require('apollo-server');

const { createStore } = require('./utils');
const PostAPI = require('./datasources/posts');
const store = createStore();

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
        postsBy(author: String!): [Post]
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
        posts: async (_, args, { dataSources}) => {
            return dataSources.postAPI.allPosts();
        },
        postsBy: async (parent, args, { dataSources }, info) => {
            return dataSources.postAPI.postsBy({ author: args.author })
        }
    },

    Mutation: {
        addPost: async (_, userPost, { dataSources }) => {
            const post = await dataSources.postAPI.createPost({ text: userPost.text, author: userPost.author });
            pubsub.publish(POST_ADDED, { postAdded: post });
            return post
          },
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
    dataSources: () => ({
        postAPI: new PostAPI({ store })
      }),
    context: async ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          return connection.context;
        } else {
          // check from req
          const token = req.headers.authorization || "";
          return { authorized: true };
        }
    },
});


server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  });