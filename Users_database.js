/**
 * Created by Victor on 1/21/2017.
 */
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(36) NOT NULL UNIQUE,
    firstname VARCHAR(50) NOT NULL,
    middlename VARCHAR(50),
    lastname VARCHAR(50) NOT NULL,
    password CHAR(60) BINARY NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    birthday DATE NOT NULL,
    gender CHAR(1) NOT NULL
);