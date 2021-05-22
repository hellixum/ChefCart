'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Refree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ }) {
      // define association here
    }
  };
  Refree.init({
    uuid : {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4
    },
    first_name: {
      type: DataTypes.STRING(45), 
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(45), 
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45), 
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(45), 
      allowNull: false
    }, 
    password: {
      type: DataTypes.STRING(300), 
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'refrees',
  });
  return Refree;
};