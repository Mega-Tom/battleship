CREATE TABLE Player(
    id SERIAL Primary Key,
    Username varchar(30) NOT NULL UNIQUE,
    Password varchar(200) NOT NULL,
    Salt bigint
    );

CREATE TYPE GameState
   as ENUM ('no_setup','one_setup','two_setup','playing','one_won','two_won');


CREATE TABLE Game(
    id SERIAL Primary Key,
    player1Id int NOT NULL REFERENCES Player(id),
    player2Id int NOT NULL REFERENCES Player(id) CHECK(player1Id <> player2Id),
    state GameState NOT NULL
    );
    
