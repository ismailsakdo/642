# EXECUTIVE HOMEWORK: The Database Architecture Audit
**Course:** ADE 642 Modern Database Management  
**Module:** Comprehensive Recap (Chapters 1-4) & AppSheet Strategy  
**Format:** Take-Home Case Study  

## 🏢 THE BUSINESS CRISIS: Crestview Corporate Events
**Crestview Events** organizes high-end corporate retreats. Currently, their entire operation (Clients, Venues, and Event Staffing) is managed on a single, massive Google Sheet. 

The CEO wants to move this to a custom AppSheet mobile app, but the current spreadsheet is causing massive billing errors and scheduling conflicts. You have been hired as the Consulting Database Architect.

### `LEGACY_EVENT_TRACKER` (The Flat File)

| Event_ID | Event_Date | Client_ID | Client_Name | Venue_ID | Venue_Name | Max_Capacity | Staff_ID | Staff_Name | Staff_Type | Hourly_Rate | Agency_Fee |
|---|---|---|---|---|---|---|---|---|---|---|---|
| EV-001 | 15-Nov | C-88 | Titan Corp | V-10 | The Grand Hotel | 500 | S-01 | Ali | Internal | RM 50 | NULL |
| EV-001 | 15-Nov | C-88 | Titan Corp | V-10 | The Grand Hotel | 500 | S-02 | Sarah | External | RM 100 | RM 500 |
| EV-002 | 20-Nov | C-99 | Zen Labs | V-20 | Ocean Pavilion | 200 | S-01 | Ali | Internal | RM 50 | NULL |
| EV-003 | 25-Nov | C-88 | Titan Corp | V-10 | The Grand Hotel | 500 | S-03 | David | External | RM 120 | RM 600 |

---

## 📝 YOUR ASSIGNMENT (Complete prior to next lecture)

As the Architect, you must audit this data and design the relational skeleton for the new AppSheet application. Answer the following four tasks.

### Task 1: The Risk Audit (Chapter 4 - Anomalies)
Review the flat file above. Write a brief executive summary explaining exactly how this current table exposes the company to the following risks:
1. **An Update Anomaly** (Focus on the Venues or Staff Rates).
2. **A Deletion Anomaly** (Focus on Event EV-002 and Zen Labs).

### Task 2: The Business Rules (Chapter 3 - EER Subtypes)
Look at the `Staff_Type` column. Crestview uses both **Internal** employees and **External** freelance vendors. 
1. Which EER Constraint applies here: *Disjoint* or *Overlapping*? Explain why based on business logic.
2. How will this EER architecture dictate the AppSheet User Experience (UX) regarding the `Agency_Fee` column?

### Task 3: Logical Design (Chapter 4 - Normalization)
Break the `LEGACY_EVENT_TRACKER` flat file into **Five (5) distinct, 3NF Normalized Tables**. 
* You do not need to rewrite all the data. You just need to provide the Table Names and the Columns.
* Clearly mark your Primary Keys (PK) and Foreign Keys (FK).
* *Hint:* An Event can have many Staff members, and a Staff member can work many Events. You will need a bridge table.

### Task 4: The AppSheet Blueprint
Once normalized, explain exactly how you will configure AppSheet to link the tables together so the app functions correctly. Specifically, identify where you will use the **`Ref`** and **`IsPartOf`** functions.
