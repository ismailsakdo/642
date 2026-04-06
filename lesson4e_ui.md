## 🚀 Application Testing: Proving Data Integrity
You must now test the application to prove to the Sales Team that the **Chapter 4 data anomalies** have been permanently eradicated. Open the mobile emulator on the right side of your AppSheet screen.

### Test 1: Eradicating the Insertion Anomaly
*   **Action:** Go to the **Product** tab in your app. Add a new product: `P-12`, `Conference Table`, `RM 3000`. Save it.
*   **The Proof:** In the old flat file, you couldn't add this until someone bought it. Because you normalized the database and created a standalone `TBL_PRODUCT`, you can update your master inventory immediately, regardless of sales activity.

---

### Test 2: Eradicating the Update Anomaly
*   **Action:** Go to the **Product** tab. Change the price of the `Ergonomic Chair` from `RM 500` to `RM 600`.
*   **The Proof:** You changed it in exactly **ONE** place. Now, go create a new Order in the app. Add the `Ergonomic Chair` to the shopping cart. The app will automatically pull the new price. You have eliminated price discrepancies forever.

---

### Test 3: Eradicating the Deletion Anomaly
*   **Action:** Go to the **Order** tab. Delete `ORD-902` entirely.
*   **The Proof:** You deleted the transaction, but navigate over to the **Customer** tab. Is `EduGroup` still there? **Yes.** By separating the entities into **3NF**, the cancellation of a sales event no longer destroys your corporate client registry.

---

### 🏆 Final Executive Conclusion
You have just proven that **Logical Database Design (Normalization)** is not just an academic exercise. It is the architectural foundation required to build secure, automated, and anomaly-free mobile applications.
