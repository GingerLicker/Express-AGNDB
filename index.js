const express = require('express')
const path = require('path')
const logger = require('./middleware/logger')
var compression = require("compression")
var helmet = require("helmet")



const app = express();
// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// SHow request to console
app.use(logger);

// Add compression, compress all routes
app.use(compression())

// Add helmet for basic protect of the website
app.use(helmet())

// set static folder
app.use('/api/db_router', require('./routes/api/db_router'))

// get database
const db = require("./app/models/")
db.sequelize.sync();


const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
