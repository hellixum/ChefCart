'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ }) {
      // define association here
    }
  };
  Lead.init({
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
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(45), 
      allowNull: false
    }, 
    address: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    ref_email: {
      type: DataTypes.STRING(45), 
      allowNull: false, 
      references: {
        model: 'refrees', 
        key: 'email'
      }
    },
    reward: {
      type: DataTypes.INTEGER, 
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(10), 
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'leads',
  });
  return Lead;
};