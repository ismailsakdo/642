# Chapter 5 Masterclass: The Language of the Vault (SQL)

## The Introduction: The Mindset Shift
*(Say this to your class to set the stage)*

> "In Week 4, you were **Architects**. You looked at a messy spreadsheet and mathematically separated it into clean, protected tables. You designed a 'Vault.'
>
> But a vault is useless if you cannot put things inside it, or ask what is inside it. Today, in Week 5, you become **Commanders**. You are going to learn **SQL (Structured Query Language)**.
>
> SQL is not 'coding' like building a website. SQL is a direct language used to talk to a database. It is how Amazon tracks inventory, it is how Maybank tracks your balance, and today, it is how we will control our Pine Valley Furniture database in AwardSpace."

---

## PHASE 1: Preparing the Battlefield (AwardSpace)
Before we type any code, students must know where to type it.

1.  Log into **AwardSpace**.
2.  Open **Database Manager** -> Click **phpMyAdmin**.
3.  On the left side, click the database name (e.g., `12345_pvf`).
4.  Click the **SQL** tab at the top.

> "This white box is your **Command Center**. Whenever you write SQL here and click 'Go', the server obeys."

---

## PHASE 2: DDL (Data Definition Language) - Building the Walls
**The MBA Lesson:** Before we can store data, we must build the physical structure. In Excel, you just open a file and start typing. That is why Excel is weak. In SQL, we must create a **Strict Digital Contract** using DDL.

### Step 1: Creating the Product Table
Have students copy and paste this into the SQL tab:

```sql
CREATE TABLE TBL_PRODUCT (
    ProductID VARCHAR(10) NOT NULL,
    ProductDescription VARCHAR(100) NOT NULL,
    ProductFinish VARCHAR(50),
    ProductPrice DECIMAL(10,2),
    PRIMARY KEY (ProductID)
);
```

**TEACH SLOWLY - Line-by-Line Breakdown:**
* **CREATE TABLE TBL_PRODUCT:** Commanding the server to build a new container.
* **VARCHAR(10):** "Variable Character" (Text). The (10) means it cannot be longer than 10 letters to save server memory.
* **NOT NULL:** **Crucial Business Rule.** This forces the system to reject any product that doesn't have an ID or Description. No blank data is allowed.
* **DECIMAL(10,2):** **Domain Integrity.** Numbers only, up to 10 digits, with exactly 2 decimal places for cents (e.g., 150.50). You cannot accidentally type "One Hundred" here.
* **PRIMARY KEY (ProductID):** **Entity Integrity.** This tells the database that `ProductID` is the absolute unique fingerprint of the row.

*(Have them click **Go** to create the table)*

---

## PHASE 3: DML (Data Manipulation Language) - Moving the Boxes
**The MBA Lesson:** The warehouse is built, but it is empty. DML is how we run the daily business—inserting new data, updating old data, and deleting bad data.

### Step 2: Stocking the Warehouse (INSERT)
Paste this into the SQL Tab to add the first piece of furniture:

```sql
INSERT INTO TBL_PRODUCT (ProductID, ProductDescription, ProductFinish, ProductPrice) 
VALUES ('P-101', 'Executive Leather Chair', 'Black Leather', 850.00);
```

**TEACH SLOWLY:**
* **INSERT INTO:** The command to add a row.
* **The first bracket ():** Lists the columns exactly as we built them.
* **VALUES:** Tells the database, "Here is the data."
* **The second bracket ():** The actual data. Notice that **text** is in 'Single Quotes', but **numbers** are not.

**Insert multiple items at once to save time:**

```sql
INSERT INTO TBL_PRODUCT (ProductID, ProductDescription, ProductFinish, ProductPrice) 
VALUES 
('P-102', 'Meeting Table', 'Oak', 2500.00),
('P-103', 'Filing Cabinet', 'Steel', 350.00),
('P-104', 'Guest Chair', 'Oak', 200.00);
```

### Step 3: The Spreadsheet Killer (UPDATE)
**The Scenario:** The price of 'Oak' wood just doubled. The CEO needs all Oak products to be priced at **RM 3000**.

* **In Excel:** You scroll through 10,000 rows, find every Oak item, and retype the price. You make mistakes.
* **In SQL:** One command.

```sql
UPDATE TBL_PRODUCT 
SET ProductPrice = 3000.00 
WHERE ProductFinish = 'Oak';
```

**TEACH SLOWLY:**
* **UPDATE:** What table are we changing?
* **SET:** What is the new value?
* **WHERE:** **The Safety Net.** If you forget the `WHERE` clause, you will change the price of every item in the entire company to RM 3000. This targets only 'Oak'.

### Step 4: Removing Assets (DELETE)
**The Scenario:** We are no longer selling the 'Steel Filing Cabinet' (P-103).

```sql
DELETE FROM TBL_PRODUCT 
WHERE ProductID = 'P-103';
```
*(Run this. The item is permanently removed).*

---

## PHASE 4: DQL (Data Query Language) - The CEO's Interrogation
**The MBA Lesson:** The CEO does not want to see the whole database. They want specific **Business Intelligence**. DQL (using `SELECT`) is how we ask the vault questions.

### Step 5: Writing the Queries in AwardSpace
**The Scenario:** The CEO says: *"Show me a list of all products that cost more than RM 500. I only want to see the Description and the Price. Put the most expensive item at the top."*

```sql
SELECT ProductDescription, ProductPrice 
FROM TBL_PRODUCT 
WHERE ProductPrice > 500 
ORDER BY ProductPrice DESC;
```

**TEACH SLOWLY:**
* **SELECT:** What columns do you want to show the CEO?
* **FROM:** Where is the data?
* **WHERE:** What is the business filter? (Greater than 500).
* **ORDER BY ... DESC:** Sort it Descending (Highest to Lowest).

---

## The Grand Conclusion: Connecting to AppSheet Projects
*(The "Aha!" Moment)*

"Look at the `SELECT` query you just wrote. 

Two weeks ago in AppSheet, you clicked a button called **'Create Slice'**, and you typed `[Price] > 500`. AppSheet magically created a new view for you.

**Do you know what happened behind the scenes?** AppSheet’s server wrote this exact SQL query and sent it to Google's database.

As an MBA, you no longer have to rely on 'No-Code' buttons to do the work for you. You now understand the root language of how all software on Earth handles data. **You can now talk directly to the vault.**"
```
