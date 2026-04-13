# The Real-World Application: SQL as a Management Skill

To teach your MBA students how to apply this in the "real world," you must shift their perspective completely.

> "SQL is not an IT skill. SQL is a Management Skill."

When they graduate, they likely won't be typing SQL into AwardSpace every day. However, they will be buying, managing, or auditing enterprise software (like SAP, Salesforce, or custom AppSheet apps). If they do not understand the SQL engine running underneath, software vendors will overcharge them, and their IT departments will blind them with technical jargon.

Here are three real-world industry scenarios you can use in class to prove exactly how the Week 5 commands (`INSERT`, `UPDATE`, `SELECT`, `JOIN`) drive global business.

---

## Scenario 1: E-Commerce & Supply Chain (Shopee / Amazon)

**The Business Problem:** Preventing "Ghost Sales" (selling an item that is out of stock).

**The Real-World SQL:**
When a customer clicks the "Checkout" button, the website doesn't just send an email. The website executes a rapid chain of SQL commands:

1. **The Check (`SELECT`):** Is it actually in the warehouse?
   ```sql
   SELECT Stock_Level FROM Inventory WHERE ProductID = 'P-101';
   ```
2. **The Sale (`INSERT`):** Record the transaction.
   ```sql
   INSERT INTO Orders (CustomerID, ProductID) VALUES ('C-55', 'P-101');
   ```
3. **The Adjustment (`UPDATE`):** Remove it from the shelf digitally.
   ```sql
   UPDATE Inventory SET Stock_Level = Stock_Level - 1 WHERE ProductID = 'P-101';
   ```

**The MBA Lesson:** This entire transaction takes 0.05 seconds. If the database is not strictly normalized (Week 4), or if the `UPDATE` command fails, the company sells inventory it doesn't have, leading to catastrophic customer anger and refund costs.

---

## Scenario 2: Healthcare & Public Safety (The Poison Centre Context)

**The Business Problem:** Identifying an outbreak of chemical exposure in a specific district.

**The Real-World SQL:**
A Director needs to know if resources should be sent to Penang or Kedah. They look at a heat map dashboard. Behind that heat map is a `GROUP BY` query:

```sql
SELECT District, COUNT(Patient_ID) 
FROM Incidents 
GROUP BY District 
ORDER BY COUNT(Patient_ID) DESC;
```

**The MBA Lesson:** The dashboard is just a pretty picture. The SQL query is what actually counts the cases, categorizes them by geography, and ranks them. Data saves lives, but only if you can query it fast enough.

---

## Scenario 3: Human Resources & Payroll

**The Business Problem:** Calculating year-end commission bonuses fairly and without error.

**The Real-World SQL:**
The HR system must combine the Employee's base salary with their total sales. This requires pulling data from two entirely different departments.

```sql
SELECT Employee.Name, SUM(Sales.Amount) * 0.10 AS Bonus
FROM Employee 
INNER JOIN Sales ON Employee.ID = Sales.Employee_ID
GROUP BY Employee.Name;
```

**The MBA Lesson:** Before Relational Databases, a human accountant had to cross-reference two separate spreadsheets with a ruler and a calculator. Now, an `INNER JOIN` automates payroll for 10,000 employees instantly.
```
