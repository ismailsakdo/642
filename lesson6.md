# 🚀 WEEK 6 MASTERCLASS: The Analytical Engine & Business Intelligence in SQL
**Course:** AGE 642/3 - Modern Database Management (Universiti Sains Malaysia)  
**Environment:** AwardSpace (`phpMyAdmin`)  
**Duration:** 3 Hours  
**Focus:** Database Management, Manipulating Multiple Tables (JOINs), and Executive Decision Making.

---

## 🧭 Executive Summary: The Mindset Shift
Welcome to Week 6. Up until now, we have treated databases as **Digital Filing Cabinets**. In Week 4, you learned how to build the cabinet (Normalization). In Week 5, you learned how to put files in and take them out (Basic SQL). 

Today, we stop doing clerical work. Today, the database becomes a **Strategic Weapon**. 

In real-world business, data is never stored in one place. *Marketing* owns the Customer data. *Supply Chain* owns the Product data. *Finance* owns the Sales data. If a CEO asks, *"Which marketing campaign generated the most profitable product sales?"* no single department can answer. 

**Your role today is the Chief Data Officer.** You will use Advanced SQL to build bridges across these isolated departments, manipulating multiple tables simultaneously to expose hidden business truths.

---

## ⏳ HOUR 1: The Architecture of Intelligence (Database Management)

### 1.1 The "Silo" Problem
In corporate environments, "Data Silos" occur when departments refuse to share information. 
* **The Spreadsheet Reality:** When data is siloed in Excel, an analyst must spend 3 weeks doing `VLOOKUPs` to cross-reference customer names with product orders. By the time the report is done, the data is useless.
* **The Relational Reality:** Because we mathematically separated our data in Week 4 (Entity Integrity), we can use SQL to stitch it back together dynamically in 0.05 seconds. 

### 1.2 The Master Analogy: The "Corporate Merger"
Think of a SQL `JOIN` command as a corporate merger between two departments.
* **Table A (Sales):** Knows *that* a transaction happened, but only knows the `CustomerID` (e.g., C-99). It doesn't know who the person is.
* **Table B (CRM):** Knows *who* C-99 is (Syazwan Aizat), but doesn't know what he bought.
* **The `JOIN`:** The database acts as the CEO, forcing the two departments into a meeting room, matching the IDs, and producing a unified report.

### 1.3 AwardSpace Lab 1: Building the Mega-Corp Database
*Instructor Note: Have students log into AwardSpace, open the `SQL` tab, and run the following script to prepare for today's masterclass.*

```sql
-- STEP 1: CREATE THE MASTER TABLES (The Departments)

-- The HR Department (Who is selling?)
CREATE TABLE HR_SALES_REPS (
    RepID VARCHAR(10) PRIMARY KEY,
    RepName VARCHAR(50),
    Region VARCHAR(50)
);

-- The Supply Chain Department (What are we selling?)
CREATE TABLE SC_PRODUCTS (
    ProductID VARCHAR(10) PRIMARY KEY,
    ProductName VARCHAR(50),
    CostToManufacture DECIMAL(10,2),
    RetailPrice DECIMAL(10,2)
);

-- The Finance Department (The Transactions)
CREATE TABLE FIN_TRANSACTIONS (
    TransactionID VARCHAR(10) PRIMARY KEY,
    RepID VARCHAR(10),
    ProductID VARCHAR(10),
    UnitsSold INT,
    ActualSalePrice DECIMAL(10,2),
    FOREIGN KEY (RepID) REFERENCES HR_SALES_REPS(RepID),
    FOREIGN KEY (ProductID) REFERENCES SC_PRODUCTS(ProductID)
);
```

```sql
-- STEP 2: POPULATE THE DEPARTMENTS WITH REAL DATA

INSERT INTO HR_SALES_REPS VALUES 
('R-01', 'Ahmad Faizal', 'North'),
('R-02', 'Sarah Lee', 'South'),
('R-03', 'John Doe', 'East');

INSERT INTO SC_PRODUCTS VALUES 
('P-100', 'Ergonomic Chair', 150.00, 450.00),
('P-200', 'Standing Desk', 300.00, 800.00),
('P-300', 'Monitor Arm', 50.00, 150.00),
('P-400', 'Dead Stock Lamp', 20.00, 80.00);

INSERT INTO FIN_TRANSACTIONS VALUES 
('T-001', 'R-01', 'P-100', 5, 450.00),
('T-002', 'R-02', 'P-200', 2, 800.00),
('T-003', 'R-01', 'P-300', 10, 150.00),
-- ROGUE TRANSACTIONS (Discounted heavily below retail)
('T-004', 'R-02', 'P-100', 20, 100.00), 
('T-005', 'R-03', 'P-200', 5, 200.00);
```

---

## ⏳ HOUR 2: The Art of the JOIN (SQL Skills)

Now that the data is loaded, we must extract Business Intelligence.

### 2.1 The `INNER JOIN` (The Perfect Match)
An `INNER JOIN` only shows data where the two departments agree perfectly. 

**The Business Question:** *"I want a unified list showing exactly which Sales Rep sold which Product."*

**The AwardSpace Execution:**
```sql
SELECT 
    FIN_TRANSACTIONS.TransactionID,
    HR_SALES_REPS.RepName,
    SC_PRODUCTS.ProductName,
    FIN_TRANSACTIONS.UnitsSold
FROM FIN_TRANSACTIONS
INNER JOIN HR_SALES_REPS ON FIN_TRANSACTIONS.RepID = HR_SALES_REPS.RepID
INNER JOIN SC_PRODUCTS ON FIN_TRANSACTIONS.ProductID = SC_PRODUCTS.ProductID;
```
**The Executive Logic:** Look closely at the `ON` statement. This is the **Bridge**. We are telling the database: *"Only connect these tables where the ID in Finance exactly matches the ID in HR."* Notice we just did a **3-Table Join**. We connected three isolated departments into one dashboard.

### 2.2 The Mathematical Join (Dynamic BI)
A CEO does not just want to see raw numbers; they want to see **Calculated Metrics** like Profit.

**The Business Question:** *"How much total revenue did each transaction generate?"*

**The AwardSpace Execution:**
```sql
SELECT 
    FIN_TRANSACTIONS.TransactionID,
    SC_PRODUCTS.ProductName,
    (FIN_TRANSACTIONS.UnitsSold * FIN_TRANSACTIONS.ActualSalePrice) AS Total_Revenue
FROM FIN_TRANSACTIONS
INNER JOIN SC_PRODUCTS ON FIN_TRANSACTIONS.ProductID = SC_PRODUCTS.ProductID;
```
**The Executive Logic:** SQL is a calculator. By placing `(UnitsSold * ActualSalePrice)` in the `SELECT` statement, we created a brand-new column of data that *does not physically exist* in the database. We generated it on the fly.

### 2.3 The `LEFT OUTER JOIN` (The Audit of Failures)
`INNER JOIN` is great for finding successes. But business is about fixing failures. 

**The Business Question:** *"Which products are sitting in our warehouse that have NEVER been sold?"*

If we use an `INNER JOIN`, the unsold products will be invisible because they have no matching transaction! We must use a `LEFT JOIN`.

**The AwardSpace Execution:**
```sql
SELECT 
    SC_PRODUCTS.ProductName,
    FIN_TRANSACTIONS.TransactionID
FROM SC_PRODUCTS
LEFT JOIN FIN_TRANSACTIONS ON SC_PRODUCTS.ProductID = FIN_TRANSACTIONS.ProductID
WHERE FIN_TRANSACTIONS.TransactionID IS NULL;
```
**The Executive Logic:** `LEFT JOIN` means: *"Show me absolutely everything in the Supply Chain table (The Left Side), even if Finance has no record of it."* The `WHERE ... IS NULL` command isolates the failure. When you run this, AwardSpace will instantly reveal the **'Dead Stock Lamp'**.

---

## ⏳ HOUR 3: The Capstone Case Study (The Margin Crisis)

*Instructor Note: Do not give the students the answers immediately. Give them the scenario and force them to write the SQL logic based on Hour 1 and Hour 2.*

### 🏢 The Scenario: "The Pine Valley Profit Bleed"
The Board of Directors has called an emergency meeting. Sales volumes are up 200%, but the company's bank account is dropping. The CFO suspects that the Sales Team is offering massive, unauthorized discounts just to hit their volume quotas.

**Your Mission:** Use AwardSpace to audit the database, find the financial leak, identify the rogue employees, and report to the Board.

---

### 🚨 Phase 1: The Loss Detection (Filter & Math)
**Objective:** Find any transaction where the `ActualSalePrice` was LOWER than the `CostToManufacture`.

**The SQL Solution:**
```sql
SELECT 
    FIN_TRANSACTIONS.TransactionID,
    SC_PRODUCTS.ProductName,
    SC_PRODUCTS.CostToManufacture,
    FIN_TRANSACTIONS.ActualSalePrice,
    (FIN_TRANSACTIONS.ActualSalePrice - SC_PRODUCTS.CostToManufacture) AS Financial_Loss
FROM FIN_TRANSACTIONS
INNER JOIN SC_PRODUCTS ON FIN_TRANSACTIONS.ProductID = SC_PRODUCTS.ProductID
WHERE FIN_TRANSACTIONS.ActualSalePrice < SC_PRODUCTS.CostToManufacture;
```
*Business Outcome:* You have successfully proved that transactions T-004 and T-005 were sold at a massive loss.

---

### 🚨 Phase 2: The Culprit Identification (3-Table Investigation)
**Objective:** The Board wants names. Which Sales Reps authorized those exact loss-making transactions, and what Region are they from?

**The SQL Solution:**
```sql
SELECT 
    HR_SALES_REPS.RepName,
    HR_SALES_REPS.Region,
    SC_PRODUCTS.ProductName,
    FIN_TRANSACTIONS.ActualSalePrice
FROM FIN_TRANSACTIONS
INNER JOIN SC_PRODUCTS ON FIN_TRANSACTIONS.ProductID = SC_PRODUCTS.ProductID
INNER JOIN HR_SALES_REPS ON FIN_TRANSACTIONS.RepID = HR_SALES_REPS.RepID
WHERE FIN_TRANSACTIONS.ActualSalePrice < SC_PRODUCTS.CostToManufacture;
```
*Business Outcome:* AwardSpace reveals that **Sarah Lee (South)** and **John Doe (East)** are the employees bleeding the company dry.

---

### 🚨 Phase 3: The Board Dashboard (Automation via VIEW)
**Objective:** The CEO doesn't know how to write SQL. Save the results of Phase 2 as a permanent "Dashboard" so the CEO can double-click it every morning to monitor rogue sales.

**The SQL Solution:**
```sql
CREATE VIEW CEO_Rogue_Sales_Dashboard AS
SELECT 
    HR_SALES_REPS.RepName,
    SC_PRODUCTS.ProductName,
    FIN_TRANSACTIONS.ActualSalePrice
FROM FIN_TRANSACTIONS
INNER JOIN SC_PRODUCTS ON FIN_TRANSACTIONS.ProductID = SC_PRODUCTS.ProductID
INNER JOIN HR_SALES_REPS ON FIN_TRANSACTIONS.RepID = HR_SALES_REPS.RepID
WHERE FIN_TRANSACTIONS.ActualSalePrice < SC_PRODUCTS.CostToManufacture;
```
*Business Outcome:* Check the left sidebar in `phpMyAdmin`. A new "Virtual Table" has appeared. You have just built a BI Dashboard without touching any front-end code.

---

## 🏆 Conclusion: The ROI of SQL
*Instructor Note: Read this to close the class.*

> "If Pine Valley Furniture relied on spreadsheets, they would have gone bankrupt before the analysts finished their VLOOKUPs. 
> 
> Because they had a Normalized Database (Week 4), and a CDO who understood advanced JOINs (Week 6), you caught corporate fraud in 3 lines of code. 
> 
> When you leave this MBA program and hire developers, or buy software like SAP or Salesforce, you now know exactly what is happening under the hood. You know how to demand data integrity, and you know how to interrogate it."

***

*(End of GitHub Markdown file)*

---

### 💡 Interactive Lecturer Tool (For your Live Presentation)

To help your students visualize the complex 3-table join in **Phase 2**, you can use this interactive widget on your screen during the lecture before they type the code.

[Direct Text Answer] Let's look at how isolated tables combine to form a Business Intelligence report.
[Explanation of Method] Use this interactive visualizer on your projector to show students how the "Primary Key" and "Foreign Key" act as the actual bridge connecting the HR, Supply Chain, and Finance departments.

```json?chameleon
{"component":"LlmGeneratedComponent","props":{"height":"750px","prompt":"Create an interactive '3-Table Corporate JOIN Visualizer' for an MBA database class.\n\nObjective: Visually demonstrate how a 3-table INNER JOIN stitches departments together to solve a Case Study.\n\nInitial State:\nDisplay three distinct 'Siloed' tables:\n1. HR_TABLE: [RepID: R2, Name: Sarah]\n2. SC_TABLE: [ProdID: P1, Name: Desk, Cost: $300]\n3. FIN_TABLE: [TransID: T4, RepID: R2, ProdID: P1, SoldPrice: $100]\n\nControls:\nA step-by-step 'Investigation' button timeline:\n- Step 1: 'Start in Finance (The Transaction)'\n- Step 2: 'JOIN Supply Chain (Find the Product)'\n- Step 3: 'JOIN HR (Find the Culprit)'\n\nBehavior:\n- Step 1: Highlight the FIN_TABLE. Show the base SELECT query below.\n- Step 2: Animate a visual line connecting FIN_TABLE.ProdID to SC_TABLE.ProdID. Generate a 'Temporary View' showing [TransID, ProdName, SoldPrice]. Update the SQL block to show the first INNER JOIN.\n- Step 3: Animate a line connecting FIN_TABLE.RepID to HR_TABLE.RepID. Generate the 'Final Executive Dashboard' showing [Name, ProdName, Cost, SoldPrice]. Highlight the $100 SoldPrice in red (since it's below the $300 cost). Update the SQL block to show the full 3-table INNER JOIN.\n\nVisuals: Corporate, clean, dashboard-style UI. Use distinct colors for each department (e.g., HR=Blue, SC=Green, FIN=Orange) to show how the final table is a hybrid of all three.","id":"im_6825d2770956358c"}}
```
