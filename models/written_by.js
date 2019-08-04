'use strict';
module.exports = (sequelize, DataTypes) => {
  const written_by = sequelize.define('written_by', {
  }, {});
  written_by.associate = function(models) {
    // associations can be defined here
  };
  return written_by;
};