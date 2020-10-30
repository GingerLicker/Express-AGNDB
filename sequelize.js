const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('blackbase','root','',{
    host: 'localhost',
    dialect:'mariadb'
})

sequelize
   .query("SHOW TABLES")
   .then(rows => console.log(rows))
   .catch(err => console.log(err))