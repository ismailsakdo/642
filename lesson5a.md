THE MASTERCLASS EXTENSION: BUSINESS INTELLIGENCE IN SQL
LEVEL 1: Aggregate Functions – "The CFO's Calculator"
The MBA Lesson: In Excel, you highlight a column and look at the bottom right corner to see the "Sum." But what if you have 5 million rows? Excel will freeze and crash. SQL handles millions of rows in milliseconds using Aggregate Functions.

The AwardSpace Activity: The Financial Audit
The Scenario: "The CFO needs to know the total value of all the furniture we have in the system right now. Are we holding too much expensive inventory?"

The Command:
Go to the SQL Tab in AwardSpace and run this:

SQL
SELECT SUM(ProductPrice) AS Total_Inventory_Value
FROM TBL_PRODUCT;
TEACH SLOWLY — Breakdown:

SUM(...): This is the calculator. It adds up every number in that column.

AS Total_Inventory_Value: This is an Alias. It is a "nickname" for the column. Without it, the CEO's report will just have a column named SUM(ProductPrice), which looks unprofessional. We use AS to make the output look like a polished corporate report.

Other Executive Calculators:

AVG(ProductPrice): Find the average price of our furniture.

COUNT(ProductID): Count exactly how many unique items we sell.

MAX(ProductPrice): Find the single most expensive item in the vault.

LEVEL 2: The GROUP BY Clause – "The SQL Pivot Table"
The MBA Lesson: SUM() is great, but it only gives you one giant number. Usually, executives want to compare categories. In Excel, you build a "Pivot Table." In SQL, we use GROUP BY.

The AwardSpace Activity: The Category Breakdown
The Scenario: "The Marketing Director asks: 'How many items do we sell in each type of wood finish? Are we making too many Oak products compared to Leather?'"

The Command:

SQL
SELECT ProductFinish, COUNT(ProductID) AS Number_Of_Items
FROM TBL_PRODUCT
GROUP BY ProductFinish;
TEACH SLOWLY — Breakdown:

The Logic: We are asking the database to take all the furniture, put them into "buckets" based on their finish (Oak, Leather, Steel), and then COUNT how many items are in each bucket.

The Rule of Group By: "If you select a normal column (like ProductFinish) AND a calculator column (like COUNT), you MUST put the normal column in the GROUP BY clause. Otherwise, the database doesn't know how to organize the math."

LEVEL 3: The JOIN Command – "The Master Architect"
The MBA Lesson: Remember Week 4? We purposely broke our data apart to keep it safe (Normalization). We separated TBL_PRODUCT from TBL_ORDERLINE. But the CEO cannot read a report full of ID numbers like P-101. The CEO wants to see English words. JOIN is how we stitch the database back together for human eyes.

The AwardSpace Activity: The Unified Sales Report
The Scenario: "We need a report that shows exactly what was ordered. We need the Order ID (from the Order table) AND the Product Name (from the Product table) sitting side-by-side."

The Command:

SQL
SELECT TBL_ORDERLINE.OrderID, TBL_PRODUCT.ProductDescription, TBL_ORDERLINE.OrderedQuantity
FROM TBL_ORDERLINE
INNER JOIN TBL_PRODUCT ON TBL_ORDERLINE.ProductID = TBL_PRODUCT.ProductID;
TEACH SLOWLY — Breakdown:

SELECT TableName.ColumnName: Because we are pulling from two tables, we must specify the "Last Name" (Table) and "First Name" (Column) so the database doesn't get confused.

FROM TBL_ORDERLINE: We start with the transactions.

INNER JOIN TBL_PRODUCT: We tell the database to bring the Product table into the room.

ON ... = ...: This is the Golden Key. This tells the database how to stitch them together. We are matching the Foreign Key in the Order table to the Primary Key in the Product table.

LEVEL 4: The VIEW – "The Executive Shortcut"
The MBA Lesson: That JOIN query was long and hard to type. If the CEO asks for that report every single morning, you do not want to type 4 lines of complex SQL every day. We can save the query as a Virtual Table called a VIEW.

The AwardSpace Activity: Creating the Daily Dashboard
The Command:

SQL
CREATE VIEW CEO_Daily_Report AS
SELECT TBL_ORDERLINE.OrderID, TBL_PRODUCT.ProductDescription, TBL_ORDERLINE.OrderedQuantity
FROM TBL_ORDERLINE
INNER JOIN TBL_PRODUCT ON TBL_ORDERLINE.ProductID = TBL_PRODUCT.ProductID;
TEACH SLOWLY — Breakdown:

Observe: "It looks like nothing happened. But look at the left sidebar in phpMyAdmin. A new item called CEO_Daily_Report just appeared with a different icon."

The Shortcut: Now, have them run this simple query:

SQL
SELECT * FROM CEO_Daily_Report;
The Revelation: The massive JOIN query runs automatically!

The Executive Value: "You can give your web developers or AppSheet apps access to this VIEW. They don't need to know how to write complex SQL Joins. You have abstracted the complexity away."

🏁 End of Week 5 Summary
"Today, you completed the journey from a spreadsheet user to a Database Architect.

You learned how to build the foundation (CREATE TABLE), run the operations (INSERT, UPDATE), ask intelligent business questions (SELECT, GROUP BY), and finally, stitch the whole company together (JOIN).

The database is no longer a black box. You have the keys. You speak the language of the vault."
