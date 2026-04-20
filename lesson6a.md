***

# 📈 ADVANCED LAB: Macro-Analytics & Statistical SQL (DOSM Integration)
**Course:** AGE 642/3 - Modern Database Management  
**Environment:** AwardSpace (`phpMyAdmin`) & DOSM Open Data  
**Duration:** 3 Hours  
**Focus:** ETL (Extract, Transform, Load), Statistical SQL Functions, and Macro-Economic Strategy.

---

## 🧭 Executive Summary: The "Macro-Compass"
Until now, our database has been a closed loop. We only analyzed what Pine Valley Furniture (PVF) sold. But what if the CEO asks: *"Where should we open our next physical store in Malaysia?"* Internal sales data cannot answer this. You need external **Macro-Economic Data** (Population density, average income, unemployment rates). 

Today, you will act as a **Data Scientist**. You will perform an **ETL (Extract, Transform, Load)** pipeline. You will take external open data from the Malaysian government (DOSM), load it into your AwardSpace vault, run statistical analysis (Averages, Variances, Standard Deviations) using SQL, and merge it with internal PVF data to dictate business strategy.

---

## ⏳ HOUR 1: The ETL Pipeline (External Data Ingestion)

### 1.1 The Concept: What is ETL?
In enterprise data architecture, you cannot just "copy and paste" the internet into your database.
* **Extract:** Pulling raw `.csv` (Comma Separated Values) data from external APIs or open portals like `data.gov.my`.
* **Transform:** Cleaning the data (removing nulls, fixing data types so AwardSpace accepts it).
* **Load:** Pushing it into the MySQL Server.

### 1.2 The DOSM Case Study Data
For this lab, we have simulated an extraction from the **DOSM Open Data Portal** regarding State Demographics and Economics (2025 projections). 

*Instructor Note: In AwardSpace, students can use the "Import" tab to upload a CSV. However, to ensure 100% success in the classroom, have them run this DDL/DML script which perfectly mimics the loaded DOSM data.*

**AwardSpace Lab: Load External Data**
*Copy and paste this into the AwardSpace SQL tab.*

```sql
-- STEP 1: CREATE THE EXTERNAL DOSM TABLE
CREATE TABLE DOSM_STATE_DATA (
    StateCode VARCHAR(5) PRIMARY KEY,
    StateName VARCHAR(50),
    Population_Millions DECIMAL(5,2),
    Avg_Household_Income DECIMAL(10,2),
    Unemployment_Rate DECIMAL(5,2)
);

-- STEP 2: LOAD THE MALAYSIAN MACRO DATA
INSERT INTO DOSM_STATE_DATA VALUES 
('SGR', 'Selangor', 7.00, 10800.00, 2.50),
('KUL', 'Kuala Lumpur', 1.80, 13000.00, 3.10),
('PNG', 'Penang', 1.77, 8500.00, 2.80),
('JHR', 'Johor', 4.00, 8000.00, 3.00),
('PRK', 'Perak', 2.50, 5500.00, 4.20),
('KLT', 'Kelantan', 1.90, 4000.00, 4.80);

-- STEP 3: CREATE INTERNAL PVF REGIONAL SALES DATA
CREATE TABLE PVF_REGIONAL_SALES (
    BranchID VARCHAR(5) PRIMARY KEY,
    StateCode VARCHAR(5),
    Yearly_Revenue DECIMAL(15,2),
    FOREIGN KEY (StateCode) REFERENCES DOSM_STATE_DATA(StateCode)
);

INSERT INTO PVF_REGIONAL_SALES VALUES 
('B-01', 'SGR', 5500000.00),
('B-02', 'KUL', 4200000.00),
('B-03', 'PNG', 3100000.00),
('B-04', 'JHR', 2800000.00);
-- Notice: We have no branches in Perak or Kelantan yet.
```

---

## ⏳ HOUR 2: Statistical Analysis in SQL

**The MBA Lesson:** SQL is not just a filtering tool; it is a statistical engine. When dealing with macro-economics, you don't look at single rows. You look at distributions. 

### 2.1 Descriptive Statistics (The Baseline)
The CEO asks: *"What is the economic baseline of our country right now?"*

Instead of exporting to SPSS or Excel, we run the statistics directly in AwardSpace.

**The AwardSpace Execution:**
```sql
SELECT 
    COUNT(StateCode) AS Total_States_Analyzed,
    ROUND(AVG(Avg_Household_Income), 2) AS National_Average_Income,
    MAX(Unemployment_Rate) AS Highest_Unemployment,
    MIN(Unemployment_Rate) AS Lowest_Unemployment
FROM DOSM_STATE_DATA;
```
*Business Lesson:* The `ROUND(..., 2)` function is crucial for financial reporting. You just generated a national economic summary in 0.01 seconds.

### 2.2 Volatility and Risk (`STDDEV` & `VARIANCE`)
The CEO asks: *"How severe is the income inequality across the states we are analyzing? Is it a stable market?"*

**The AwardSpace Execution:**
```sql
SELECT 
    ROUND(VARIANCE(Avg_Household_Income), 2) AS Income_Variance,
    ROUND(STDDEV(Avg_Household_Income), 2) AS Income_Standard_Deviation
FROM DOSM_STATE_DATA;
```
*Business Lesson:* **Standard Deviation (`STDDEV`)** in SQL calculates the dispersion of data. A high standard deviation means extreme inequality between states. If Pine Valley Furniture sells luxury desks, a high STDDEV means you must target specific wealthy states, not the whole country.

---

## ⏳ HOUR 3: The Analytics Capstone (Data-Driven Strategy)

This is the ultimate test of an MBA Data Analyst. We must merge the external DOSM data with internal PVF Sales data to dictate Corporate Strategy.

### 🏢 Case Study: The Expansion Dilemma
The Board of Directors has RM 5,000,000 to open one new mega-branch. 
They ask you two questions:
1. **Market Penetration:** In the states where we currently operate, are we under-performing based on the population size?
2. **Expansion Target:** Which state where we currently have NO presence offers the safest economic environment for our new branch?

---

### 🚨 Phase 1: Calculating Market Penetration (Cross-Database Join & Math)
**Objective:** Calculate the "Revenue per Capita" (How much we sell per person) for our existing branches.

**The SQL Solution:**
```sql
SELECT 
    D.StateName,
    P.Yearly_Revenue,
    D.Population_Millions,
    (P.Yearly_Revenue / (D.Population_Millions * 1000000)) AS Revenue_Per_Citizen
FROM PVF_REGIONAL_SALES P
INNER JOIN DOSM_STATE_DATA D ON P.StateCode = D.StateCode
ORDER BY Revenue_Per_Citizen DESC;
```
*Business Outcome:* You joined an internal sales table with an external government table. You discovered that even though Selangor has the highest total revenue, **Kuala Lumpur** has the highest *Revenue per Citizen*. The market in Selangor is actually under-penetrated!

---

### 🚨 Phase 2: Identifying the Expansion Target (Outer Joins & Risk Logic)
**Objective:** Find states where we have NO branches, and sort them by the lowest unemployment rate to ensure a stable consumer base.

**The SQL Solution:**
```sql
SELECT 
    D.StateName,
    D.Avg_Household_Income,
    D.Unemployment_Rate
FROM DOSM_STATE_DATA D
LEFT JOIN PVF_REGIONAL_SALES P ON D.StateCode = P.StateCode
WHERE P.BranchID IS NULL
ORDER BY D.Unemployment_Rate ASC;
```
*Business Outcome:* The `LEFT JOIN` combined with `IS NULL` found the "empty" markets. Sorting by `Unemployment_Rate ASC` proves that **Perak** is a safer expansion bet than Kelantan, despite both being untapped markets.

---

## 🏆 Conclusion: The Data-Driven CEO
> "Today, you stopped looking at your business in a vacuum. By using SQL to ingest and analyze external DOSM data, you proved that database management is not about storing information—it is about **generating foresight**. 
>
> You used statistical functions (`AVG`, `STDDEV`) and complex `JOIN` logic to tell a CEO exactly where to spend RM 5 Million. That is the power of Advanced Database Management."

***

### 💡 Interactive Lecturer Tool (For your Live Presentation)

To show your students how SQL statistical logic creates visual business dashboards, use this interactive widget during your lecture. It simulates the exact output of the Phase 1 and Phase 2 SQL queries above.

[Direct Text Answer] Let's look at how SQL statistical calculations and joins directly power Business Intelligence Dashboards.
[Explanation of Method] This widget demonstrates how the database engine merges internal Sales Data with external DOSM Data to calculate "Market Risk" and "Penetration" on the fly, which executives use to make expansion decisions.

```json?chameleon
{"component":"LlmGeneratedComponent","props":{"height":"800px","prompt":"Create an interactive 'Macro-Economic Expansion Dashboard' for an MBA class.\n\nObjective: Visually demonstrate how merging internal sales data with external demographic data drives business decisions.\n\nInitial State:\nDisplay a simulated Business Intelligence UI with two panels.\nLeft Panel: 'Data Sources'\n- Table 1 (DOSM External): [State, Population, Income, Unemployment]\n- Table 2 (Internal PVF): [State, Yearly Sales]\nRight Panel: 'SQL Analytics Engine' (Initially empty)\n\nControls (Top Bar):\nA dropdown menu labeled 'Execute Strategic SQL Query:'\n1. 'Calculate National Baseline Statistics (AVG, MIN, MAX)'\n2. 'Analyze Market Penetration (Revenue per Capita)'\n3. 'Identify Untapped Markets (LEFT JOIN + Risk Filter)'\n\nBehavior:\n- When Query 1 is selected: The Right Panel displays a sleek summary card showing calculated Averages, Standard Deviations, and Max/Min for Income and Unemployment from the DOSM data.\n- When Query 2 is selected: The Right Panel displays a bar chart or ranked list. It visually merges the Sales and DOSM tables, calculating (Sales / Population) to show 'Revenue per Citizen'. Kuala Lumpur should rank highest.\n- When Query 3 is selected: The Right Panel visually highlights states with NO internal sales (Perak, Kelantan). It then sorts them by Unemployment Rate, clearly recommending 'Perak' as the safer expansion target.\n- For every selection, display a 'Live SQL Syntax' block at the bottom showing the exact code (using AVG, JOINs, or IS NULL) required to generate that view.\n\nVisuals: High-end, corporate dashboard aesthetic. Use green/red indicators for low/high risk based on the data.","id":"im_1804bde829e69278"}}
```
