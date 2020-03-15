//Require Dependencies ================================
var mysql = require('mysql');
var inquirer = require('inquirer');
var main = require('./mainMenu')
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
    //console.log(divider);
    //managerOptions();
})

//function to prompt manager for initial action
function managerOptions() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Return To Main Menu']
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
            
            case 'Return to Main Menu'://Returns the user to the main menu
                console.log("Exiting Manager View...")
                main.readMainMenu();
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
        choices: ['Add to Inventory', 'Add New Product', 'Main Menu']
    })
    .then(function(answer) {
        switch (answer.action) {
            case 'Add to Inventory': //calls function to add to existing inventory to database
                addInventoryPrompt();
                break;

            case 'Add New Product': //calls function to add a new item to the store
                newProduct();
                break;
            
            case 'Main Menu'://Calls connection.ed to exist the sore
                console.log("Returning to Main Menu!")
                managerOptions();
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

function addInventoryPrompt() {
    inquirer.prompt({
        name: 'inventory_item',
        type: 'input',
        message: 'Enter the ID of the Product You Would Like To Add: ',
        validate: function (value) {
            if (value > 0) {
                return true;
            }else{
                return "Please select a valid Item Id";
            }
        }
    })//queries database for the entered item Id and displays the product name
    .then(function(answer) {
        connection.query("SELECT item_id, product_name, department_name, price FROM products WHERE?", {
            item_id: answer.inventory_item
        }, function (err, res) {
            if (err) throw err;
            console.log("You've selected... || Product Name: " + res[0].product_name + "\n");

            inquirer.prompt({
                name: 'product_options',
                type: 'input',
                message: 'How Many Would You Like To Add: ',
                
            }).then(function (answer2) {
                connection.query("SELECT * FROM products WHERE ?", [
                    {
                        item_id: answer.inventory_item
                    }
                ], function(err, data) {
                    if (err) throw err;

                    var updatedStock = parseInt(data[0].stock_quantity) + parseInt(answer2.product_options);//Adds remaining stock to the entered number of additional stock
                    var itemSelected = res[0].product_name
                    console.log(divider);
                    updateProduct(updatedStock, itemSelected); //calls function to update existing stock

                    lowInventory();
                    console.log( `Product Added: ${res[0].product_name}  Number of Items added: ${answer2.product_options}`)//Logs inventory addition
                    
                })
            })
        })
    })
}

//function to add the existing inventory items to the database
function updateProduct(updatedStock, itemSelected) {
     connection.query("UPDATE products SET ? WHERE ?",
     [{
        stock_quantity: updatedStock
     },
     {
        product_name: itemSelected
     }
     ],
     function (err, res) {
         if (err) throw err;
     }
    );
}

//Function to prompt manager for new product details
function newProduct() {
    inquirer.prompt([
    {
        name: 'new_product',
        type: 'input',
        message: 'Enter the Name of the New Product: '
    },
    {
        name: 'department_name',
        type: 'list',
        message: 'Choose the Department to Add the Product To: ',
        choices: ['Automative', 'Entertainment', 'Electronics', 'Grocery', 'Health Care', 'Kitchen', 'Travel']
    },
    {
        name: 'new_price',
        type: 'input',
        message: 'Enter the Price of the New Product'
    },
    {
        name: 'starting_quantity',
        type: 'input',
        message: 'Enter the Starting Inventory'
    },
    ])//function to set answers to variables to be used later
    .then(function(answer) {
        var product = answer.new_product;
        var departmentName = answer.department_name;
        var price = answer.new_price;
        var quantity =answer.starting_quantity;
        addNewProduct(product, departmentName, price, quantity);
    });
};
//function to add new product  to database and display the inventory menu
function addNewProduct(product, departmentName, price, quantity) {
    connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("' + product + '","' + departmentName + '", ' + price + ', ' + quantity + ')');
    saleInventory();
};

module.exports = {
    managerOptions
};