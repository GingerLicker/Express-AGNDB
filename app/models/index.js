const dbConfig = require ("../config/db.config")
const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.DB,dbConfig.User,dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize
// db.tutorials = require("./tutorial.model.js")(sequelize,Sequelize)

module.exports = db;