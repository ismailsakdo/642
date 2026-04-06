### Step 1: Enforcing Entity Integrity (The Primary Keys)
**Chapter 4 Definition:** No primary key attribute may be null. Every row must have a unique identifier.

1. Go to **Data > Columns** in AppSheet.
2. **Open `TBL_CUSTOMER`**: Ensure the **Key** checkbox is ticked only for `Customer_ID`.
3. **Open `TBL_PRODUCT`**: Ensure the **Key** checkbox is ticked only for `Product_ID`.
4. **Open `TBL_ORDER_DETAILS`**: Ensure the **Key** checkbox is ticked only for `Detail_ID`.

> [!NOTE]
> **Result:** AppSheet will now mathematically block any user from creating a record without a unique ID.

---

### Step 2: Enforcing Referential Integrity (The Foreign Keys)
**Chapter 4 Definition:** A foreign key must match a valid primary key. We do this to prevent "orphaned" data.

1. **Open `TBL_ORDER`**: Find the `Customer_ID` column.
2. Change the **Column Type** to `Ref` (Reference).
3. A menu will pop up asking for the **Source Table**. Select `TBL_CUSTOMER`.
4. **Open `TBL_ORDER_DETAILS`**: 
   - Change `Order_ID` to `Ref` pointing to `TBL_ORDER`.
   - Change `Product_ID` to `Ref` pointing to `TBL_PRODUCT`.

> [!TIP]
> **Result:** AppSheet instantly changes these text boxes into **Dropdown Menus**. Sales reps are forced to select valid existing data.

---

### Step 3: Creating the Associative Bridge (`IsPartOf`)
**Chapter 4 Definition:** A weak entity or associative entity cannot exist without its parent.

1. Stay in `TBL_ORDER_DETAILS`.
2. Look at the `Order_ID` column you just made a `Ref`.
3. Check the box labeled **IsPartOf**.

**Result:** This is AppSheet magic. By declaring that the Order Details are "part of" the main Order, AppSheet automatically builds an **Inline View** (a shopping cart) directly inside the Order screen.

---

### Step 4: Designing the Human UX (Labels)
**Chapter 4 Definition:** Databases use IDs (e.g., `C-55`), but humans need context.

1. **Go to `TBL_CUSTOMER`**: Uncheck the **Label** box for `Customer_ID` and check it for `Customer_Name`.
2. **Go to `TBL_PRODUCT`**: Check the **Label** box for `Product_Name`.

**Result:** When a user opens the app, the dropdown menu will show "TechCorp" instead of "C-55," even though the database securely saves the "C-55" ID code.
