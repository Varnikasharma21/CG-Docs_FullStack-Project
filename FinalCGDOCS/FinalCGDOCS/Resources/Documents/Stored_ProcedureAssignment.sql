

use[Employee_Info]
go

--STORED PROCEDURE TO INSERT
--Creating Stored Procedure to insert values in marital status table
create procedure prc_InsertMaritalStatus
@MaritalStatus varchar(20),
@CreatedBy varchar(30),
@UpdatedBy varchar(30)=null,
@UpdatedAt datetime=null,
@IsActive bit=1,
@IsDeleted bit=0

AS
Begin

Set NOCOUNT ON;

INSERT INTO EmployeeMaritalStatus
(MaritalStatus, CreatedBy, UpdatedBy, UpdatedAt, IsActive, IsDeleted)
VALUES
(@MaritalStatus, @CreatedBy, @UpdatedBy, @UpdatedAt, @IsActive, @IsDeleted)

end

--Executing the procedure
EXEC prc_InsertMaritalStatus @MaritalStatus='Unmarried', @CreatedBy='Varnika'
GO


-- STORED PROCEDURE TO GET
--Creating stored procedure to fetch values from Marital status table
create proc prc_GetMaritalStatus
@StatusId int

AS
Begin

SET NOCOUNT ON;

select* from EmployeeMaritalStatus where StatusId=@StatusId
end

--Executing the stored procedure
EXEC prc_GetMaritalStatus @StatusId=1
Go



--STORED PROCEDURE TO UPDATE
--Creating a stored procedure to update the values in marital status table
create proc prc_UpdateMaritalStatus
@StatusId int,
@UpdatedBy varchar(30),
@UpdatedAt datetime,
@IsActive bit,
@IsDeleted bit

AS
Begin

set nocount on;
Update EmployeeMaritalStatus set UpdatedBy=@UpdatedBy, UpdatedAt=GETDATE(),
IsActive=@IsActive, IsDeleted=@IsDeleted where StatusId=@StatusId

end
GO

--Executing the stored procedure
declare @Update_At as datetime=getdate()
Exec prc_UpdateMaritalStatus @UpdatedBy='Varnika', @UpdatedAt=@Update_At, @IsActive=1,
@IsDeleted=0, @StatusId=1
Go


-- STORED PROCEDURE TO DELETE
--Creating Stored procedure to delete data from table
create proc prc_DeleteMaritalStatus
@StatusId int

AS
Begin

set NOCOUNT on;
delete EmployeeMaritalStatus where StatusId=@StatusId
end
go
 
 --Executing the stored procedure
exec prc_DeleteMaritalStatus @StatusId=3
Go


--STORED PROCEDURE To INSERT Record 
--Creating stored procedure to insert records into employee information table
create procedure prc_InsertEmployee
@FirstName varchar(50),
@MiddleName varchar(50)=null,
@LastName varchar(50)=null,
@Age int=null,
@DateOfBirth date,
@PhoneNo varchar(12)=null,
@MobileNo bigint,
@EmailId varchar(100),
@MaritalStatus int,
@CreatedBy varchar(30),
@UpdatedBy varchar(30)=null,
@UpdatedAt datetime=null,
@IsActive bit=1,
@IsDeleted bit=0

AS
Begin

Set NOCOUNT ON;
INSERT INTO EmployeeDetails
(FirstName, MiddleName, LastName, Age, DateOfBirth, PhoneNo, MobileNo, MaritalStatus, 
EmailId, CreatedBy, UpdatedBy, UpdatedAt, IsActive, IsDeleted)
VALUES
(@FirstName, @MiddleName, @LastName, @Age, @DateOfBirth, @PhoneNo, @MobileNo,
@MaritalStatus, @EmailId, @CreatedBy,
@UpdatedBy,
@UpdatedAt,
@IsActive,
@IsDeleted)
end
Go

--Executing the stored procedure
EXEC prc_InsertEmployee @FirstName='Varnika', @LastName='Sharma', @Age=20,
@DateOfBirth='2002-03-21', @MobileNo=8629010360 , @MaritalStatus=1,
@EmailId='varnikasharma@gmail.com', @CreatedBy='Varnika';
Go

--STORED PROCEDURE To FETCH Records
--Creating stored procedure to fetch the records from employee details table
create procedure prc_GetEmployeeInfo
@EmailId varchar(100)

AS
Begin
Set NOCOUNT ON;

select* from EmployeeDetails where EmailId=@EmailId
end
Go

--Executing the stored procedure
EXEC prc_GetEmployeeInfo @EmailId='varnikasharma@gmail.com'
Go

--STORED PROCEDURE To UPDATE Record
--Creating stored procedure to update records in employee details table
create procedure prc_UpdateEmployeeInfo
@EmployeeId int,
@MobileNo bigint,
@MaritalStatus int,
@UpdatedBy varchar(30),
@UpdatedAt datetime,
@IsActive bit,
@IsDeleted bit

As
Begin
Set NOCOUNT ON;

Update EmployeeDetails SET MobileNo=@MobileNo, MaritalStatus=@MaritalStatus, UpdatedBy=@UpdatedBy,
UpdatedAt=GETDATE(), IsActive=@IsActive, IsDeleted=@IsDeleted where EmployeeId=@EmployeeId
end
Go

--Executing the stored procedure
declare @EmplopyeeUpdateAt as datetime=getdate()
EXEC prc_UpdateEmployeeInfo @MobileNo=6523098987, @MaritalStatus=1,
@UpdatedBy='Varnika', @UpdatedAt=@EmplopyeeUpdateAt, @IsActive=1, @IsDeleted=0, @EmployeeId=1
Go



--STORED PROCEDURE To DELETE Record 
--Creating stored procedure to delete data from employee details table
create procedure prc_DeleteEmployee
@EmployeeId int

AS
Begin

Set NOCOUNT ON;
delete EmployeeDetails where EmployeeId=@EmployeeId
end
Go

--Executing the stored procedure
Exec prc_DeleteEmployee @EmployeeId=1
Go