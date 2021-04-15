const inquirer = require("inquirer");
const connection = require("../db/connection");

module.exports = {
    mainMenu: async function () {
        const { modeChoice } = await inquirer.prompt({
            message: "what would you like to do",
            type: "list",
            name: "modeChoice",
            choices: [
                "Add a Department", 
                "Add a Role",
                "Add an Employee",
                "View Roles",
                "View Employees",
                "View Departments",
                "Edit Employee Role",
                "Exit",
            ],
        });
        console.log(modeChoice);

        switch (modeChoice) {
            case "Add a Department":
                this.addDepartment();
                break;
            case "Add a Role":
                this.addRole();
                break;
            case "Add an Employee":
                this.addEmployee();
                break;
            case "View Roles":
                this.viewRoles();
                break;
            case "View Employees":
                this.viewEmployees;
                break;
            case "View Departments":
                this.viewDepartments();
                break;
            case "Edit Employee Role":
                this.changeEmployeeRole();
                break;
            case "Exit":
                this.exit();
                break;

            default:
                console.log("byyyee");
                process.exit();
                break;
        }
    },

    // logic for adding elements
    addDepartment: async function () {
        const { name } = await inquirer.prompt({
            type: "test",
            name: "name",
            message: "what is the name of this department",
        });

        await connection.query("INSERT INTO department SET ?", [{ name }]);
        console.log("success");
        this.mainMenu();
    },

    // adding role needs a department id
    addRole: async function () {
        const departments = await connection.query("SELECT * FROM department");

        const { title, salary, department_id } = await inquirer.prompt([
            { type: "text", name: "title", message: "what is the title" },
            { type: "number", name: "salary", message: "what is the salary" },
            { 
                type: "list", 
                name: "department_id", 
                message: "what department does this role belong to?",
                choices: departments.map((department) => {
                    return { name: department.name, value: department.id };
                }),
            },
          ]);

        await connection.query("INSERT INTO role SET ?, ?, ?", [
             { title }, 
             { salary }, 
             { department_id },
        ]);

        console.log("success");
        this.mainMenu();
    },

    addEmployee: async function () {
        const newEmployee = await inquirer.prompt([
          {
            type: "text",
            message: "what is the name of this department",
            name: "first_name",
          },
          {
              type: "text",
              message: "what is the employees last name?",
              name: "last_name",
          },
        ]);

        const departments = await connection.query("SELECT * FROM department");

        const { department_id } = await inquiere.prompt({
            type: "list",
            name: "department_id",
            choices: department.map((department) => {
                return{
                    name: department.name,
                    value: department.id,
                };
            }),
        });

        console.log(departments);

        const roles = await connection.query(
            "SELECT * FROM role WHERE department_id = ?", 
            [department_id]
          );
        
        const { role_id } = await inquirer.prompt({
            type: "list",
            name: "role_id",
            message: "which role?",
            choices: roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                };
            }),
        });

        newEmployee.role_id = role_id;

        const { hasManager } = await inqurer.prompt({
            type: "confirm",
            message: "Does this employee have a manager?",
            name: "hasManager",
        });
        
        if(!hasManager){
            const res = await connection.query("INSERTINTO employee SET ?", [
                newEmployee,
            ]);
            console("if success");
            this.mainMenu();
        } else {
            const employees = await connection.query("SELECT * FROM employee");
            const employeeData = employees.map((employee) => {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                };
            });

            const { manager_id } = await inqurer.prompt({
                message: "who is this employees manager?",
                name: "manager_id",
                type: "list",
                choices: employeeData,
            });

            newEmployee.manager_id = manager_id;

            const res await = connection.query("INSERT INTO employee SET ?", [
                newEmployee,
            ]);

            console("else success");
            this.mainMenu();
        }
    },


    // logic for viewing elements
    viewDepartments: async function () {
        const departments = await connection.query("SELECT * FROM department");
      
        console.table(
            departments.map((department) => {
                return { id: department.id, name: department.name };
            })
        );

        this.mainMenu();
    },

    viewRoles: async function () {
        const roles = await connection.query(
            "SELECT * FROM role LEFT JOIN department ON role.department_id = department.id"
            );

        console.table(
            roles.map(({ title, salary, name }) => {
            return {
              title, 
              salary, 
              department: name,
            };
        })
        );

        this.mainMenu();
    },

    viewEmployees: async function () {
        const roles = await connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, '', manager.last_name) AS manager FROM employee
            LEFT JOIN rile ON employee.role_id = department.id
            LEFT JOIN department ON role.department_id = department.id;`
            );

        console.table(
            employees.map(({ id, first_name, last_name, department, title, salary, manager }) => {
            return {
                id, 
                first_name, 
                last_name, 
                department, 
                title, 
                salary, 
                manager,
            };
        })
        );
        console.log(employees);

        this.mainMenu();
    },

    changeEmployeeRole: function async () {
        const employees = await connection.query(
            "SELECT id, role_id, manager_id, CONCAT(first_name, ' ', last_name? AS name FROM employee)"
            );

        const { id } = await.inqurer.prompt({
            message: "which employees role are you changing",
            name: "id",
            type: "list",
            choices: employees.map((employee) => {
                return {
                    name: employee.name,
                    value: employee.id,
                };
            }),
        });

        const chosenEmployee = employee.filter(
            (employee) => employee.id === id
            )[0];

        const roles = await connection.query("SELECT * FROM role");

        const { newRoleId } = await inqurer.prompt({
            message: "which role would you like to switch employee to ",
            name: "newRoleId",
            choices: roles.map((role) => {
                return { 
                    name: role.title 
                };
            }),
        });

        console.log(newRoleId);


        console.log(chosenEmployee);

        this.mainMenu();

    },

};