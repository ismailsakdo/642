/**
 * ADE 642: PharmaChain Logistics IoT Simulator
 * This script simulates a live data feed from transport trucks.
 * It will pump normal data, followed by a simulated critical breach.
 */

function simulateIoTFeed() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear(); // Clear old data
  
  // 1. Setup the Flat File Headers
  var headers = ["Timestamp", "Sensor_MAC", "Route", "Cargo_Type", "Current_Temp", "System_Status"];
  sheet.appendRow(headers);
  sheet.getRange("A1:F1").setFontWeight("bold").setBackground("#020617").setFontColor("#ffffff");
  
  // 2. Arrays of sample data for the simulation
  var macs = ["SN-102", "SN-441", "SN-772", "SN-105"];
  var routes = ["KL - Penang", "KL - Johor", "Penang - Ipoh", "KL - Kuantan"];
  var cargos = ["Antibiotics", "Insulin", "Blood Plasma", "General Meds"];
  
  SpreadsheetApp.getUi().alert("SYSTEM ONLINE: Establishing connection to PharmaChain Fleet...");
  
  // 3. Simulate 8 seconds of normal operations (Live streaming effect)
  for (var i = 0; i < 8; i++) {
    var time = new Date().toLocaleTimeString();
    var mac = macs[Math.floor(Math.random() * macs.length)];
    var route = routes[Math.floor(Math.random() * routes.length)];
    var cargo = cargos[Math.floor(Math.random() * cargos.length)];
    var temp = (Math.random() * (5 - 2) + 2).toFixed(1) + "°C"; // Normal temp between 2 and 5
    
    sheet.appendRow([time, mac, route, cargo, temp, "NORMAL"]);
    
    // Flush forces the sheet to update visually in real-time
    SpreadsheetApp.flush(); 
    Utilities.sleep(1500); // Pause for 1.5 seconds to simulate data streaming
  }
  
  // 4. TRIGGER THE RM 50 MILLION CRISIS
  Utilities.sleep(2000);
  var crisisTime = new Date().toLocaleTimeString();
  var crisisRow = [crisisTime, "SN-884", "KL - Singapore", "mRNA Vaccine", "-12.5°C", "CRITICAL BREACH"];
  
  sheet.appendRow(crisisRow);
  
  // Highlight the crisis row in red to simulate an emergency dashboard
  var lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 6).setBackground("#ef4444").setFontColor("#ffffff").setFontWeight("bold");
  SpreadsheetApp.flush();
  
  SpreadsheetApp.getUi().alert("CRITICAL ALERT: Sensor SN-884 has breached temperature thresholds! mRNA cargo is degrading.");
}
