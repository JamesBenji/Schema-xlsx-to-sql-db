const route = require('express').Router();
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const path = require('path');
const getXLSXData = require('./lib/getXLSXData');
const mysql = require('mysql2/promise');
const fs = require('fs');
const fsPromises = require('fs').promises;
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
  let file_path = '';
  let errorLog = {error: [], };

  try {

    file_path = path.resolve(__dirname, `../../files/unprocessed/${file}`);

  } catch (error) {

    console.log("the problem is here");

  }

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
  let ResultSetHeader1;
  let file_table_name_res;

  const SQLstmt1 = `CREATE TABLE IF NOT EXISTS ${tableName}( ${columnSQL} )`;
  
  try {

    ResultSetHeader1 = await pool.query(SQLstmt1);
    // console.log('table created successfully ', SQLstmt1)
    // console.log('ResultSetHeader1');
    // console.log(ResultSetHeader);

    } catch (error) {

      errorLog.error.push({ error: "Table creation failed", code: error.code, solve: "Check if your XAMPP SQL server & Apache server are running. If not, turn them on and reupload the file." });
      console.log(error.code);
    
    }
    try {

      await pool.query(`CREATE TABLE IF NOT EXISTS file_table_map ( FILE_NAME varchar(255) , TABLE_NAME varchar(255) unique, primary key(FILE_NAME))`);

    } catch (error) {

      console.log({ error: "Table Map create failed", code: error.code });
      console.log(error.code);
    
    }

    try {

    await pool.query(`INSERT INTO file_table_map VALUES ( '${file}' , '${tableName}' ) `);

    } catch (error) {

      console.log({ error: "File Table Map failed", code: error.code });
      // res.json(errorLog);
    }

  
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
      fs.rename(file_path, path.resolve(__dirname, `../../files/processed/${file}`), (error)=>{

        if (error) {

          errorLog.error.push({ error: "Error moving file", code: error.code });
          console.error(err);

        } else {
          console.log(`Successfully moved ${file}`);

        }

      })
      res.json({ message: `Successful insert\n ${ResultSetHeader2[0].affectedRows} entries made` });
      console.log(ResultSetHeader2);

    } catch (error) {

      errorLog.error.push({error: `Error SQL says ${error?.sqlMessage} \n ${error}`});
      res.json(errorLog);

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
  
      res.json({success: successful_uploads});
    } else {
      res.json({ error: 'No files were uploaded' });
    }
  
});

route.get("/getTableData/:fileName", async (req, res) => {
  const fileName = req.params.fileName;
  console.log(fileName);
  const pool = await connectToDB();

  const [rows, fields] = await pool.query(`SELECT TABLE_NAME FROM file_table_map WHERE FILE_NAME = '${fileName}'`);
  let [ tname ] = rows
  console.log(tname.TABLE_NAME)
  if(tname.TABLE_NAME !== null || tname.TABLE_NAME !== undefined) {
    let table_mapping = tname.TABLE_NAME;
    const [data_rows] = await pool.query(`SELECT * FROM ${table_mapping}`)
  if(data_rows.length > 0) {
    res.json({data: data_rows});
  } else {
    res.json({data: "No data found"});
  }
  } else {

  }
  
});

route.get("/export/:filename", async function (req, res) {
  const filename = req.params.filename;

  function replaceBackslashes(filePath) {
    return filePath.replace(/\\/g, '/');
  }

  function createPathToCSV(filename) {
    return replaceBackslashes(path.join(__dirname, '..', '..', 'files', 'csv_file', `${filename.split('.')[0]}.csv`));
  }

  const fpath = createPathToCSV(filename);
  console.log(fpath);
  const pool = await connectToDB();
  let rows, fields;
  try {
    [rows, fields] = await pool.query(`SELECT TABLE_NAME FROM file_table_map WHERE FILE_NAME = '${filename}'`); 
  } catch (error) {
    return res.send("Query failed. Check if your xampp Apache and MySQL servers are running")
  }
  let [tname] = rows;
  console.log(tname.TABLE_NAME);
  let table_mapping

  if (tname.TABLE_NAME) { 
    table_mapping = tname.TABLE_NAME;

    try {
      await fsPromises.unlink(fpath);
    } catch (err) {
      // Ignore error if the file doesn't exist
    }

      const exportQuery = `
        SELECT *
        INTO OUTFILE '${fpath}'
        FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
        LINES TERMINATED BY '\n'
        FROM ${table_mapping};
      `;

      try {
        await pool.query(exportQuery);
      } catch (err) {
        console.error('Error exporting data:', err);
        return res.send('Error exporting data');
      }
    

    const relativeFileName = `${filename.split('.')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.download(fpath)
  }
});


module.exports = route;