const express = require('express')
const router = express.Router()
const db = require("../../app/models")
const path = require('path');
const { exec } = require('child_process');
var name = null

function ComprehendCommand(req){
    var SqlCommand;
    while(req !== SqlCommand){
        SqlCommand = req
        req = SqlCommand.replace("SPACE"," ")
    }
    return req;
}

router.get('/download/:download', (req,res) =>{
    res.status(200).download(path.join(__dirname,"../../downloads",`${name}.csv`))
})

router.get('/:command', (req,res) =>{
    var real_command = ComprehendCommand(req.params.command)
    db.sequelize
        .query(`SELECT COUNT(*) FROM morphtest WHERE ${real_command} `)
        .then(response => {
            var d = new Date();
            var n = d.getTime()
            name = "query" + n
            let header_file = `/home/wenli/Express-blackbase/downloads/header_${name}.csv`
            let content_file = `/home/wenli/Express-blackbase/downloads/content_${name}.csv`
            let merged_file = `/home/wenli/Express-blackbase/downloads/${name}.csv`
            
            db.sequelize
                .query(`SELECT GROUP_CONCAT(CONCAT("'", COLUMN_NAME,"'")) from INFORMATION_SCHEMA.COLUMNS
                         WHERE TABLE_NAME ='morphology' INTO OUTFILE '${header_file}' `)
                .catch(error => console.log(error))
            db.sequelize
                .query(` SELECT * INTO OUTFILE '${content_file}' FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n' FROM morphtest;`)
            
            exec(`cat ${header_file} ${content_file} > ${merged_file}`)
           
            if(response[0][0]["COUNT(*)"] < 500){
                db.sequelize
                    .query(`SELECT * FROM morphtest WHERE ${real_command} `)
                    .then(response => res.status(200).send(response))
                    .catch(error => res.status(400).send(error))
            }else{
                db.sequelize
                    .query(`SELECT * FROM morphtest WHERE ${real_command} LIMIT 500`)
                    .then(response => res.status(200).send(response))
                    .catch(error => res.status(400).send(error))
            }
           

        })
        .catch(error => res.status(400).json(error))
})








module.exports = router;

