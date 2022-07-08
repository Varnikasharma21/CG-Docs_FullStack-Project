
CREATE DATABASE Employee_Info;

use Employee_Info
Go

/* Master Table*/
create table EmployeeMaritalStatus( StatusId int identity(1,1)  primary key not null,
MaritalStatus varchar(20) not null,
CreatedBy varchar(30) not null,
CreatedAt datetime not null default(GETDATE()),
UpdatedBy varchar(30),
UpdatedAt datetime,
IsActive bit default 1,
IsDeleted bit default 0)
Go

/* Table for Employee Information*/
create table EmployeeDetails(EmployeeId int identity(1,1) primary key not null,
FirstName varchar(50) not null,
MiddleName varchar(50),
LastName varchar(50),
Age int,
DateOfBirth date not null,
PhoneNo varchar(12),
MobileNo bigint not null,
emailid varchar(100) not null unique,
CreatedBy varchar(30) not null,
CreatedAt datetime not null default(GETDATE()),
UpdatedBy varchar(30),
UpdatedAt datetime,
IsActive bit default 1,
IsDeleted bit default 0,
MaritalStatus int not null default 1,
Foreign key (MaritalStatus) references EmployeeMaritalStatus(StatusId))
Go

