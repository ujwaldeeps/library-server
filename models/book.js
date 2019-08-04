'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    name: DataTypes.STRING,
    isbn: DataTypes.STRING,
    country: DataTypes.STRING,
    number_of_pages: DataTypes.NUMBER,
    publisher: DataTypes.STRING,
    release_date: DataTypes.DATE
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
      Book.belongsToMany(models.Author, {through: 'written_by',
          foreignKey: 'bookId', otherKey: 'authorId'});

  };
  return Book;
};