-- ONWER:
DROP TABLE IF EXISTS Member;
DROP TABLE IF EXISTS Photo;
DROP TABLE IF EXISTS Person_in_Photo;
DROP TABLE IF EXISTS Activitydone;
DROP TABLE IF EXISTS Activity;
DROP TABLE IF EXISTS Achievement;
DROP TABLE IF EXISTS Recommendation;
DROP TABLE IF EXISTS Competition;
DROP TABLE IF EXISTS Journal;
DROP TABLE IF EXISTS Quest;
DROP TABLE IF EXISTS Emotion;
DROP TABLE IF EXISTS PersonHasFamily;
DROP TABLE IF EXISTS Family;
DROP TABLE IF EXISTS TestForNodeRed;
DROP TABLE IF EXISTS Face;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS AppUser;




-- Riski

CREATE TABLE [dbo].[AppUser] (
    [UserId]     VARCHAR (30)   NOT NULL,
    [UserPw]     VARBINARY (50) NOT NULL,
    [LastLogin]  DATETIME       DEFAULT (getdate()) NULL,
    [UserRole]   VARCHAR (20)   NOT NULL,
    PRIMARY KEY CLUSTERED ([UserId] ASC)
);

INSERT INTO AppUser(UserId, UserPw, UserRole) VALUES
('Admin',      HASHBYTES('SHA1','admin'), 'admin'), 
('ShunYu',     HASHBYTES('SHA1','A'),     'user'), 
('YoonKuek', HASHBYTES('SHA1','A'),'user'), 
('GeokKing', HASHBYTES('SHA1','A'),'user'), 
('XingYu', HASHBYTES('SHA1','A'),'user'), 
('GabrielNeo', HASHBYTES('SHA1','A'),          'user'), 
('Yikai1', HASHBYTES('SHA1','A'),'user'), 
('Yikai2', HASHBYTES('SHA1','A'),'user'), 
('Yikai3', HASHBYTES('SHA1','A'),'user'), 
('HuiYi',      HASHBYTES('SHA1','A'),         'user'), 
('Eric', HASHBYTES('SHA1','A'),'user'), 
('ChewHoon', HASHBYTES('SHA1','A'),'user'), 
('JiaYi', HASHBYTES('SHA1','A'),'user'), 
('Riski',      HASHBYTES('SHA1','A'),      'user'), 
('Christina', HASHBYTES('SHA1','A'),'user'), 
('Anwar', HASHBYTES('SHA1','A'),'user'), 
('Amei', HASHBYTES('SHA1','A'),'user'), 
('Percy',      HASHBYTES('SHA1','A'),       'user'), 
('Kristy', HASHBYTES('SHA1','A'),'user'), 
('Gary', HASHBYTES('SHA1','A'),'user'), 
('Marvin', HASHBYTES('SHA1','A'),'user'), 
('JunXing',    HASHBYTES('SHA1','A'),       'user'),
('KC', HASHBYTES('SHA1','A'),'user'), 
('TB', HASHBYTES('SHA1','A'),'user'), 
('JY', HASHBYTES('SHA1','A'),'user')

CREATE TABLE Family ( 
 FamilyId INT IDENTITY(1,1) NOT NULL,
 FamilyName VARCHAR(30) NOT NULL,
 FamilyPic VARCHAR(50) NOT NULL,
 Statements VARCHAR(70) NOT NULL,
 Points INT DEFAULT 0, 
 OwnerId VARCHAR(30) NOT NULL, 
 PRIMARY KEY (FamilyId), 
 FOREIGN KEY (OwnerId) REFERENCES AppUser(UserId) 
); 

SET IDENTITY_INSERT Family ON
INSERT Family (FamilyId, FamilyName, FamilyPic, Statements,Points,OwnerId) VALUES			
(1, 'ShunYu Family','picture/family1/1.jpg', 'Live peacefully, Give generously  and forgive continually', 0, 'ShunYu'), 			
(2, 'YiKai Family','picture/family2/1.jpg', 'Be kind and be happy!', 0, 'GabrielNeo'), 			
(3, 'HuiYi Family','picture/family3/1.jpg', 'Be thankful, be happy, be grateful and dream big', 0, 'HuiYi'), 			
(4, 'Riski Family','picture/family4/1.jpg', 'We have fun and we always appreciate each other', 0, 'Riski'), 			
(5, 'Percy Family','picture/family5/1.jpg', 'Make happy memories everyday!', 0, 'Percy'), 			
(6, 'JunXing Family','picture/family6/1.jpg', 'Show your love to one another', 0, 'JunXing')
SET IDENTITY_INSERT Family OFF

CREATE TABLE Person ( 
 PersonId UNIQUEIDENTIFIER ,
 ProfilePic VARCHAR(50) NULL, 
 [FirstName]  VARCHAR (50)   NOT NULL,
 [LastName]   VARCHAR (50)   NOT NULL,
 [Email]      VARCHAR (50)   NULL,
 [Gender]     VARCHAR (10)   NULL,
 [BirthDate]  DATE           NULL,
 [CSPersonID] VARCHAR (50)   NULL,
 [UserId]     VARCHAR (30) UNIQUE  NULL,
 PRIMARY KEY (PersonId),
 FOREIGN KEY (UserId) REFERENCES AppUser(UserId) 
); 

INSERT Person(PersonId, FirstName, LastName, Email, Gender, UserId) VALUES			
(NEWID(), 'Shun Yu', 'Choo', 'chooshunyu@gmail.com', 'Male','ShunYu'), 	
(NEWID(), 'Yoon Kuek', 'Choo', 'cyk@gmail.com', 'Male', 'YoonKuek'),
(NEWID(), 'Geok King', 'Neo', 'ngk@gmail.com', 'Female', 'GeokKing'),
(NEWID(), 'Xing Yu', 'Choo', 'cxy@gmail.com', 'Male', 'XingYu'),
(NEWID(), 'Riski', 'Linardi','riskilinardi@gmail.com', 'Male','Riski'), 	
(NEWID(), 'Christina', 'W', 'cw@gmail.com', 'Female', 'Christina'),
(NEWID(), 'Anwar', 'Lie', 'al@gmail.com', 'Male', 'Anwar'),
(NEWID(), 'Amei', 'Lim', 'alim@gmail.com', 'Female', 'Amei'),
(NEWID(), 'Hui Yi', 'Teh', 'thy@gmail.com', 'Female', 'HuiYi'), 	
(NEWID(), 'Eric', 'T', 'et@gmail.com', 'Male', 'Eric'),
(NEWID(), 'Chew Hoon', 'T', 'cht@gmail.com', 'Female', 'ChewHoon'),
(NEWID(), 'Jia Yi', 'T', 'jyt@gmail.com', 'Female', 'JiaYi'),
(NEWID(), 'Gabriel', 'Neo', 'gabneo@gmail.com', 'Male','GabrielNeo'), 	
(NEWID(), 'Yikai1', 'Neo', 'y1@gmail.com', 'Male', 'Yikai1'),
(NEWID(), 'Yikai2', 'Neo', 'y2@gmail.com', 'Female', 'Yikai2'),
(NEWID(), 'Yikai3', 'Neo', 'y3@gmail.com', 'Male', 'Yikai3'),
(NEWID(), 'Xi Jin', 'Chan', 'percy@gmail.com', 'Male','Percy'), 	
(NEWID(), 'Kristy', 'C', 'kc@gmail.com', 'Female', 'Kristy'),
(NEWID(), 'Gary', 'C', 'gc@gmail.com', 'Male', 'Gary'),
(NEWID(), 'Marvin', 'C', 'mc@gmail.com', 'Male', 'Marvin'),
(NEWID(), 'Jun Xing', 'Wong' , 'wjx@gmail.com', 'Male','JunXing'),
(NEWID(), 'KC', 'W', 'wkc@gmail.com', 'Male', 'KC'),
(NEWID(), 'TB', 'W', 'wtb@gmail.com', 'Female', 'TB'),
(NEWID(), 'JY', 'W', 'wjy@gmail.com', 'Male', 'JY')


CREATE TABLE PersonHasFamily ( 
 FamilyId INT NOT NULL,
 PersonId UNIQUEIDENTIFIER,
 Relationship VARCHAR(30) NOT NULL, 
 PRIMARY KEY (FamilyId, PersonId), 
 FOREIGN KEY (PersonId) REFERENCES Person(PersonId),
 FOREIGN KEY (FamilyId) REFERENCES Family(FamilyId)
); 

-- Riski


--CREATE TABLE [dbo].[AppUser] (
--    [UserId]     VARCHAR (30)   NOT NULL,
--    [UserPw]     VARBINARY (50) NOT NULL,
--    [FirstName]  VARCHAR (50)   NOT NULL,
--    [LastName]   VARCHAR (50)   NOT NULL,
--    [Email]      VARCHAR (50)   NULL,
--    [Gender]     VARCHAR (10)   NULL,
--    [BirthDate]  DATE           NULL,
--    [ProfilePic] VARCHAR (50)   NULL,
--    [LastLogin]  DATETIME       DEFAULT (getdate()) NULL,
--    [UserRole]   VARCHAR (20)   NOT NULL,
--    [CSPersonID] VARCHAR (50)   NULL,
--    PRIMARY KEY CLUSTERED ([UserId] ASC)
--);


--INSERT INTO AppUser(UserId, UserPw, FirstName, LastName,  UserRole) VALUES
--('Admin',      HASHBYTES('SHA1','admin'), 'System',   'Manager', 'admin'), 
--('ShunYu',     HASHBYTES('SHA1','A'),     'Shun Yu',  'Choo',    'user'), 
--('GabrielNeo', HASHBYTES('SHA1','A'),     'Gabriel',  'Neo',     'user'), 
--('HuiYi',      HASHBYTES('SHA1','A'),     'Hui Yi',   'Teh',     'user'), 
--('Riski',      HASHBYTES('SHA1','A'),     'Riski',    'Linardi', 'user'), 
--('Percy',      HASHBYTES('SHA1','A'),     'Xi Jin',     'Chan',  'user'), 
--('JunXing',    HASHBYTES('SHA1','A'),     'Jun Xing', 'Wong' ,   'user'), 
--('Jennie',     HASHBYTES('SHA1','A'),     'Jennie',   'Kim',     'user'),
--('Jimmy',      HASHBYTES('SHA1','A'),     'Jimmy',    'Neutron', 'user'),
--('Elsa',       HASHBYTES('SHA1','A'),     'Elsa',     'Bella',   'user'),
--('Irene',      HASHBYTES('SHA1','A'),     'Irene',    'Kim',     'user'),
--('Samuel',     HASHBYTES('SHA1','A'),     'Samuel',   'Tan',     'user'),
--('Daemian',    HASHBYTES('SHA1','A'),     'Daemian',  'Lim',     'user')

--CREATE TABLE Member ( 
-- MemberId UNIQUEIDENTIFIER ,
-- FamilyId INT NOT NULL, 
-- UserId VARCHAR(30), 
-- ProfilePic VARCHAR(50), 
-- Relationship VARCHAR(30), 
-- PRIMARY KEY (MemberId),
-- FOREIGN KEY (FamilyId) REFERENCES Family(FamilyId) 
--); 

		


--INSERT Member(MemberId, FamilyId, UserId, ProfilePic, Relationship) VALUES			
--(NEWID(),1 , 'ShunYu', 'pic', 'Father'), 			
--(NEWID(),1 , 'SY2', 'pic', 'Son'), 			
--(NEWID(),1 , 'SY3', 'pic', 'Mother'), 			
--(NEWID(),2 , 'GabrielNeo', 'pic', 'Son'), 			
--(NEWID(),2 , 'GN2', 'pic', 'Father'), 			
--(NEWID(),2 , 'GN3', 'pic', 'Mother'), 			
--(NEWID(),2 , 'GN4', 'pic', 'Daughter'), 			
--(NEWID(),3 , 'HuiYi', 'pic', 'Mother'), 			
--(NEWID(),3 , 'HY2', 'pic', 'Son'), 			
--(NEWID(),3 , 'HY3', 'pic', 'Father'), 			
--(NEWID(),4 , 'Riski', 'pic', 'Daughter'), 			
--(NEWID(),4 , 'R2', 'pic', 'Daughter'), 			
--(NEWID(),4 , 'R3', 'pic', 'Mother'), 			
--(NEWID(),4 , 'R4', 'pic', 'Father'), 			
--(NEWID(),4 , 'Percy', 'pic', 'Father'), 			
--(NEWID(),4 , 'P2', 'pic', 'Son'), 			
--(NEWID(),4 , 'P3', 'pic', 'Mother'), 			
--(NEWID(),4 , 'P4', 'pic', 'Daughter'), 			
--(NEWID(),4 , 'JunXing', 'pic', 'Son'), 			
--(NEWID(),4 , 'JX2', 'pic', 'Mother'), 			
--(NEWID(),4 , 'JX3', 'pic', 'Daughter'), 			
--(NEWID(),4 , 'JX4', 'pic', 'Father')

--CREATE TABLE Family ( 
-- FamilyId INT IDENTITY(1,1) NOT NULL,
-- FamilyPic VARCHAR(50) NOT NULL,
-- Statements VARCHAR(70) NOT NULL,
-- PointsA INT DEFAULT 0, 
-- PointsB INT DEFAULT 0,
-- PointsC INT DEFAULT 0, 
-- PointsD INT DEFAULT 0,
-- PointsE INT DEFAULT 0,
-- OwnerId VARCHAR(30) NOT NULL, 
-- PRIMARY KEY (FamilyId), 
-- FOREIGN KEY (OwnerId) REFERENCES AppUser(UserId) 
--); 

--SET IDENTITY_INSERT Family ON
--INSERT Family (FamilyId,FamilyPic, Statements,PointsA,PointsB,PointsC,PointsD,PointsE,OwnerId) VALUES			
--(1, 'picture\family1\1', 'Live peacefully, Give generously  and forgive continually', 67, 79, 23, 0, 25, 'Shun Yu'), 			
--(2, 'picture\family2\1', 'Be kind and be happy!', 67, 79, 23, 0, 25, 'Jennie'), 			
--(3, 'picture\family3\1', 'Be thankful, be happy, be grateful and dream big', 35, 2, 43, 0, 0, 'Jimmy'), 			
--(4, 'picture\family4\1', 'We have fun and we always appreciate each other', 7, 37, 0, 0, 54, 'Elsa'), 			
--(5, 'picture\family5\1', 'Make happy memories everyday!', 0, 45, 86, 0, 32, 'Irene'), 			
--(6, 'picture\family6\1', 'Show your love to one another', 32, 0, 6, 63, 0, 'Samuel'), 			
--(7, 'picture\family7\1', 'Our family is forever', 0, 85, 14, 0, 95, 'Daemian')
--SET IDENTITY_INSERT Family OFF




CREATE TABLE Photo (	
 PhotoId	VARCHAR(100) NOT NULL ,
 DateTime	DATETIME,	
 PRIMARY KEY	(photoId)	
);	


INSERT Photo (PhotoId,DateTime) VALUES						
(NEWID(), GETDATE()),						
(NEWID(), GETDATE()),						
(NEWID(), GETDATE())


CREATE TABLE Person_in_Photo(		
 RecogniseId	INT IDENTITY(1,1) NOT NULL,		
 PhotoId	VARCHAR(100) NOT NULL,		
 MemberId	UNIQUEIDENTIFIER,		
 Name	VARCHAR(255) NOT NULL,
 FamilyId INT NOT NULL,
 PRIMARY KEY	(RecogniseId),		
 FOREIGN KEY	(MemberId) REFERENCES Person(PersonId),		
 FOREIGN KEY	(FamilyId) REFERENCES Family(FamilyId)		
);	

--SET IDENTITY_INSERT Person_in_Photo ON
--INSERT Person_in_Photo(RecogniseId,PhotoId,MemberId,Name) VALUES				
--(0,NEWID(),NEWID(),'Shun',1),				
--(1,NEWID(),NEWID(),'Gabriel',2),				
--(2,NEWID(),NEWID(),'Hui Yi',3),				
--(3,NEWID(),NEWID(),'Riski',4)
--SET IDENTITY_INSERT Person_in_Photo OFF

CREATE TABLE Activity( 
 ActID INT NOT NULL,  
 ActName VARCHAR(50) NOT NULL,
 ActDesc VARCHAR(100) NOT NULL,
 ActPoints INT DEFAULT 0, 
 ActPic VARCHAR(50) NOT NULL, 
 PRIMARY KEY (actID)
); 

INSERT Activity(ActID, ActName, ActDesc, ActPoints, ActPic) VALUES				
(1, 'Eating Together', 'Family can eat breakfast, lunch or dinner together.',1, '1.jpg'),			
(2, 'Playing Badminton', 'Family can go to badminton court to play badminton.',2, '2.jpg'),				
(3, 'Family Meeting', 'Family can have a family meeting once a week.',5, '3.jpg'),			
(4, 'Karaoke', 'Family can have a karaoke during weekend.',8, '4.jpg')


CREATE TABLE ActivityDone(
 ActdoneID INT IDENTITY (1, 1) PRIMARY KEY,
 ActID INT NOT NULL, 
 UserId VARCHAR (30)   NOT NULL,
 FOREIGN KEY (ActID) REFERENCES Activity(ActID),
 FOREIGN KEY (UserId) REFERENCES AppUser(UserId)
);

SET IDENTITY_INSERT ActivityDone ON
INSERT ActivityDone(ActDoneID,ActID,UserId) VALUES
(1,1,'HuiYi')
SET IDENTITY_INSERT ActivityDone OFF

CREATE TABLE Achievement ( 
 AchieveID INT, 
 AchieveName VARCHAR(50) NOT NULL, 
 AchievePic VARCHAR(50) NOT NULL, 
 PRIMARY KEY (AchieveID),
);

INSERT Achievement(AchieveID, AchieveName, AchievePic) VALUES					
(1, 'First Activity', 'First.jpg'),					
(2, 'Ten Activities', 'Ten.jpg'),					
(3, '100 Activities', '100.jpg'),					
(4, '50 points', '50points.jpg'),					
(5, '100 points', '100points.jpg'),
(6, '500 points', '500points.jpg'),
(7, '1000 points', '1000points.jpg')

CREATE TABLE Journal ( 
  JournalId INT IDENTITY (1,1) NOT NULL, 
  JournalTitle VARCHAR(100) NOT NULL,
  JournalDescr VARCHAR(300) NOT NULL,
  JournalPic VARCHAR(70) NOT NULL,
  UserId VARCHAR(30)  NOT NULL,
  PRIMARY KEY (JournalId) ,
  FOREIGN KEY (UserId) REFERENCES AppUser(UserId) 
);	

--SET IDENTITY_INSERT Journal ON
--INSERT Journal(JournalId, JournalTitle, JournalDescr, JournalPic, JournalDate) VALUES			
--(1, 'Sunday Brunch', 'Had a great day', '1.jpg', GETDATE()),			
--(2, 'Cycling in the Park', 'Enjoyed my time', '2.jpg', GETDATE()),
--(3, 'Game Night', 'Had a fun time', '3.jpg', GETDATE()),			
--(4, 'Overseas Trip', 'Great trip', '4.jpg', GETDATE())
--SET IDENTITY_INSERT Journal OFF

CREATE TABLE Face (	
 FaceId	UNIQUEIDENTIFIER NOT NULL,	
 PersonId	UNIQUEIDENTIFIER NOT NULL	
 PRIMARY KEY	(FaceID)	
 FOREIGN KEY (PersonId) REFERENCES Person(PersonId) 
);	

CREATE TABLE Quest( 
 QuestID VARCHAR(30) NOT NULL, 
 QuestInfo VARCHAR(50) NOT NULL, 
 QuestTime DATETIME DEFAULT GETDATE(), 
 PRIMARY KEY (QuestID) 
);		

CREATE TABLE Competition(
 ComID INT NOT NULL,
 Username VARCHAR(100) NOT NULL,
 Totalpoints INT NOT NULL,
 PRIMARY KEY (comID)
);

INSERT Competition(ComID, Username, Totalpoints) VALUES 
(1, 'Shun Yu', 250),
(2, 'Gabriel', 500),
(3, 'Hui Yi', 50),
(4, 'Riski', 736),
(5, 'Xi Jin', 60),
(6, 'Jun Xing', 400),
(7, 'Jennie', 150),
(8, 'Jimmy', 2000),
(9, 'Elsa', 1500),
(10, 'Irene', 1346),
(11, 'Samuel', 30),
(12, 'Daemian', 124)

-- Calendar - Riski

CREATE TABLE [dbo].[Events1] (
    [event_id]       INT IDENTITY(1,1) NOT null,
    [title]          VARCHAR (300) NOT NULL,
    [description]    VARCHAR (500)   NOT NULL,
    [event_start]    DATETIME   NOT NULL,
    [event_end]      DATETIME NULL,
    [all_day]        BIT   NOT NULL,
    [UserId]        VARCHAR(30)   NOT NULL,
    PRIMARY KEY ([event_id]),
    FOREIGN KEY (UserId) REFERENCES AppUser(UserId) 
);

-- Calendar - Riski



--=======

CREATE TABLE TestForNodeRed (	
 test_id	INT IDENTITY(1,1) NOT NULL ,
 datas      VARCHAR(300) NOT NULL,	
 PRIMARY KEY	(test_id)	
);	
-->>>>>>> 7180acc601aed84fe0872d6ede1710de4183cb2a

CREATE TABLE Emotion ( 
 EmotionId INT IDENTITY(1,1) NOT NULL, 
 PictureFileName VARCHAR(100) NOT NULL, 
 TimeTaken DATE NOT NULL, 
 anger FLOAT NOT NULL,
 contempt FLOAT NOT NULL,
 disgust FLOAT NOT NULL,
 fear FLOAT NOT NULL,
 happiness FLOAT NOT NULL,
 neutral FLOAT NOT NULL,
 sadness FLOAT NOT NULL,
 surprise FLOAT NOT NULL,
 FaceId UNIQUEIDENTIFIER NOT NULL
 PRIMARY KEY (EmotionId) 
 FOREIGN KEY (FaceId) REFERENCES Face(FaceId) 
 ); 
