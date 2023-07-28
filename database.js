const mysql = require("mysql2/promise");
// const dovenv = require("dovenv");
// // const getXLSXData = require("./routes/api/lib/getXLSXData");
// dovenv.config();

async function connectToDB(){
    try {
        const pool = mysql.createPool({
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: "test"
        });

        return pool;
    } catch (error) {
        console.error("Error executing the query:", error);
    }
}
module.exports = connectToDB;

// async function createTable(tableName, columns, filePath){
    
//     console.log(columns);
//     // const pool = connectToDB();
//     // const [rows, fields] = await pool.query(`CREATE TABLE IF NOT EXISTS ${tableName}(

//     //     )`)
    
// }
// async function insertIntoTableValues(){
    
// }
