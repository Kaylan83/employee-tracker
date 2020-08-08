var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table")


var connection = mysql.createConnection({
    host: "localhost",

    // Your port, if not 3306
    port: 3306,

    //username
    user: "root",

    //password
    password: "",
    database: "employee_tracker"
});

// starting connection 
connection.connect(err => {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId + "\n");
    startApp();
});

// starting application function
function startApp(){
    // prompt the user to choose the action want to perform
 inquirer.prompt([
     {
         type: "list",
         message: "What do you like to do?",
         name: "toolType",
         choices: [
             "Add",
             "View",
             "Update",
             "Delete",
             "Exit"
         ]
     }
 ]).then(res => {
   if (res.toolType === "Add"){
       Add();
    }
   else if (res.toolType === "View") {
    View();
   } 
   else if (res.toolType === "Update") {
    updateRole();
   }
   else if (res.toolType === "Delete") {
    Delete();
   } 
   else {
       connection.end();
   }
 })
}; 

// add function
function Add(){
    //prmpt the user to choose what the user wants to add
    inquirer.prompt([
        {
            type: "list",
            name: "addType",
            message:"What kind of add you like to do?",
            choices: [
                "Add Department",
                "Add role",
                "Add Employee"
            ]
        }
    ]).then(res => {
        if (res.addType === "Add Department") {
            addDepartment();
        } else if (res.addType === "Add role") {
            addRole();
        } else {
            addEmployee();
        }

        })
       
};

// view function
function View(){
    // prompt the user choices of view 
    inquirer.prompt([
        {
            type: "list",
            name: "view",
            message: "What do you like to view? ",
            choices:[
                "View all departments",
                "View all employees",
                "View all roles",
                "View all employees, roles, and departments",
                
            ]
        }
    ]).then( res => {
        var query = "";
        if (res.view === "View all departments") {
            query ="SELECT * FROM department";
        } else if (res.view === "View all employees") {
            query = "SELECT * FROM employee";
        } else if (res.view === "View all roles") {
            query = "SELECT * FROM role";
        } else if (res.view === "View all employees, roles, and departments"){
            query = "SELECT employee.*, role.title, role.salary, department.name, department.id FROM ((employee INNER JOIN role ON employee.role_id = role.id) INNER JOIN department ON role.department_id = department.id)"
        }  
         
   
        

        connection.query(query, (err,res) => {
            if (err) throw err;
            console.table(res);
            startApp();
        })
    })
};

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department_id",
            message: "Please enter department id: ",
            validate: validator
        },    
        {
        type: "input",
        name: "department",
        message: "Please enter department name",
        validate:  (input) => {
            if (input === '' || input === null) {
                return "invalid input";
            }
            return true;
        }
        }

    ]).then(res => {
        let query = "INSERT INTO department SET ?";
        connection.query(query,{id: res.department_id, name: res.department}, (err, response)=> {
            if (err) throw err;
            console.log("The following department been added: " + "\n");
            console.table({id: res.department_id, name: res.department});
            startApp();
        });
    })
};

// add role function
function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "role_id",
            message: "Please enter role id: ",
            validate: validator
        },    
        {
        type: "input",
        name: "title",
        message: "Please enter title",
        validate:  (input) => {
            if (input === '' || input === null) {
                return "invalid input";
            }
            return true;
        }
        },
        {
            type: "input",
            name: "salary",
            message: "Please enter salary: ",
            validate: validator
        },
        {
            type: "input",
            name: "department_id",
            message: "Please enter department id: ",
            validate: validator
        }
    ]).then(res => {
        let query = "INSERT INTO role SET ?";
        connection.query(query,{id: res.role_id, title: res.title, salary: res.salary, department_id: res.department_id}, (err, response)=> {
            if (err) throw err;
            console.log("The following role been added: " + "\n");
            console.table({id: res.role_id, title: res.title, salary: res.salary, department_id: res.department_id});
            startApp();
        });
    })
};

// add employee functin
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "employee_id",
            message: "Please enter employee id: ",
            validate: validator
        },    
        {
        type: "input",
        name: "first_name",
        message: "Please employee's first name",
        validate:  (input) => {
            if (input === '' || input === null) {
                return "invalid input";
            }
            return true;
        }
        },
        {
            type: "input",
            name: "last_name",
            message: "Please employee's last name",
            validate:  (input) => {
                if (input === '' || input === null) {
                    return "invalid input";
                }
                return true;
            }
        },
        {
            type: "input",
            name: "role_id",
            message: "Please enter employee's role id: ",
            validate: validator
        },
        {
            type: "input",
            name: "manager_id",
            message: "Please enter employee's manager id: ",
            
        }
    ]).then(res => {
        //adding query
        let query = "INSERT INTO employee SET ?";
        connection.query(query,{id: res.employee_id, first_name: res.first_name, last_name: res.last_name, role_id: res.role_id, manager_id: res.manager_id}, (err, response)=> {
            if (err) throw err;
            console.log("The following employee been added: " + "\n");
            console.table({id: res.employee_id, first_name: res.first_name, last_name: res.last_name, role_id: res.role_id, manager_id: res.manager_id});
            startApp();
        });
    })
};

// update role function
function updateRole() {
// select query to present the user with employees names
    connection.query("SELECT * FROM employee", (err, res)=> {
        if(err) throw err;
        var choiceList = [];
        
             for (let i =0; i <res.length; i++){
              
              choiceList.push(res[i].first_name + " " + res[i].last_name);
            }
        
        inquirer.prompt({
            type: "list",
            name: "update",
            message: "Which employee you would like to update the role: ",
            choices: choiceList

        }).then(answer => {
            var name = answer.update.split(" ");
          // select query to present the user with available roles
            connection.query("SELECT * FROM role ", (err, response) => {
                if (err) throw err;
                
                   var roleList = [];
               for (let i =0; i<response.length; i++){
                   // push the roles into an array for the choices list
                   roleList.push(response[i].title)
               }
               
               inquirer.prompt({
                   type: "list",
                   name: "roles",
                   message: "To what role you would like to update the employee to: ",
                   choices: roleList
               }).then(roleAnswer => {
                
                connection.query("SELECT id FROM role WHERE title = ?", roleAnswer.roles, (error, dataReturn)=> {
                    
                    if (error) throw error;
                    connection.query("UPDATE employee SET ? WHERE  ? AND ?",[{role_id: dataReturn[0].id}, {first_name: name[0]}, {last_name: name[1]}], (Err, updateReturn) =>{
                        if(Err) throw Err;
                        console.log("-------------------------------------");
                        console.log("The role for employee" + name[0] + " " + name[1] + " has been updated to " + roleAnswer.roles);
                        console.log("-------------------------------------");
                        startApp();
                    })
                })
                 
               });
                
            });
             
        });
        
    });
    
};

function Delete(){
    inquirer.prompt({
        type: "list",
        name: "del",
        message: "What would you like to delete",
        choices: [
            "Delete department",
            "Delete role",
            "Delete Employee"
        ]
    }).then(choice => {
        if (choice.del === "Delete department"){
          deleteDepartment();  
        } else if (choice.del === "Delete role"){
            deleteRole();
        } else {
            deleteEmployee();
        }
    });
 
    

};

// delete department function
function deleteDepartment() {
       // select query to present the user with departments
    connection.query("SELECT * FROM department", (err,res) => {
        if(err) throw err;
        var choiceList = [];

        for (let i =0; i<res.length; i++){
            choiceList.push(res[i].name);
        };

        inquirer.prompt({
            type: "list",
            name: "Del",
            message: "Which department do you like to delete",
            choices: choiceList
        }).then(answer => {
            // push the nadepartments  into an arry to be presented in the choices
            connection.query("DELETE FROM department WHERE name = ?", answer.Del, (err, res) => {
                if (err) throw err;
                console.log(answer.Del)
                console.log("--------------------------");
                console.log("The depratment " + answer.Del + " was deleted");
                console.log("--------------------------");
                startApp();
            });
        });
    });
};

// delete role function
function deleteRole() {
    // select query to present the user with roles
    connection.query("SELECT * FROM role", (err,res) => {
        if(err) throw err;
        var choiceList = [];

        for (let i =0; i<res.length; i++){
            // push the roles into an arry to be presented  in the choices
            choiceList.push(res[i].title);
        };

        inquirer.prompt({
            type: "list",
            name: "Del",
            message: "Which role do you like to delete",
            choices: choiceList
        }).then(answer => {
            connection.query("DELETE FROM role WHERE title = ?", answer.Del, (err, res) => {
                if (err) throw err;
                console.log(answer.Del)
                console.log("--------------------------");
                console.log("The role " + answer.Del + " was deleted");
                console.log("--------------------------");
                startApp();
            });
        });
    });
};

// delete employee function
function deleteEmployee(){
    // select query to present the user with employees names
    connection.query("SELECT * FROM employee", (err, res)=> {
        if(err) throw err;
        var choiceList = [];
        
             for (let i =0; i <res.length; i++){
              // push the names into an arry to be presented as first and last names in the choices
              choiceList.push(res[i].first_name + " " + res[i].last_name);
            }
        
        inquirer.prompt({
            type: "list",
            name: "Del",
            message: "Which employee you would like to delete: ",
            choices: choiceList

        }).then(answer => {
            var name = answer.Del.split(" ");
           // deletion query
            connection.query("DELETE FROM employee WHERE ? AND ? ", [{first_name: name[0]}, {last_name: name[1]}], (err, response) => {
                if (err) throw err;
                console.log("------------------------------");
                console.log("The employee " + name[0] + " " + name[1] + " was deleted");
                console.log("------------------------------");
              startApp();
                
            });
             
        });
        
    });

};
// input validation function
const validator = value => {
    if (isNaN(value) === false) {
        return true;
      }
      return false;
    
}