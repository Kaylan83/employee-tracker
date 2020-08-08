DROP DATABASE IF EXISTS employee_tracker;
CREATE database employee_tracker;

USE employee_tracker;

CREATE TABLE department(
   id INT NOT NULL,
   name VARCHAR(30)  NULL,
   PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT NOT NULL,
    title VARCHAR(30)  NULL,
    salary DEC(10,2)  NULL,
    department_id INT(20)  NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL,
    first_name VARCHAR(30)  NULL,
    last_name VARCHAR(30)  NULL,
    role_id INT(20)  NULL,
    manager_id INT(20) NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);