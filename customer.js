// MySQL and Inquirer packages:
var mysql = require("mysql");
var inquirer = require("inquirer");

// Establishing connection with database.
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    displayItems();

});