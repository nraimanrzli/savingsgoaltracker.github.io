# SAVINGS GOAL TRACKER SYSTEM (IMS566)

**Author:** MUHAMMAD NUR'AIMAN BIN MOHAMMAD ROZLI 
**Student ID:** 2025485742 
**Class:** D1SI2624A  
**Date:** 2026

## DESCRIPTION
This system is designed to help users track and manage their personal savings goals efficiently. It acts as a centralized dashboard to set savings targets, monitor transaction history, and view financial progress through visual analytics.

## FEATURES INCLUDED
* **Authentication:** Login page with validation and credential management stored locally.
* **Forgot Password:** Users can reset their credentials by entering a new username and password (data is saved locally via localStorage).
* **Dashboard:** Comprehensive summary with key stats (Total Savings, Completed Goals, Pending Goals) and 2 interactive charts (Goal Status Doughnut, Income vs Expense Bar Chart) plus a carousel overview.
* **Savings Goals:** Add, edit, and manage savings goals with search functionality and a modal-based form.
* **Transactions:** Log and track income and expense transactions with add/edit/delete support via modal forms.
* **Analytics:** Keep on track user budget, monthly savings and add reminder which one is priority for user
* **User Profile:** View and update user profile information.
* **Responsive Design:** Fully functional on both desktop and mobile devices.

## HOW TO USE (TESTING INSTRUCTIONS)
1. Open the project folder.
2. Double-click **`index.html`** to launch the application.
3. Log in using the default credentials below.

## LOGIN INFO
* **Username:** admin
* **Password:** 1234
*(Note: If you used the "Forgot Password" feature, please use your updated credentials).*

## FRAMEWORKS & LIBRARIES USED
* **Bootstrap 5.3.2:** For responsive layout and UI components.
* **Chart.js:** For data visualization (Doughnut,Bar charts, Line chart, Radar chart and Pie chart).
* **SweetAlert2:** For interactive popup alerts and input dialogs.
* **Bootstrap Icons:** For user interface icons.

## FILES STRUCTURE
* `index.html` - Login page (Authentication)
* `dashboard.html` - Main dashboard with visual analytics and summary stats
* `goals.html` - Savings goals management page
* `transactions.html` - Income and expense transaction tracker
* `analytics.html` - Budget Planner, Monthly Savings Log, Reminder
* `profile.html` - User profile management page
* `assets/` - Folder containing CSS and other static resources
