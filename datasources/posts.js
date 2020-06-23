const { DataSource } = require('apollo-datasource');

class PostAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async createPost({ text: textArg, author: authorArg } = {}) {
    const posts = await this.store.posts.create({ text: textArg, author: authorArg });
    return posts && posts[0] ? posts[0] : null;
  }

  async allPosts() {
    const posts = await this.store.posts.findAll();
    return posts
  }
}

module.exports = PostAPI;
