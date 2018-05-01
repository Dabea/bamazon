var mysql = require('mysql');
require('dotenv').config();
var inquirer = require('inquirer');

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
   
    connection.query('SELECT * from products', function (error, results, fields) {
      if (error) throw error;
        for(let i =0; i < results.length; i ++){
            if(results[i].stock_quantity > 0){
                console.log(`id:${results[i].item_id} Item ${results[i].product_name} Price: ${results[i].price}`);
                
            }
           
        }
        inquirer.prompt([
            {
                type: 'input',
                name: "id",
                message: "What Item do you want to by (input id)"
            }
        ]).then(answers => {
           purchase('123');
        });
    });
   connection.end();
  
}

function purchase(item){
    console.log(item,'Has been bought')
}

ProductList()