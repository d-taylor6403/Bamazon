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
    //readProducts();
})

function readProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        //Display entire products table
        console.table(res);
        console.log("Connected: Welcome to Bamazon.")
        console.log(divider);
        userOptions();
    })
}

//Function to update
function updateProduct(data, remainingStock) {
    if (remainingStock > 0) {
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                    stock_quantity: remainingStock
                },
                {
                    item_id: data[0].item_id
                }
            
            ],
            function (err, res) {
                if (err) throw err;
                console.log(data[0].product_name + 'products have been updated!\n');
                
            }
        );
    } else {
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: 0
            },
            {
                item_id: data[0].item_id
            }
            ],
            function (err, res) {
                if(err) throw err;
                console.log(`No more products in stock. Come back later!\n`);
                userOptions();
            }
        );
    }
}

//Function to prompt user for initial action
function userOptions() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'How Can I Help You Today?',
        choices: ['Make A Purchase', 'Return to Main Menu']
    })
    .then(function(answer) {
        switch (answer.action) {
            case 'Make A Purchase'://Calls prompts to select an item from the store
                customerPrompts(); 
                break;

            case 'Return to Main Menu': //Returns user to Main Menu
                console.log("Thank-you for shopping. Goodbye!")
                main.readMainMenu();
                break;
        }
    });
}

function customerPrompts() {
    inquirer.prompt({
        name: 'store_options',
        type: 'input',
        message: 'Enter The ID of the Product You Would Like To Purchase: ',
        validate: function (value) { //checks user input to ensure value is greater than 0 since the first id is 1
            if (value > 0 ){
                return true;
            }else{
                return "Please select a valid Item_Id"; //Displays message if value entered is not a number or is less than zero
            }
        }
    })//queries database for the entered item Id and displays the product name
    .then(function(answer) {
        connection.query("SELECT item_id, product_name, department_name, price FROM products WHERE ?", {
            item_id: answer.store_options
        }, function (err, res) {
            if (err) throw err;
            console.log("You've selected... || Product Name: " + res[0].product_name + "\n");

            inquirer.prompt({
                name: "product_options",
                type: "input",
                message: "How many would you like to buy?",
                validate: function (value){ //checks user input to ensure value entered is a number
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return "Please input a valid number";
                }
            }).then(function (answer2) {
                connection.query("SELECT * FROM products WHERE ?",[
                    {
                        item_id: answer.store_options
                    }
                ], function(err, data) {
                    if (err) throw err;

                    var itemPrice = data[0].price;//Retrieves item price
                    var totalCost = parseInt(answer2.product_options) * itemPrice; //calculates total cost based on number of items purchased

                    var remainingStock = parseInt(data[0].stock_quantity)- parseInt(answer2.product_options); //sets value for remaining stock based on number of items purchased

                    console.log(divider);
                    updateProduct(data, remainingStock); //calls function to update the database

                    
                    console.log("Order Summary:\n\n" + "Total Cost: $" + totalCost.toFixed(2) + "\nRemaining Stock: " + remainingStock); //Logs purchase details
                    readProducts();
                    
                })
        });
    })
});
}

module.exports = {
    readProducts
};