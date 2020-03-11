/* Schema for SQL database/table. If Already exist load the database
else create new database*/
DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

/*Create new table*/
CREATE TABLE products (
    item_id INTEGER UNIQUE AUTO_INCREMENT, /*Unique ID that auto increments*/
    product_name VARCHAR (30) NOT NULL,
    department_name VARCHAR (30) NOT NULL,
    price DECIMAL NOT NULL,
    stock_quantity INTEGER NOT NULL, /*will represent how much of the product is available*/
    PRIMARY KEY (item_id)
);

/*Add 10 items to store to populate the database*/
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Silicone Baking Mat', 'Kitchen', 13.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Purell Hand Sanitizer 4-Pack', 'Health Care', 14.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Jumanji: The Next Level DVD', 'Entertainment', 24.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Mini Tongs -3pcs', 'Kitchen', 5.01, 33);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('2 IN 1 Travel Pillow', 'Travel', 5.75 , 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Bluetooth Headphones', 'Electronics', 100.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Car Diffuser Essential Oil Clip On', 'Automotive', 9.99, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Gel Enhanced Seat Cushion', 'Automative', 29.95, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Sparkling ICE 12-Pack', 'Grocery', 29.95, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Magic Bullet Blender', 'Kitchen', 29.99, 5);