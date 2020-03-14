//Require Dependencies ================================
var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var divider = '\n================================================================================================\n'

//Create connection to sql database
var connection = mysql.createConnection({
    host: 'localhost',

    //import port number
    port: 3306,

    //Username and password to sql database
    user: "dannielle2",
    password: "12345",
    database: "bamazondb"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log(divider);
    managerOptions();
})

//function to prompt manager for initial action
function managerOptions() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
    })
    .then(function(answer) {
        switch (answer.action) {
            case 'View Products for Sale': //displays all items in the bamazondb
                saleInventory();
                break;
            
            case 'View Low Inventory': //displays all items with remainingStock <= 0
                lowInventory();
                break;
            
            case 'Add to Inventory': //calls function to add to existing inventory to database
                addInventory();
                break;

            case 'Add New Product': //calls function to add a new item to the store
                newProduct();
                break;
            
            case 'Exit'://Calls connection.ed to exist the sore
                console.log("Exiting Manager View. Goodbye!")
                connection.end();
                break;
        }
    });
}

function saleInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        //Display entire products table
        console.log(divider);
        console.table(res);
        console.log("Now Viewing All Products for Sale.")
        console.log(divider);
        inventoryOptions();
        
    })
}

//Displays after the manager views all sale inventory to provide additional actions
function inventoryOptions() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['Add to Inventory', 'Add New Product', 'Exit']
    })
    .then(function(answer) {
        switch (answer.action) {
            case 'Add to Inventory': //calls function to add to existing inventory to database
                addInventory();
                break;

            case 'Add New Product': //calls function to add a new item to the store
                newProduct();
                break;
            
            case 'Exit'://Calls connection.ed to exist the sore
                console.log("Exiting Manager View. Goodbye!")
                connection.end();
                break;
        }
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <=0", function(err, res) {
        if (err) throw err;

        //Display products table with low inventory
        console.table(res);
        console.log("Now viewing low inventory.")
        console.log(divider);
        inventoryOptions();
    })
}

function addInventory() {
    
}