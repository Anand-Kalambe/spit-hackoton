# Marauders of ML - Inventory Management System (IMS)

<p align="center">
  <video src="assets/Marauders-of-ML.mp4" width="600" controls>
  </video>
</p>

## Overview
**Marauders of ML** presents a modular **Inventory Management System (IMS)** designed to digitize and streamline stock-related operations for businesses. The goal is to replace manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, and easy-to-use application.

This system allows businesses to manage products, incoming and outgoing stock, internal transfers, and stock adjustments efficiently while providing comprehensive reporting and analytics.

---

## Target Users
- **Inventory Managers:** Manage incoming and outgoing stock, reorders, and stock adjustments.  
- **Warehouse Staff:** Perform stock transfers, picking, shelving, and counting.

---

## Tech Stack
- **Frontend:** Next.js  
- **Backend:** Spring Boot  
- **Database:** PostgreSQL  

---

## Authentication
- User signup/login with secure credentials.  
- OTP-based password reset for account recovery.  
- After authentication, users are redirected to the Inventory Dashboard.

---

## Dashboard View
The landing page provides a real-time snapshot of inventory operations.

### Key Performance Indicators (KPIs)
- Total Products in Stock  
- Low Stock / Out of Stock Items  
- Pending Receipts  
- Pending Deliveries  
- Scheduled Internal Transfers  

### Dynamic Filters
- Document type: Receipts, Delivery, Internal, Adjustments  
- Status: Draft, Waiting, Ready, Done, Canceled  
- Warehouse or location  
- Product category  

---

## Navigation

### Sidebar Menu
1. **Products**
   - Create/update products  
   - Track stock per location  
   - Manage product categories  
   - Define reordering rules  
2. **Operations**
   - Receipts (Incoming Stock)  
   - Delivery Orders (Outgoing Stock)  
   - Inventory Adjustments  
   - Move History  
3. **Dashboard**
4. **Settings**
   - Manage warehouses  
5. **Profile Menu**
   - My Profile  
   - Logout  

---

## Core Features

### 1. Product Management
- Create products with:  
  - Name  
  - SKU / Code  
  - Category  
  - Unit of Measure  
  - Initial Stock (optional)  

### 2. Receipts (Incoming Goods)
- Record incoming stock from vendors.  
- Steps:
  1. Create receipt  
  2. Add supplier & products  
  3. Input quantities received  
  4. Validate → stock increases automatically  
- **Example:** Receive 50 units of “Steel Rods” → Stock +50

### 3. Delivery Orders (Outgoing Goods)
- Record outgoing stock for customer shipments.  
- Steps:
  1. Pick items  
  2. Pack items  
  3. Validate → stock decreases automatically  
- **Example:** Sales order for 10 chairs → Stock –10

### 4. Internal Transfers
- Move stock internally within the company or across warehouses.  
- Each transfer is logged in the ledger.  
- **Example:** Main Warehouse → Production Floor → Stock location updated

### 5. Stock Adjustments
- Fix mismatches between recorded stock and physical count.  
- Steps:
  1. Select product/location  
  2. Enter counted quantity  
  3. System auto-updates stock and logs the adjustment  

---

## Additional Features
- Low stock alerts  
- Multi-warehouse support  
- SKU search & smart filters  
- Full stock ledger for auditing

---

## Example Inventory Flow
1. **Receive Goods from Vendor**: +100 kg Steel  
2. **Internal Transfer**: Main Store → Production Rack → Stock location updated  
3. **Deliver Finished Goods**: Deliver 20 kg Steel → Stock –20  
4. **Adjust Damaged Items**: 3 kg Steel damaged → Stock –3  

All operations are automatically logged in the **Stock Ledger** for full traceability.

---

## Installation

1. Clone the repository:
