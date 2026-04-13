# Chapter 5: The Language of the Vault (SQL Masterclass)

## 🎯 The Mindset Shift
> "In Week 4, you were **Architects**. You designed a 'Vault.' Today, you become **Commanders**. You are going to learn **SQL (Structured Query Language)**."

SQL is not "coding" in the traditional sense; it is a direct language used to talk to a database. It is the engine behind Amazon’s inventory, Maybank’s balances, and your Pine Valley Furniture (PVF) database.

---

## PHASE 1: Preparing the Battlefield (AwardSpace)
Before we command, we must enter the **Command Center**.

1. Log into **AwardSpace**.
2. Open **Database Manager** -> Click **phpMyAdmin**.
3. On the left sidebar, select your database (e.g., `12345_pvf`).
4. Click the **SQL** tab at the top. 

*This white box is your Command Center. Whenever you write SQL here and click 'Go', the server obeys.*

---

## PHASE 2: DDL (Data Definition Language) - Building the Walls
In SQL, we must create a **Strict Digital Contract** before we can store data.

### Step 1: Creating the Product Table
Paste the following into your SQL tab:

```sql
CREATE TABLE TBL_PRODUCT (
    ProductID VARCHAR(10) NOT NULL,
    ProductDescription VARCHAR(100) NOT NULL,
    ProductFinish VARCHAR(50),
    ProductPrice DECIMAL(10,2),
    PRIMARY KEY (ProductID)
);
