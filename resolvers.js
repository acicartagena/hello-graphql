const { PubSub } = require('apollo-server');
const pubsub = new PubSub();
const POST_ADDED = 'POST_ADDED';

const resolvers = {
    Query: {
        posts: async (_, args, { dataSources }) => {
            let allPosts = await dataSources.postAPI.allPosts();
            return allPosts
        },
        postsBy: async (parent, args, { dataSources }) => {
            let postByAuthor =  await dataSources.postAPI.postsBy({ author: args.author })
            return postByAuthor
        }
    },

    Mutation: {
        addPost: async (_, userPost, { dataSources }) => {
            let post = await dataSources.postAPI.createPost({ text: userPost.text, author: userPost.author });
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

module.exports = resolvers