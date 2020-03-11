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
        readProducts();
});

function readProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        //Display entire products table
        console.table(res);
        console.log("Connected: Welcome to Bamazon.")
        console.log(divider);
        userOptions();
    });
};

//Function to prompt user for initial action
function userOptions() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'How Can I Help You Today?',
        choices: ['Make A Purchase', 'Exit']
    })
    .then(function(answer) {
        switch (answer.action) {
            case 'Make A Purchase'://Calls prompts to select an item from the store
                customerPrompts(); 
                break;

            case 'Exit': //Calls connection.end to exit the store
                console.log("Thank-you for shopping. Goodbye!")
                connection.end();
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
            console.log("You've slected... || Product Name: " + res[0].product_name + "\n");

            inquirer.prompt({
                name: 'product_options',
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
                    readProducts(); //Reads the table and starts user prompts again
                }
            )
        })
    }
)
});
}



















