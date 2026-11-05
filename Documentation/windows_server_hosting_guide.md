# Windows Server Hosting & Deployment Guide
## SIO Online Inputs BRSC - Monthly Progress Report (MPR) Software

This guide provides complete, step-by-step instructions to host and deploy the **BRSC MPR Application** (Node.js Express Backend + Angular 21 Frontend + MySQL Database) on a **Windows Server** using IIS (Internet Information Services) and PM2 (or NSSM).

---

## ⚠️ Troubleshooting IIS Error 500.19 (`0x8007000d`)

If you encounter **HTTP Error 500.19 - Internal Server Error** with **Error Code: `0x8007000d`**:

> **Root Cause**: IIS does not recognize the `<rewrite>` section in `web.config` because the **IIS URL Rewrite Module 2.1** is not installed on the Windows Server.

### Solution:
1. Download & Install **IIS URL Rewrite Module 2.1**:
   - Official Direct Download Link: [https://www.iis.net/downloads/microsoft/url-rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
   - Or x64 Direct MSI Installer: `https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi`
2. Once installation completes, open **PowerShell as Administrator** and restart IIS:
   ```powershell
   iisreset
   ```
3. Refresh your browser page at `http://10.133.0.51:4201/` — the error `0x8007000d` will be completely resolved!

---

## 📋 Prerequisite Software Requirements on Windows Server

Install the following software on your Windows Server:

1. **Node.js (LTS version)**: [Download Node.js](https://nodejs.org/)
2. **MySQL Server 8.0+** (or MariaDB): [Download MySQL Installer](https://dev.mysql.com/downloads/installer/)
3. **IIS (Internet Information Services)**:
   - Enable IIS via *Server Manager > Add Roles and Features > Web Server (IIS)*.
4. **IIS URL Rewrite Module**: [Download URL Rewrite Module 2.1](https://www.iis.net/downloads/microsoft/url-rewrite)

---

## 🛠️ Step 1: Database Setup (MySQL)

1. Open **MySQL Workbench** or Command Line on your Windows Server.
2. Log in as `root` and execute the following SQL to create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS brsc_mpr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Navigate to your backend directory `brscmpr-backend` and edit the `.env` file:
   ```ini
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=YourMySQLPasswordHere
   DB_NAME=brsc_mpr
   ```
4. The backend automatically creates and migrates all required database tables (`mpr_reports`, `prism_projects`, `mpr_emerging_tech`, `mpr_major_events`, `mpr_national_product_inputs`, `mpr_major_awards`, `national_products`, `national_product_parameters`, `emerging_tech_types`) when started for the first time!

---

## 🚀 Step 2: Backend Deployment (Node.js Service via PM2)

To keep the Express backend server running 24/7 as a background Windows Service:

1. Open **PowerShell (as Administrator)**.
2. Install **PM2** globally:
   ```powershell
   npm install -g pm2
   npm install -g pm2-windows-service
   ```
3. Register PM2 as a Windows Service:
   ```powershell
   pm2-service-install -n "PM2"
   ```
4. Navigate to your backend project directory:
   ```powershell
   cd C:\inetpub\wwwroot\brscmpr-backend
   ```
5. Install production dependencies:
   ```powershell
   npm install --production
   ```
6. Start the backend server with PM2:
   ```powershell
   pm2 start server.js --name "brsc-mpr-backend"
   ```
7. Save the PM2 process list so it restarts automatically on Windows Server reboot:
   ```powershell
   pm2 save
   ```
8. Verify backend status:
   ```powershell
   curl http://localhost:5000/health
   ```

---

## 🌐 Step 3: Frontend Build & IIS Web Hosting

1. Open PowerShell and navigate to `brscmpr-frontend`:
   ```powershell
   cd C:\path\to\brscmpr-frontend
   ```
2. Build the production Angular bundle:
   ```powershell
   npm run build
   ```
   This generates compiled production static files in:
   `C:\path\to\brscmpr-frontend\dist\brscmpr-frontend\browser`

3. **Configure IIS Website**:
   - Open **IIS Manager** (`inetmgr`).
   - Right-click **Sites** > **Add Website...**
   - **Site name**: `BRSC-MPR`
   - **Physical path**: `C:\path\to\brscmpr-frontend\dist\brscmpr-frontend\browser`
   - **Binding**: Set Port to `4201` (or `80` / `443` for HTTPS).

4. **Verify `web.config` for Single Page Application (SPA) Routing**:
   The built folder automatically includes `web.config` generated in `public/web.config`:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="Angular Routes" stopProcessing="true">
             <match url=".*" />
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
             </conditions>
             <action type="Rewrite" url="./index.html" />
           </rule>
         </rules>
       </rewrite>
     </system.webServer>
   </configuration>
   ```

---

## 🔀 Step 4: IIS Reverse Proxy Integration (Single Domain / Port Setup)

If you want IIS to handle both the Frontend and route `/api/*` directly to Node.js backend (Port 5000) under the same domain name:

1. Install **Application Request Routing (ARR)** in IIS.
2. In IIS Manager, click Server Name > **Application Request Routing Cache** > **Server Proxy Settings** > Check **Enable proxy**.
3. Add the following reverse proxy rule to `web.config` inside `browser/web.config`:
   ```xml
   <rule name="Backend API Reverse Proxy" stopProcessing="true">
     <match url="api/(.*)" />
     <action type="Rewrite" url="http://localhost:5000/api/{R:1}" />
   </rule>
   ```

---

## 🔍 Step 5: Verification & Testing Checklist

1. **Backend Health Check**: Open `http://localhost:5000/health` -> Returns `{"status":"OK"}`.
2. **Frontend Website**: Open `http://10.133.0.51:4201/` -> Renders BRSC MPR Application UI.
3. **Form Submission & View Detail**:
   - Enter a new report.
   - Edit an existing report.
   - Click **View** details modal.
4. **Server Reboot Test**: Restart Windows Server and verify PM2 automatically starts `brsc-mpr-backend`.
