//Require Dependencies ================================
var mysql = require('mysql');
var inquirer = require('inquirer');
var customer = require('./bamazonCustomer');
var manager = require('./bamazonManager');
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
    readMainMenu();
})

//Prompt All Users for  Menu Choice
function readMainMenu() {
    inquirer.prompt({
        name: "menu_choice",
        type: 'list',
        message: 'Are You A Customer or Manager?',
        choices: ['Customer', 'Manager', 'Exit']
    })
    .then(function(answer) {
        switch (answer.menu_choice) {
            case 'Customer': //Calls the cusomer.js functions
                customer.readProducts();
                break;

            case 'Manager': //Calls the manager.js function
                manager.managerOptions();
               break;

            case 'Exit': //ends the connection to all modules
                console.log("Thank-you for using Bamazon. Good-bye!")
                connection.end();
                break;
        }
    })
}

module.exports = {
    readMainMenu
};
