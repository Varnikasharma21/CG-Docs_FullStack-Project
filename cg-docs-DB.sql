/* Query for the database , tables*/

/*databse is created*/
Create Database Drive

use Drive
go

/*users table created in drive database*/
create table Users(
UserId int primary key not null identity(1,1),
Username nvarchar(100),
User_Password nvarchar(100),
User_Created_At smalldatetime
);

/*folders table created in drive database*/
create table Folders(
Folder_Id int primary key not null identity(1,1),
Folder_Name nvarchar(100),
Folder_Created_By int,
FOREIGN KEY(Folder_Created_By) REFERENCES users(UsersId),
Folder_Created_At smalldatetime,
Folder_isDeleted bit default 0,
Folder_isFavourite bit default 0
);

/*documents table created in drive database*/
create table Documents (
DocumentId int primary key not null identity(1,1),
Document_Name nvarchar(20),
Document_Type varchar(30),
Document_Size int,
Document_Created_By int,
FOREIGN KEY (Document_Created_By) REFERENCES users(UserId),
Document_Created_At smalldatetime,
Folder_Id int,
Document_isDeleted bit not null default 0,
FOREIGN KEY (FolderId) REFERENCES folders(Folder_Id),
Document_isFavourite bit default 0
);

/*value interted in users table*/
insert into users values(
'riya', 'riya', '2022-06-01 23:45:55'
);