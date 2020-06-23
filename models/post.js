'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    text: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: { 
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
  };
  return Post;
};