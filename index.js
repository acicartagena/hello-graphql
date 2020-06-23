const { ApolloServer } = require('apollo-server');

const { createStore } = require('./utils');
const PostAPI = require('./datasources/posts');
const store = createStore();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        postAPI: new PostAPI({ store })
      }),
    context: async () => {
        return { authorized: true };
    },
});


server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  });