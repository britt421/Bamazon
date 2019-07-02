require("dotenv").config()
// MySQL and Inquirer packages:
var mysql = require("mysql");
var inquirer = require("inquirer");

// Establishing connection with database.
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "Bamazon"
});
connection.connect(function (err) {
    console.log("do we get here?")
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
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
    askBuyer();
} 

// Function to ask the user if they want to purchase an item.
function askBuyer() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What product would you like to buy? (Please type the product ID)",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (response) {
            var itemID = response.id;
            var itemQuantity = response.quantity;
            connection.query("SELECT * FROM products WHERE item_id = ?", [{
                item_id: itemID
            }],
                function (err, chosenItem) {
                    if (err) throw err;
                    console.log(chosenItem[0])
                    if (chosenItem[0].stock_quantity - itemQuantity >= 0) {
                        var total = itemQuantity * chosenItem[0].price;
                        console.log("Your total purchase is $" + total + ".");
                        connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [chosenItem[0].stock_quantity - itemQuantity, itemID],
                            function (err) {
                                if (err) throw err;
                                startOver();
                            })
                    } else {
                        console.log("Order NOT completed.  We currently have" + chosenItem[0].stock_quanity + "of " + chosenItem[0].product_name + " in stock.");
                        startOver();

                    }

                })

        })

}

// Function to reset.
function startOver() {
    inquirer
        .prompt([
            {
                name: "startOver",
                type: "list",
                choices: ["Yes", "No"],
                message: "Would you like to place another order?"

            }
        ]).then(function (response) {
            if (response.startOver === "Yes") {
                displayItems();
                askBuyer();
            } else {
                console.log("Thank you. Have a great day!")
                connection.end();
            }
        })
}
