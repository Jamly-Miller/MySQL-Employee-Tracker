DROP DATABASE IF EXISTS empolyee_tracker;
CREATE DATABASE empolyee_tracker;
USE empolyee_tracker;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);


CREATE TABLE empolyee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    salary DECIMAL (10,2),
    department_id INT,
    PRIMARY KEY(id)
);