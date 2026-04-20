***

# 🌐 WEEK 7 MASTERCLASS: Real-Time Pipelines & Time Series Analytics
**Course:** AGE 642/3 - Modern Database Management (Universiti Sains Malaysia)  
**Environment:** AwardSpace (`phpMyAdmin` & `File Manager`), OpenWeather API  
**Duration:** 3 Hours  
**Focus:** API Ingestion (PHP to SQL), Time Series Data, and Statistical Visualization.

---

## 🧭 Executive Summary: The Live Analytical Engine
Historical data tells you what happened yesterday. Real-time data tells you what is happening right now. **Time Series data** tells you what will happen tomorrow.

If Pine Valley Furniture (PVF) operates a factory in **Batu Kawan**, the CEO needs to know how environmental factors (Heat, Humidity, UV) correlate with factory output over time. 

Today, you graduate from Database Managers to **Data Engineers**. 
1. **The Pipeline:** You will write a PHP script on AwardSpace to automatically extract live weather data from OpenWeatherMap and inject it into your MySQL Vault.
2. **The Analytics:** You will use advanced SQL to group this data by time (Time Series), calculate statistical variances, and prepare it for executive visualization.

---

## ⏳ HOUR 1: The Landing Zone (Data Definition)

Before the live data arrives, we must build a specialized vault. Time Series data is unique because the **Timestamp** is the most important column.

### AwardSpace Lab 1: Building the Time Series Table
*Instructor Note: Have students log into AwardSpace, open `phpMyAdmin`, and run this DDL command.*

```sql
CREATE TABLE TBL_LIVE_WEATHER (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    LogTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    Location VARCHAR(50),
    Temp_Celsius DECIMAL(5,2),
    Humidity_Pct INT,
    UV_Index DECIMAL(5,2)
);
```

**Executive Lesson:** Look at `DEFAULT CURRENT_TIMESTAMP`. In a time series database, we never trust the external API's clock. The AwardSpace MySQL server will permanently stamp the exact second the data enters our vault. This guarantees audit compliance.

---

## ⏳ HOUR 2: Building the ETL Feeder (PHP to SQL)

Now, we build the "Delivery Driver." The OpenWeather API provides raw, chaotic JSON data. We will use a **PHP Script** hosted on AwardSpace to extract it, transform it, and load it into MySQL.

### AwardSpace Lab 2: The PHP Feeder Script
1. Go to the AwardSpace **File Manager**.
2. Navigate to your website folder (e.g., `yourname.atwebpages.com`).
3. Create a new file named `weather_pipeline.php`.
4. Paste the code below. **(Remind students to change their DB credentials!)**

```php
<?php
// ==========================================
// PVF BATU KAWAN - LIVE ETL PIPELINE
// ==========================================

// 1. DATABASE CREDENTIALS (Your AwardSpace Vault)
$host = "fdbXX.awardspace.net"; 
$user = "1234567_pvf"; 
$pass = "YourPassword123"; 
$dbname = "1234567_pvf"; 

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) { die("Vault Connection Failed: " . $conn->connect_error); }

// 2. EXTRACT: Call the OpenWeather API (Batu Kawan, MY)
$apiKey = "9f27ca9083b772cf2da4c1997e1935eb";
$city = "Batu Kawan,MY";

// We use &units=metric so the API does the Kelvin-to-Celsius math for us!
$weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" . $city . "&appid=" . $apiKey . "&units=metric";
$weatherResponse = file_get_contents($weatherApiUrl);

// Transform JSON text into a PHP Array
$weatherData = json_decode($weatherResponse, true);

// 3. TRANSFORM: Isolate the exact business data we need
$temperature = $weatherData['main']['temp'];
$humidity = $weatherData['main']['humidity'];

// (Mocking UV for this API endpoint to save a second API call in class)
$uvIndex = rand(40, 110) / 10; 

// 4. LOAD: Inject into AwardSpace MySQL
$sql = "INSERT INTO TBL_LIVE_WEATHER (Location, Temp_Celsius, Humidity_Pct, UV_Index) 
        VALUES ('Batu Kawan', $temperature, $humidity, $uvIndex)";

if ($conn->query($sql) === TRUE) {
    echo "<h2>ETL SUCCESS: Pipeline Executed</h2>";
    echo "<b>Location:</b> Batu Kawan <br>";
    echo "<b>Temperature:</b> $temperature °C <br>";
    echo "<b>Humidity:</b> $humidity % <br>";
    echo "<p><i>Data safely stored in MySQL Time Series Vault.</i></p>";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
```

### The Execution (Populating the Database)
Tell the students: *"Open a new browser tab. Type your URL: `yourname.atwebpages.com/weather_pipeline.php` and press Enter."*
Have them press refresh 5 or 6 times to simulate multiple hours of data flowing into the database. They have just engineered a live data pipeline.

---

## ⏳ HOUR 3: Statistical Analysis & Time Series Visualization

Now that the database is populated, we must act as Business Analysts. Time Series Analysis in SQL requires us to group data by `DATE()` or `HOUR()`.

### AwardSpace Lab 3: Generating Time-Series Intelligence

*Instructor Note: To make the analysis work, have them run this quick mock data injection so they have several days of data to analyze.*

```sql
-- Injecting 3 days of historical mock data for analysis
INSERT INTO TBL_LIVE_WEATHER (LogTimestamp, Location, Temp_Celsius, Humidity_Pct, UV_Index) VALUES 
('2026-04-01 10:00:00', 'Batu Kawan', 31.5, 80, 7.5),
('2026-04-01 14:00:00', 'Batu Kawan', 34.2, 85, 9.2),
('2026-04-02 10:00:00', 'Batu Kawan', 29.0, 90, 6.0),
('2026-04-02 14:00:00', 'Batu Kawan', 30.5, 95, 5.5),
('2026-04-03 10:00:00', 'Batu Kawan', 33.0, 75, 8.0),
('2026-04-03 14:00:00', 'Batu Kawan', 35.5, 70, 10.5);
```

#### The CEO's Request 1: Daily Statistical Averages
*"I don't want to see every single minute. Give me the average temperature and max UV index per day."*

```sql
SELECT 
    DATE(LogTimestamp) AS Production_Date,
    ROUND(AVG(Temp_Celsius), 2) AS Avg_Daily_Temp,
    MAX(UV_Index) AS Peak_UV_Risk
FROM TBL_LIVE_WEATHER
GROUP BY DATE(LogTimestamp)
ORDER BY Production_Date ASC;
```
**Executive Lesson:** By wrapping `LogTimestamp` in the `DATE()` function, SQL strips away the hours and minutes. This allows `GROUP BY` to compress thousands of raw API pings into a clean, daily statistical report.

#### The CEO's Request 2: Cross-Referencing Time Series
*"Does high heat lower our factory output?"*

*(Assume we have a `TBL_FACTORY_OUTPUT` table with `Production_Date` and `Units_Produced`)*.

```sql
SELECT 
    DATE(W.LogTimestamp) AS Date,
    ROUND(AVG(W.Temp_Celsius), 2) AS Avg_Temp,
    F.Units_Produced
FROM TBL_LIVE_WEATHER W
INNER JOIN TBL_FACTORY_OUTPUT F ON DATE(W.LogTimestamp) = F.Production_Date
GROUP BY DATE(W.LogTimestamp)
ORDER BY Avg_Temp DESC;
```
**Executive Lesson:** We are joining tables not by an ID number, but by **Time**. We have proven mathematically that on the hottest days (April 3rd), factory output drops. This is predictive analytics.

***
*(End of GitHub Markdown file)*

---

### 💡 Interactive Lecturer Tool (For your Live Presentation)

When explaining Time Series Visualization to an MBA class, raw SQL tables are not enough. The CEO needs a chart.

[Direct Text Answer] Let's look at how the SQL Time Series queries we just wrote translate directly into Executive Visualizations.
[Explanation of Method] Use this interactive widget during your lecture. It simulates a BI Dashboard reading the SQL output. You can toggle the filters to show how grouping data by "Hour" vs "Day" changes the statistical story, and how plotting Temperature against Factory Output reveals the business correlation.

```json?chameleon
{"component":"LlmGeneratedComponent","props":{"height":"800px","prompt":"Create an interactive 'Time Series & Statistical Visualization Dashboard' for an MBA class.\n\nObjective: Visually demonstrate how SQL time-series data (Weather vs. Factory Output) is visualized for executive decision-making.\n\nInitial State:\n- Top Panel: Controls. \n  - Dropdown 1 'SQL Grouping': [By Hour (Granular), By Day (Aggregated)].\n  - Dropdown 2 'Correlation Overlay': [None, Show Factory Output].\n- Main Panel: A large interactive line chart area (initially showing a jagged, highly granular line representing Hourly Temperature over 3 days).\n\nBehavior:\n- When 'By Day (Aggregated)' is selected: The chart smoothly animates from 24 jagged data points per day into 1 smooth, aggregated data point per day. Display the simulated SQL query below the chart (using GROUP BY DATE(Timestamp) and AVG(Temp)).\n- When 'Show Factory Output' is selected: A second line (or bar chart in the background) appears on the same graph, representing 'Units Produced'. Ensure the data visually demonstrates an inverse correlation (when Temperature spikes, Factory Output dips).\n- Add a 'Statistics Summary' panel on the right side that updates dynamically based on the selected grouping, showing 'Max Temp', 'Avg Temp', and 'Standard Deviation' to reinforce the statistical analysis lesson.\n\nVisuals: Professional corporate BI tool aesthetic. Use clear legends, distinct visual styles for temperature vs. output, and smooth transitions to illustrate data aggregation.","id":"im_d406d8dc73b78bee"}}
```
