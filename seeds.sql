
USE employee_tracker;

INSERT INTO department (id,name)
VALUES ('1', 'Managment'), ('2', 'IT'), ('3', 'Engineering'), ('4', 'costumer service');

INSERT INTO role (id,title,salary,department_id)
VALUES ('1','manager','90000.00','1'),('2','developer','90000.00','2'), ('3','Engineer','90000.00','3'), ('4','costumer rep','50000.00','4');

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ('1', 'John', 'Doe', '1', null), ('2', 'Jack', 'Smith', '2', '1'),('3', 'Jack', 'Dear', '13', '1'),('4', 'Jane', 'Doe', '4', '1');