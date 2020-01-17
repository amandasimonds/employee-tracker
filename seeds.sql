USE employee_tracker;

INSERT INTO department (name)
VALUES ("Administration"), ("Teachers"), ("Support Services");

INSERT INTO role (title, salary, department_id)
VALUES ("Principal", 80000, 1), ("Office Manager", 40000, 1), ("Building Manager", 55000, 1), ("Art Teacher", 36000, 2), ("Music Teacher", 36000, 2), ("Kindergarten Teacher", 36000, 2), ("Speech Therapist", 41000, 3), ("Mental Health Provider", 42000, 3), ("Occupational Therapist", 42000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jon", "Stewart", 1, 0), ("Deborah", "Williams", 2, 0), ("Tim", "Allen", 3, 2), ("Amanda", "Simonds", 4, 1), ("Ariana", "Grande", 5, 1), ("Mikela", "Swims", 6,1), ("Meryl", "Streep", 7, 2), ("Jerry", "Springer", 8, 2), ("Uma", "Thurman", 9, 2);