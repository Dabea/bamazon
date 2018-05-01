var mysql    = require('mysql');
var inquirer = require('inquirer');
require('dotenv').config();


var connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : 'root',
    password : process.env.PASSWORD,
    database : process.env.DATABASE
  }
);

function mainMenu(){
    inquirer.prompt([
        {
            type: 'list',
            name: "option",
            message: "List a set of menu options",
            choices: [ 'View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product' ]
        }
    ]).then(answers => {
     switch(answers.option){
         case 'View Products for Sale':
            displayAllProducts();
            break;
        case 'View Low Inventory':
            displayLowProducts();
            break;   
        case 'Add to Inventory':
            orderInfo();
            break;
        case 'Add New Product':
            orderInfo();
            break;       

        default:
            console.log('Try another option'); 
            mainMenu();   
     }
    });
}

/**
 *  Displays a list of all the products
 * 
 * 
 */
function displayAllProducts(){
    connection.connect();
    connection.query('SELECT * from products', function (error, results, fields) {
      if (error) throw error;
        for(let i =0; i < results.length; i ++){
            console.log(`id:${results[i].item_id} Item ${results[i].product_name} Price: ${results[i].price}`);                                  
        }
    });
    connection.end();
}

/**
 * Displays products that have a quanity of 5 or less
 * 
 */
function displayLowProducts(){
    connection.connect();
    connection.query('SELECT * from products', function (error, results, fields) {
      if (error) throw error;
        for(let i =0; i < results.length; i ++){
            if(results[i].stock_quantity > 5){
                console.log(`id:${results[i].item_id} Item ${results[i].product_name} Price: ${results[i].price}`);
        }                                   
        }
    });
    connection.end();
}

/**
 * Updates the stock by id in the database
 * 
 * @param {*} id 
 * @param {*} newOrder 
 */
function updateStock(id , newOrder) {
    connection.query("UPDATE products SET  stock_quantity=stock_quantity +" + newOrder + " WHERE item_id=" + id, function(err, results, fields ){
        if(err) throw err;
        console.log('the stock has been updated')
    })
    connection.end();
}

/**
 * Updates the stock by id in the database
 * 
 * @param {*} id 
 * @param {*} newOrder 
 */
function addNewItem(item_id, product_name, department_name, price, stock_quantity) {
    const sql = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES ( "
    connection.query("INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES ( " + item_id + ", " + product_name + ", " + department_name + ", " + price + ", " + stock_quantity + " )", function(err, results, fields ){
        if(err) throw err;
        console.log(`${product_name} has been added to the database`)
    })
    connection.end();
}

/**
 *  Gathers the infomation from the new order to add to the database
 * 
 */
function orderInfo(){
    inquirer.prompt([
        {
            type: 'input',
            name: "id",
            message: "How manny new units do you have to add"
        },
        {
            type: 'input',
            name: "quanity",
            message: "How manny new units do you have to add"
        }
    ]).then(answers => {
      updateStock(answers.id, answers.quanity)
    });
}

mainMenu();

//addNewItem( '11','HP  Laptop', 'tech', '499.99', '14');