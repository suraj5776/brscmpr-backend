A web.config file is the main XML-based configuration file used by Microsoft's IIS (Internet Information Services) web server on Windows.

Think of it as the instruction manual that tells IIS how to run, route, and protect your application on Windows Server.
(It is the IIS equivalent of .htaccess in Apache or nginx.conf in Nginx).

Why is web.config used in this project?

1. In the Angular Frontend (brscmpr-frontend)
   Angular is a Single Page Application (SPA) with virtual client-side routes (e.g., /report-history, /new-report, /edit-report/2).

Without web.config: When a user refreshes their browser on http://server/report-history, IIS looks for a real file called report-history.html on the hard drive. Since it doesn't exist, IIS throws a 404 Not Found error.
With web.config: It tells IIS:
"If the requested URL is not a physical image or file on the disk, route it to index.html so Angular's router can load the page seamlessly."

2. In the Node.js Backend (brscmpr-backend)
   When hosting Node.js directly inside IIS via iisnode:

<handlers>: Tells IIS to execute server.js using the iisnode engine whenever HTTP requests arrive.
<rewrite>: Forwards all API requests (e.g., /api/mpr, /api/masters/...) directly into Express routes inside server.js.
<security>: Blocks public access to private files like .env (database passwords) and node_modules so no external visitor can download them.
<iisnode>: Configures error logging into the iisnode/ folder.
Summary Table
Application Area What web.config does
Angular Frontend Enables clean SPA page refreshes without 404 errors by rewriting routes to index.html.
Node.js Backend Tells IIS to run server.js via iisnode, forward API requests, and protect .env secrets.
