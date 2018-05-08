var mysql = require('mysql');
require('dotenv').config();
var inquirer = require('inquirer');

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
        inquirePurcaceById(results);
    });
}


function inquirePurcaceById(results){
    inquirer.prompt([
        {
            type: 'input',
            name: "id",
            message: "What Item do you want to by (input id)"
        }
    ]).then(answers => {
        checkIfItemIdExists(results, answers.id)
    });
}

function checkIfItemIdExists(list , id){
    const item = list.filter(item => item.item_id == id);
    if((!Array.isArray(item) || !item.length)){
     console.log('Invalid Id Please Try aagain')   
     inquirePurcaceById(list);
    }
    else{
     buyQuanity(item[0]);
    }
}

function buyQuanity(results){
    inquirer.prompt([
        {
            type: 'input',
            name: "quanity",
            message: "How manny do you want to buy"
        }
    ]).then(answers => {
      tryToPurchase(results, answers.quanity);
    });
}

function tryToPurchase(item, quanity){
    
    if(item.stock_quantity > quanity){
        console.log(`You have bought ${quanity} ${item.product_name} Your Total Purchase Today Was:$${((quanity * item.price) * 1.075).toFixed(2)}`)
        const newQuanity = item.stock_quantity -quanity;
        updateStock(item.item_id, newQuanity)
    }
    else{
        console.log('there is not enough stock to process the order')
        connection.end();
    }
}

function updateStock(id , newQuanity){
    connection.query("UPDATE products SET  stock_quantity=" + newQuanity + " WHERE item_id=" + id, function(err, results, fields ){
        if(err) throw err;
        
    })
    connection.end();
}

 ProductList();

