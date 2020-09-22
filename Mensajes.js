const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory");
class Mensaje extends Model {}
Mensaje.init(
  {
    message: DataTypes.STRING,
    author: DataTypes.STRING,
    ts: DataTypes.INTEGER,
  },
  { sequelize, modelName: "messages" }
);
Mensaje.sync();
module.exports = Mensaje;
