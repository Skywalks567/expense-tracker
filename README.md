# Expense Tracker

An offline-first personal expense management application designed to help users regulate daily cash flow, maintain a smart daily budget guardrail, and track dedicated savings growth without requiring an active internet connection.

All transaction records and user configurations are persisted locally on the device using an encapsulated SQLite database.

---

## Table of Contents

1. [Key Features](#key-features)
2. [Application Workflow & User Guide](#application-workflow--user-guide)
   - [1. Initial Budget Configuration & Modes](#1-initial-budget-configuration--modes)
   - [2. Smart Alarm Setup (Automated Daily Reminder)](#2-smart-alarm-setup-automated-daily-reminder)
   - [3. Recording Transactions](#3-recording-transactions)
   - [4. Expense Funding Sources: Daily Cash vs. Savings](#4-expense-funding-sources-daily-cash-vs-savings)
   - [5. Internal Savings Loan Tracking](#5-internal-savings-loan-tracking)
   - [6. Dashboard Monitoring & Real-Time Metrics](#6-dashboard-monitoring--real-time-metrics)
   - [7. Financial Reports & Date Range Filtering](#7-financial-reports--date-range-filtering)
   - [8. Quick Search & Transaction Filtering](#8-quick-search--transaction-filtering)
   - [9. Data Backup and Restoration](#9-data-backup-and-restoration)
3. [Technical Architecture](#technical-architecture)
4. [Installation & Local Setup](#installation--local-setup)

---

## Key Features

- **Offline-First & Local Privacy:** Fully functional without cloud dependencies or authentication accounts. All data resides strictly on the user's physical device via `expo-sqlite`.
- **Smart Daily Budget Guardrail:** Dynamically calculates an adaptive daily spending threshold based on remaining calendar days in the month and liquid cash pool availability.
- **Dual Expense Funding Sources:** Distinguishes routine operational cash outlays from withdrawals drawn out of dedicated savings pools.
- **Internal Savings Loan Feature:** Tracks emergency expenditures borrowed from personal savings, providing real-time outstanding balance indicators.
- **Comprehensive Visual Reporting:** Donut chart category distribution, savings health ratio benchmarks, daily spending averages, and timestamped transaction logs.
- **Controlled Date Range Selection:** Calendar navigators restricted to past and current months, complemented by an interactive multi-day range selector capped at 30 days.
- **Smart Notification System:** Daily reminder notifications that automatically skip alerting if transactions have already been recorded today.
- **Local Data Portability:** Seamless JSON export and import capabilities for device transfers and manual backups.

---

## Application Workflow & User Guide

### 1. Initial Budget Configuration & Modes

The application supports two budgeting methodologies to govern daily expenditure limits:

1. Navigate to the **Settings** tab (gear icon in the top-right header or bottom navigation bar).
2. Input the baseline **Monthly Budget** in Indonesian Rupiah (IDR).
3. Select an operational **Budget Mode**:
   - **Auto Mode (Recommended):** The daily allowance is calculated dynamically from real cash availability (`Total Income - (Cumulative Cash Expenses + Dedicated Savings)`) divided by the remaining days of the current month. The allowance recalibrates automatically each day.
   - **Manual Mode:** The daily threshold divides the user's fixed target ceiling across remaining days. This mode features an automatic safety guardrail: if current liquid cash falls below the manual target, the daily budget is bounded by the liquid cash pool to prevent deficits.

---

### 2. Smart Alarm Setup (Automated Daily Reminder)

The automated alarm reminds users to record any unlogged expenditures:

1. On the home dashboard, tap the **Daily Reminder** card or access the setting via the **Settings** menu.
2. Select the preferred notification time (24-hour format, e.g., `20:00`).
3. The background service maintains a rolling schedule: if at least one transaction has been logged today, today's reminder is suppressed to prevent redundant interruptions.

---

### 3. Recording Transactions

To record a financial entry:

1. Tap the **+** (plus) button positioned centrally in the bottom navigation bar.
2. Select the transaction type from the top segment:
   - **Expense:** Outflows allocated from liquid cash or personal savings.
   - **Income:** Inflows that increase available operational cash.
   - **Saving:** Capital transferred from operational cash into long-term savings pools.
3. Enter the monetary amount.
4. Select a category from the categorized grid.
5. Provide an optional descriptive note.
6. Submit the form to commit the record to SQLite storage.

---

### 4. Expense Funding Sources: Daily Cash vs. Savings

When creating an **Expense**, users specify the capital origin:

- **Daily Cash (Default):**
  Applied to routine recurring living expenses (food, transport, utilities). Deductions directly consume today's Daily Budget allowance.
- **Savings:**
  Applied to planned purchases or asset acquisitions funded by prior savings. Outflows from this source **do not deduct** from the daily operational budget, keeping daily allowances intact.

---

### 5. Internal Savings Loan Tracking

When withdrawing from savings for urgent situations with the intent to repay:

1. Select **Savings** as the funding source on the expense form.
2. Toggle the **Borrow from Savings (Repayment Required)** checkbox.
3. Save the entry.
4. The dashboard Hero card displays an active reminder badge: `Savings Loan: Rp [Amount]`, summarizing all unreturned borrowing.
5. History entries display distinct `Savings Loan` badges to distinguish them from standard savings spending.

---

### 6. Dashboard Monitoring & Real-Time Metrics

The primary dashboard summarizes financial health through structured indicators:

- **Hero Cash Balance Card:** Displays real-time operational balance, a historical sparkline trend, and aggregated monthly cash inflows, outflows, and net savings.
- **Privacy Masking:** The eye icon toggles numerical values into asterisks for secure public viewing.
- **Daily Budget Guardrail Card:** Visual status card showing today's remaining spending allowance:
  - *Indigo:* Spending is within safe parameters.
  - *Amber:* Outflows have reached or exceeded 80% of today's limit.
  - *Rose/Red:* Today's expenditures have exceeded the allocated threshold.
- **Today's Activity Feed:** Chronological list of transactions logged today, featuring single-tap deletion.

---

### 7. Financial Reports & Date Range Filtering

The **Report** tab provides historical analytics and transaction breakdowns:

#### Period Filtering
- **Current Month Navigator:** Step backwards through historical months. Future months are locked to maintain statistical validity.
- **Quick Month Grid:** Tap the month title to open a 12-month modal picker.
- **Custom Range Selector:** Select arbitrary start and end dates via an interactive calendar, enforced with a 30-calendar-day limit.

#### Visual Analytics & Summary
- **Interactive Donut Chart:** Proportional category breakdowns sorted by relative expenditure weight.
- **Savings Health Metric:** Evaluates the savings-to-income percentage against a 20% healthy benchmark, displaying gross savings deposited versus savings spent.
- **Daily Spending Average:** Computes average daily cash consumption over the active range.

#### Transaction Ledger
- Transactions are categorized by date headings (`Today`, `Yesterday`, or formatted calendar date).
- Individual items display precise timestamps (WIB), category tags, user notes, funding badges, and signed monetary values.
- Segmented filter buttons allow instant isolation by type (*All, Expense, Income, Saving*).

---

### 8. Quick Search & Transaction Filtering

1. Tap the search icon located on the Home dashboard header.
2. Input keywords to search across notes and category titles.
3. Apply preset date filters (*All, Today, Yesterday, Last 7 Days, This Month*).
4. Filter by transaction classification (*Expense, Income, Saving*).

---

### 9. Data Backup and Restoration

To migrate data or maintain off-device backups:

1. Navigate to **Settings** and scroll to **Data & Backup**.
2. **Backup Data (Export):**
   - Tap **Backup Data**.
   - The application aggregates all local database records into a standardized `expense_tracker_backup.json` file and invokes the native OS sharing sheet.
3. **Restore Data (Import):**
   - Tap **Restore Data**.
   - Select a valid `.json` backup file from the system document picker.
   - The system verifies schema compliance and imports transactions into SQLite.
4. **Reset Database:**
   - Clears all transaction history and resets budget settings to baseline values.

---

## Technical Architecture

- **Core Framework:** [Expo](https://expo.dev/) (SDK 58) with React Native 0.88
- **Language:** TypeScript 5.9
- **Routing Engine:** Expo Router (File-based navigation)
- **State Architecture:** Zustand 5.0
- **Embedded Database:** `expo-sqlite` (equipped with automated table migration handlers)
- **Styling Pipeline:** Tailwind CSS via NativeWind v4
- **Iconography:** Lucide React Native
- **Background Notifications:** `expo-notifications`
- **File Management & Sharing:** `expo-file-system`, `expo-document-picker`, `expo-sharing`

---

## Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 LTS or later recommended)
- Package manager: `npm`, `yarn`, or `pnpm`
- [Expo Go](https://expo.dev/go) application on a physical mobile device or configured Android/iOS emulators

### Execution Steps

1. Clone or navigate to the repository directory:
   ```bash
   cd expense-tracker
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the local Expo development server:
   ```bash
   npx expo start
   ```

4. Launch the application:
   - Scan the terminal QR code using **Expo Go** on Android or the system Camera app on iOS.
   - Press `a` in the terminal to connect an active Android emulator.
