create database Employee_details
use[Employee_details]
go

--MASTER TABLE
create table Projects
					 (Project_id int not null primary key identity(1,1),
					 Project_name nvarchar(40) null,
					 Created_By varchar(30) not null,
					 Created_At datetime not null default(GETDATE()),
					 Updated_By varchar(30) null,
					 Updated_At datetime null,
					 Is_Active bit default 1,
					 Is_Deleted bit default 0)


Go

create table Employee_Information
								 (Employe_id int not null primary key identity(1,1),
								 FirstName varchar(50) not null,
								 MiddleName varchar(50) null,
								 LastName varchar(50) null,
								 age int null,
								 Date_Of_Birth date not null,
								 Mobile_No bigint not null,
								 email_id varchar(100) not null unique,
								 Created_By varchar(30) not null,
								 Created_At datetime not null default(GETDATE()),
								 Updated_By varchar(30) null,
								 Updated_At datetime null,
								 Is_Active bit default 1,
								 Is_Deleted bit default 0,
								 Marital_Status varchar(20) null,
								 Assigned_project int not null,
								 foreign key (Assigned_project) references dbo.Projects(project_id))
	Go			 