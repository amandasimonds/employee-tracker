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
      // based on their answer, call the function needed
      if (answer.selection === "View All Employees") {
        viewAll();
      }
      else if(answer.selection === "View Departments") {
        viewDepts();

      } 
      else if(answer.selection === "View Roles") {
        viewRoles();

      }
      else if(answer.selection === "Add Employee") {
        addEmployee();

      }
      else if(answer.selection === "Add Department") {
        addDept();

      }
      else if(answer.selection === "Add Role") {
        addRole();

      }
      else if(answer.selection === "Update Employee") {
        updateEmployee();

      }else{
        connection.end();
      }
    });
}

//View All Employees Function
function viewAll() {
      connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.id, department.id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", 
        function(err, result, fields) {
          if (err) throw err;
          console.table(result);
          // re-prompt the user for another selection
          start();
        }
      );
    };

 function viewRoles() {
 connection.query(
"SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name FROM role LEFT JOIN department on role.department_id = department.id",
 function(err, result, fields) {
     if (err) throw err;
     console.table(result);
     // re-prompt the user for another selection
     start();
   }
 ); };

 function viewDepts() {
  connection.query("SELECT * FROM department", function(err, result, fields) {
      if (err) throw err;
      console.table(result);
      // re-prompt the user for another selection
      start();
    }
  ); };

/////////Look Up Functions//////////////
var roleChoices = [];
var empChoices = [];
var deptChoices = [];

function lookupRoles(){  
    //selects all departments, pushes the id and name for each into the array
    connection.query("SELECT * FROM role", function (err, data) {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
            roleChoices.push(data[i].id + "-" + data[i].title)
        }
     })
    }

function lookupEmployee(){  
    //selects all departments, pushes the id and name for each into the array
     connection.query("SELECT * FROM employee", function (err, data) {
         if (err) throw err;
         for (i = 0; i < data.length; i++) {
             empChoices.push(data[i].id + "-" + data[i].first_name+" "+ data[i].last_name)
         }
        //  return empChoices;
     }) 
    }

function lookupDepts(){
  //selects all departments, pushes the id and name for each into the array
  connection.query("SELECT * FROM department", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
        deptChoices.push(data[i].id + "-" + data[i].name)
    }
})
}

//////////Prompt Functions////////////
function addEmployee() {

    lookupRoles()
    lookupEmployee()

    inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "What is the employee's first name?"
    },

    {
        name: "lastname",
        type: "input",
        message: "What is the employee's last name?"
    },

    {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: roleChoices 
      },

      {
        name: "reportingTo",
        type: "list",
        message: "Who is the employee's manager?",
        choices: empChoices
      }
    
     ]).then(function(answer) {
       //add new employee to the database
      var getRoleId =answer.role.split("-")
      var getReportingToId=answer.reportingTo.split("-")
      var query = 
      `INSERT INTO employee (first_name, last_name, role_id, manager_id)
       VALUES ('${answer.firstname}','${answer.lastname}','${getRoleId[0]}','${getReportingToId[0]}')`;
      connection.query(query, function(err, res) {
        console.log(`new employee ${answer.firstname} ${answer.lastname} added!`)
      });
      start();
    });
};

function addRole() {

  lookupRoles()
  lookupEmployee()
  lookupDepts()

  inquirer.prompt([
  {
    name: "role",
    type: "input",
    message: "Enter the role you would like to add:"
  },

  {
      name: "dept",
      type: "list",
      message: "In what department would you like to add this role?",
      choices: deptChoices
  },

  {
    name: "salary",
    type: "number",
    message: "Enter the role's salary:"
  },
  
   ]).then(function(answer) {
     console.log(`${answer.role}`)
     //add new employee to the database
    var getDeptId =answer.dept.split("-")
    var query = 
    `INSERT INTO role (title, salary, department_id)
     VALUES ('${answer.role}','${answer.salary}','${getDeptId[0]}')`;
    connection.query(query, function(err, res) {
      console.log(`<br>-----new role ${answer.role} added!------`)
    });
    start();
  });
};

function addDept() {

  lookupRoles()
  lookupEmployee()
  lookupDepts()

  inquirer.prompt([
  {
    name: "dept",
    type: "input",
    message: "Enter the department you would like to add:"
  }
  ]).then(function(answer) {
     //add new department to the database
    var query = 
    `INSERT INTO department (name)
     VALUES ('${answer.dept}')`;
    connection.query(query, function(err, res) {
      console.log(`-------new department added: ${answer.dept}-------`)
    });
    start();
  });
};

function updateEmployee() {

  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
  inquirer.prompt([
    {
      name: "employee",
      type: "list",
      message: "Which employee would you like to update?",
      choices: function () {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name);
        }
        return choiceArray;
      }
    }
  ])

  .then(function (data) {
    for (var i = 0; i < results.length; i++) {
        if (data.employeeName === results[i].id + " " + results[i].first_name + " " + results[i].last_name) {
            var employeeID = results[i].id;
        }
    }
    return (employeeID);  
    })

    .then(function(employeeID){
    inquirer.prompt([
      {
        name: "updateSelection",
        type: "list",
        message: "What would you like to update?",
        choices: ["First name", "Last Name", "Role"]
      }
    ])

    .then(function(answer){
      if (answer.updateSelection === "First Name"){
       newFirstName(employeeID);
      } else if (answer.updateSelection === "Last Name"){
       newLastName(employeeID);
      } else if (answer.updateSelection === "Role"){
        newEmpRole(employeeID);
       }
    });
  });
});
};

function newLastName(employeeID) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "newLast",
                message: "What is their new last name?"
            }
        ])
        .then(function (data) {
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        last_name: data.newLast
                    },
                    {
                        id: employeeID
                    }
                ],
                function (error) {
                    if (error) throw err;
                    start();
                }
            );
        });
}

function newFirstName(employeeID) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "newFirst",
                message: "What is their new first name?"
            }
        ])
        .then(function (data) {
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        first_name: data.newFirst
                    },
                    {
                        id: employeeID
                    }
                ],
                function (error) {
                    if (error) throw err;
                    start();
                }
            );
        });
}

function newEmpRole(employeeID) {
  connection.query("SELECT * FROM role", function (err, results) {
      if (err) throw err;
      inquirer
          .prompt([
              {
                  type: "list",
                  name: "roleID",
                  message: "What is their new role.",
                  choices: function () {
                      var choiceArray = [];
                      for (var i = 0; i < results.length; i++) {
                          choiceArray.push(results[i].title);
                      }
                      return choiceArray;
                  }
              }
          ])
          .then(function (data) {
              for (var i = 0; i < results.length; i++) {
                  if (data.roleID === results[i].title) {
                      data.roleID = results[i].id
                  }
              }
              return data;
          })
          .then(function (data) {
              connection.query(
                  "UPDATE employee SET ? WHERE ?",
                  [
                      {
                          role_id: data.roleID
                      },
                      {
                          id: employeeID
                      }
                  ],
                  function (error) {
                      if (error) throw err;
                      start();
                  }
              );
          });
  })
}