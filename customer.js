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

// Function to display the product items in the terminal window.
function displayItems() {
    console.log("\nId" + " | " + "Product" + " | " + "Department" + " | " + "Price" + " | " + "Quantity")
    console.log("====================================================");
    
// Retrieveing data from the database table.
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("====================================================");
    });

} askBuyer();