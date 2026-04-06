# EXECUTIVE LAB 4: The Enterprise Architecture Capstone
**Course:** ADE 642 Modern Database Management  
**Module:** Logical Database Design, EER Application, & Normalization (Chapters 1-4)  
**Technology Stack:** Google Sheets (Backend) + AppSheet (Frontend Engine)  

---

## 🏢 THE BUSINESS CRISIS: Pine Valley Furniture (B2B Services Division)

Pine Valley Furniture (PVF) recently launched a **B2B Corporate Installation & Repair Division**. They dispatch technicians to corporate client offices to install smart desks and repair office furniture. 

Currently, the Operations Director is managing this entire division using a single "Flat" Google Sheet. 

### `LEGACY_DISPATCH_LOG` (The Unnormalized Flat File)

| Ticket_ID | Date | Client_ID | Client_Name | Tech_ID | Tech_Name | Tech_Type | Agency_Vendor | Part_ID | Part_Name | Part_Price | Qty |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TKT-801 | 12-Oct | C-11 | Apex Corp | T-01 | Ali | Full-Time | NULL | P-99 | Desk Motor | RM 400 | 2 |
| TKT-801 | 12-Oct | C-11 | Apex Corp | T-01 | Ali | Full-Time | NULL | P-88 | Power Cable | RM 50 | 2 |
| TKT-802 | 13-Oct | C-22 | Zen Labs | T-09 | Sarah | Contractor | FastStaff LLC | P-99 | Desk Motor | RM 400 | 1 |

### ⚠️ The Executive Audit (Identifying the Anomalies)
Before we build the app, we must identify why this spreadsheet is causing revenue leakage. As a Database Architect, you must explain the **Chapter 4 Anomalies** to the CEO:

1. **Update Anomaly (Pricing Risk):** The `Part_Price` is repeated. If the Desk Motor price increases to RM 450, we must manually find every row containing 'P-99' and change it. If we miss Row 3, we under-bill Zen Labs.
2. **Deletion Anomaly (Asset Risk):** If Apex Corp cancels `TKT-801`, and we delete those two rows, we permanently delete the only record that `Apex Corp (C-11)` exists in our corporate database. We lose a client asset.
3. **Insertion Anomaly (Supply Chain Freeze):** We just bought a new inventory item: `P-55 (Glass Panel)`. We cannot insert it into this table because no client has ordered it yet (Ticket_ID cannot be blank). 

---

## 📐 PHASE 1: CONCEPTUAL & EER RECAP (Chapters 1-3)

To fix this, we must map our business reality. 

* **Entities (Ch 1-2):** We clearly have four distinct business entities trapped in this spreadsheet: `CLIENT`, `TECHNICIAN`, `TICKET` (The Event), and `PART` (Inventory).
* **The EER Subtype Rule (Ch 3):** Look at the `Tech_Type` column. PVF uses both internal **Full-Time** staff and external **Contractors**. 
  * *Business Rule:* A Contractor belongs to an `Agency_Vendor`. A Full-Time staff member does not. 
  * *AppSheet Translation:* We must use an EER **Disjoint Constraint**. A technician cannot be both. We will build a dynamic `Show_If` interface so the app only asks for "Agency Vendor" if the technician is a Contractor.

---

## 🧮 PHASE 2: LOGICAL DESIGN & NORMALIZATION (Chapter 4)

We must now execute the **Normalization Audit**, breaking the flat file into 3rd Normal Form (3NF) tables to eliminate all anomalies.

*Instructions for Students: Open a blank Google Sheet. Create 5 tabs at the bottom. Copy and paste these exact tables into cell A1 of each respective tab.*

### TAB 1: `DIM_CLIENT` (Achieving 3NF)
*Removes Transitive Dependency. Client data depends on Client_ID, not the Ticket.*

| Client_ID (PK) | Client_Name | Corporate_Address | Billing_Status |
|---|---|---|---|
| C-11 | Apex Corp | Kuala Lumpur | Active |
| C-22 | Zen Labs | Cyberjaya | Active |

### TAB 2: `DIM_TECHNICIAN` (The Supertype/Subtype Table)
*Isolates the workforce data. Notice the Subtype column (`Tech_Type`).*

| Tech_ID (PK) | Tech_Name | Tech_Type | Agency_Vendor | Hourly_Rate_RM |
|---|---|---|---|---|
| T-01 | Ali | Full-Time | NULL | 50.00 |
| T-09 | Sarah | Contractor | FastStaff LLC | 75.00 |

### TAB 3: `DIM_PART` (Achieving 2NF)
*Removes Partial Dependency. Price is isolated to the Master Inventory list.*

| Part_ID (PK) | Part_Name | Unit_Price_RM | Stock_Level |
|---|---|---|---|
| P-88 | Power Cable | 50.00 | 100 |
| P-99 | Desk Motor | 400.00 | 15 |

### TAB 4: `FACT_TICKET` (The Event Entity)
*The intersection of Client and Technician. Maps 1:M relationships.*

| Ticket_ID (PK) | Date | Client_ID (FK) | Tech_ID (FK) | Ticket_Status |
|---|---|---|---|---|
| TKT-801 | 12-Oct | C-11 | T-01 | Completed |
| TKT-802 | 13-Oct | C-22 | T-09 | Pending |

### TAB 5: `FACT_TICKET_LINE` (The Associative Entity)
*Resolves the Many-to-Many (M:N) relationship. A Ticket can have many Parts; a Part can be used in many Tickets.*

| Line_ID (PK) | Ticket_ID (FK) | Part_ID (FK) | Qty_Used |
|---|---|---|---|
| L-001 | TKT-801 | P-99 | 2 |
| L-002 | TKT-801 | P-88 | 2 |
| L-003 | TKT-802 | P-99 | 1 |

---

## 🛠️ PHASE 3: APPSHEET ENGINEERING PROTOCOL

Now, connect your Google Sheet to AppSheet. We will physically program the Chapter 4 rules into the software engine.

### Step 1: Enforce Entity Integrity (Primary Keys)
*No Primary Key can be null or a spreadsheet row number.*
1. Go to **Data > Columns**.
2. For all 5 tables, ensure the **`Key`** checkbox is ticked *only* for the ID column (e.g., `Client_ID`, `Part_ID`). 
3. *Executive Tip:* Set the **Initial Value** of `Line_ID` to `UNIQUEID()` so the system auto-generates secure hashes for new line items.

### Step 2: Enforce Referential Integrity (Foreign Keys)
*Prevent orphaned data by strictly linking tables.*
1. Go to `FACT_TICKET`. Change the Type of `Client_ID` to **`Ref`** and point it to `DIM_CLIENT`.
2. Still in `FACT_TICKET`, change `Tech_ID` to **`Ref`** and point it to `DIM_TECHNICIAN`.
3. Go to `FACT_TICKET_LINE`. Change `Part_ID` to **`Ref`** and point it to `DIM_PART`.

### Step 3: Build the Associative Shopping Cart (`IsPartOf`)
*This links the M:N bridge table securely to the parent event.*
1. Go to `FACT_TICKET_LINE`. 
2. Change `Ticket_ID` to **`Ref`** pointing to `FACT_TICKET`.
3. Check the **`IsPartOf`** box. 
4. *Result:* AppSheet will instantly generate an embedded "Parts Used" shopping cart inside every Dispatch Ticket screen.

### Step 4: Execute Chapter 3 Business Rules (`Show_If`)
*Enforce the Disjoint Subtype constraint so the UI adapts to the workforce type.*
1. Go to `DIM_TECHNICIAN`. 
2. Change `Tech_Type` to **`Enum`** (Dropdown) with two values: `Full-Time` and `Contractor`.
3. Go to the `Agency_Vendor` column. Click the Edit (pencil) icon.
4. Scroll to **Show?** and click the formula beaker. Type: `[Tech_Type] = "Contractor"`
5. *Result:* The app will hide the "Agency Vendor" question for internal staff, cleaning up the data entry screen.

---

## 🏆 PHASE 4: EXECUTIVE SIGN-OFF (Validation Testing)

Open the mobile emulator on the right side of your AppSheet dashboard. Prove to the Operations Director that the system is structurally sound.

**1. Test the UX (Chapter 3 Validation):**
* Navigate to the `Technician` tab. Tap 'Add New'. 
* Select `Full-Time`. Notice the screen is clean.
* Change it to `Contractor`. Watch the `Agency_Vendor` field instantly appear. **(EER Logic Confirmed).**

**2. Test the Anomaly Eradication (Chapter 4 Validation):**
* Navigate to the `Part` tab. Change the price of the `Desk Motor` to RM 500.
* Open `TKT-801` and look at the embedded Line Items. Create a new line item and select `Desk Motor`. The system instantly pulls RM 500. **(Update Anomaly Eliminated).**
* Delete `TKT-802`. Navigate to the `Client` tab. `Zen Labs` is still safely in your database. **(Deletion Anomaly Eliminated).**

### 🎓 Conclusion
By auditing legacy data, drawing the conceptual models (Ch 1-3), enforcing Normalization mathematics (Ch 4), and deploying relational joins in AppSheet, you have successfully built an Enterprise-Grade Information System.
