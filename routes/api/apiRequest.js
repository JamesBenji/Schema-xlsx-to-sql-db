const route = require('express').Router();
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const path = require('path');
const getXLSXData = require('./lib/getXLSXData');
const mysql = require('mysql2/promise');
// const connectToDB = require("../../database")


async function connectToDB(){
  try {
      return mysql.createPool({
          host: "127.0.0.1",
          user: "root",
          password: "",
          database: "test"
      });
  } catch (error) {
      console.error("Error executing the query:", error);
  }
}



route.use(bodyParser.json());

route.use('/getFileList', require('./lib/getFileList'));

route.post('/create_table/:fileName/:tableName', async (req, res) => {
  const file = req.params.fileName;
  const tableName = req.params.tableName;
  let file_path = ''
  try {
    file_path = path.resolve(__dirname, `../../files/unprocessed/${file}`);
  } catch (error) {
    console.log("the problem is here");
  }
  // expose all necessary data from one file to all
  const result = getXLSXData(file_path);

  console.log(tableName)
  
  // prepare create table
  let columnSQL = ``;
  for (let i = 0; i < result['object_keys'].length; i++) {
    if (i === 0) {
      columnSQL += `${result['object_keys'][i]} varchar(255) PRIMARY KEY,`;
    } else if (i === result['object_keys'].length - 1) {
      columnSQL += `${result['object_keys'][i]} varchar(255)`;
    } else {
      columnSQL += `${result['object_keys'][i]} varchar(255),`;
    }
  }
  
  const pool = await connectToDB();
  const SQLstmt1 = `CREATE TABLE IF NOT EXISTS ${tableName}( ${columnSQL} )`;
  const ResultSetHeader1 = await pool.query(SQLstmt1);
  
  if (ResultSetHeader1) { 
    let insertValues = ``;
    for (let i = 0; i < result['dataRow'].length; i++){
      insertValues +=`(`;
      for (const key in result['dataRow'][i]){
        
        const value = result['dataRow'][i][key];
        insertValues += `'${value}',`;
      }

      // Replace the last comma with a closing parenthesis )
      if (insertValues.endsWith(",")) {
        insertValues = insertValues.replace(/,$/, "),");
      }
      
    }

    if (insertValues.endsWith(",")) {
      insertValues = insertValues.slice(0, -1);
    }

    console.log(insertValues);
    let SQLstmt2 = `INSERT INTO ${tableName} VALUES ${insertValues}`;
    console.log(SQLstmt2);
    try {
      let ResultSetHeader2 = await pool.query(SQLstmt2);
      res.json(`Successful insert\n ${ResultSetHeader2[0].affectedRows} entries made`)
      fs.rename(file_path, path.resolve(__dirname, `../../files/processed/${file}`), ()=>{
        if (err) {
          console.error(err);
        } else {
          console.log(`Successfully moved ${file}`);
        }
      })
      console.log(ResultSetHeader2);
    } catch (error) {
      res.json(`Error inserting data \n\n SQL says ${error.sqlMessage}`);
      console.log("\n\n\n\n\n\n\n", error.errno);
    }
}
});

route.post('/uploadXLSX', fileupload({ createParentPath: true }), 

(req, res) => {
  const files = req.files;
    console.log(files)
    console.log("SERVER LOG END")

    let successful_uploads =[]
    if(files){
      Object.keys(files).forEach(key => {
        const filePath = path.resolve(__dirname, `../../files/unprocessed/${files[key].name}`);
  
          files[key].mv(filePath, err => {
            if (err) return res.status(500).json({ status: err.status })
        });

        // console.log(getXLSXData(filePath))
        // successful_uploads.push(getXLSXData(filePath));
        successful_uploads.push({
          file_name: files[key].name,
          data: getXLSXData(filePath)
        });
      })
  
      res.json({successful_uploads: successful_uploads});
    } else {
      res.status(400).send('No files were uploaded')
    }
  
});

route.get("/showSavedData/:tableName", async (req, res) => {
  const tableName = req.params.tableName;
  const pool = connectToDB();

  const [ rows, fields ] = await pool.query(`SELECT * FROM ${tableName}`)

  if(rows){
    res.json(rows);
  } else {
    res.json(rows);
  }
});





module.exports = route;