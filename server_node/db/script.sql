CREATE TABLE Users(
id_user    integer NOT NULL PRIMARY KEY AUTOINCREMENT ,
username    varchar(60) NOT NULL,
name       varchar(60) NOT NULL ,
password      varchar(60) NOT NULL ,
credit     integer NOT NULL
);

CREATE TABLE Relays(
id_relay     integer NOT NULL PRIMARY KEY AUTOINCREMENT ,
inUse        integer NOT NULL ,
remainingTime  integer NOT NULL ,
id_user       integer,
FOREIGN KEY (id_user) REFERENCES Users (id_user)
);