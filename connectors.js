import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';

const db = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite',
});

const PostModel = db.define('post', {
  author: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING },
});

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return Post.create({
      text: casual.sentences(3),
      author: casual.first_name,
    })
  });
});

const Post = db.models.post;

export { Post };