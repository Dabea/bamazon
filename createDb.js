var mysql = require('mysql');
require('dotenv').config();

console.log(process.env.PASSWORD)

var connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : 'root',
    password : process.env.PASSWORD,
    database : process.env.DATABASE
  }
);


const ProductList = function(){
    
    connection.connect();
   
     const resultes = connection.query('SELECT * from products', function (error, results, fields) {
      if (error) throw error;
     return results;
    });
     
    connection.end();

    return resultes
}
 
   module.exports = ProductList;