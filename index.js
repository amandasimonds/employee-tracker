var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table")

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",
  password: "root",
  database: "employee_tracker"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "selection",
      type: "list",
      message: "What would you like to do?",
      choices: 
        [
            "View All Employees",
            "View Departments",
            "View Roles", 
            "Add Employee",
            "Add Department",
            "Add Role", 
            "Update Employee",
        ]
    })
    .then(function(answer) {
        console.log(answer);
      // based on their answer, either call the bid or the post functions
      if (answer.selection === "View All Employees") {
        viewAll();
      }
      else if(answer.postOrBid === "View Departments") {
        viewDepts();

      } 
      else if(answer.postOrBid === "View Roles") {
        viewRoles();

      }
      else if(answer.postOrBid === "Add Employee") {
        addEmployee();

      }
      else if(answer.postOrBid === "Add Department") {
        addDept();

      }
      else if(answer.postOrBid === "Add Role") {
        addRole();

      }
      else if(answer.postOrBid === "Update Employee") {
        updateEmployee();

      }else{
        connection.end();
      }
    });
}

function viewAll(){
    console.log("view all!!");
}


function viewAll() {
      connection.query(
        "SELECT * FROM employee",
        
        function(err, result, fields) {
          if (err) throw err;
          console.table(result);
          // re-prompt the user for another selection
          start();
        }
      );
    };

// function addEmployee() {
//   // query the database for all items being auctioned
//   connection.query(
//       `INSERT INTO employee (first_name) VALUES (${newEmployee})`, 
//       function(err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function() {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then(function(answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             function(error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }
