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
        posts: async (_, args, { dataSources}) => {
            return dataSources.postAPI.allPosts();
        },
        post(parent, args, context, info) {
            return posts.find(post => post.author === args.author)
        }
    },

    Mutation: {

        addPost: async (_, userPost, { dataSources }) => {
            const post = await dataSources.postAPI.createPost({ text: userPost.text, author: userPost.author });
            // if (post) return new Buffer(email).toString('base64');
            return post
          },

        // addPost(root, args, context) {
        //     pubsub.publish(POST_ADDED, { postAdded: args });
        //     return { args }
        // }
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
      })
});


server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  });