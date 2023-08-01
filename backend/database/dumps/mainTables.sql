drop table if exists `users`;
CREATE TABLE users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    countryCode Varchar(10) DEFAULT NULL,
    mobileNumber VARCHAR(30) NOT NULL,
    enabled TINYINT(1) NOT NULL DEFAULT '1',
    userPrivilegeId TINYINT(1) NOT NULL DEFAULT '1',
    accessRequestReason VARCHAR(255) NOT NULL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otp INT DEFAULT NULL,
    otpTime TIMESTAMP DEFAULT NULL,
    password VARCHAR(64) DEFAULT NULL,
    UNIQUE KEY (email)
);

drop table if exists `user_privilege`;
CREATE TABLE user_privilege (
    id INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    privilege VARCHAR(255) NOT NULL,
    UNIQUE KEY (privilege)
);

insert into user_privilege (privilege) values('User');
insert into user_privilege (privilege) values('Admin');


