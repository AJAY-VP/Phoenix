drop table if exists `users`;
create table `users`(
    id int(11) auto_increment primary key not null,
    lastName varchar(255) not null,
    firstName varchar(255) not null,
    email varchar(255) not null,
    mobileNumber varchar(30) not null,
    enabled tinyint(1) not null default '0',
    userPrivilegeId tinyint(1) not null default '1',
    accessRequestReason text not null
);



