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
                this.addEmpolyee();
                break;
            case "View Roles":
                this.viewRole();
                break;
            case "View Employees":
                this.viewEmpolyee;
                break;
            case "View Departments":
                this.viewDepartment();
                break;
            case "Edit Employee Role":
                this.editEmployee();
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

        await connection.query("insert into department SET ?", [{ name}]);
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
                choices: departments.map(department => {
                    return { name: department.name, value: department.id };
                }),
            },
        ]);

        console.log("new employee data", title, salary, department_id);
    },


    // logic for viewing elements
    viewDepartment: async function () {
        const departments = await connection.query("SELECT * FROM department");
        const departmentData = departments.map((department) => {
            return { id: department.id, name: department.name };
        });
        console.table(
            departments.map((department) => {
                return { id: department.id, name: department.name };
            })
        );
        this.mainMenu();
    },
};