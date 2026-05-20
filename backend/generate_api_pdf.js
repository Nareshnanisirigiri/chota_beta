const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const endpoints = {
  "admin_api_endpoints": [
    {
      "module": "Authentication",
      "endpoints": [
        { "method": "POST", "url": "/api/auth/login", "description": "Admin login" },
        { "method": "GET", "url": "/api/auth/me", "description": "Get current admin profile" }
      ]
    },
    {
      "module": "Dashboard Stats",
      "endpoints": [
        { "method": "GET", "url": "/api/stats", "description": "Get dashboard counts and revenue" }
      ]
    },
    {
      "module": "Categories",
      "endpoints": [
        { "method": "GET", "url": "/api/category", "description": "List all categories" },
        { "method": "POST", "url": "/api/category", "description": "Create a new category with image" },
        { "method": "PUT", "url": "/api/category/:id", "description": "Update category and its image" },
        { "method": "DELETE", "url": "/api/category/:id", "description": "Delete category" }
      ]
    },
    {
      "module": "Brands",
      "endpoints": [
        { "method": "GET", "url": "/api/brands", "description": "List all brands" },
        { "method": "POST", "url": "/api/brands", "description": "Create a new brand with logo" },
        { "method": "PUT", "url": "/api/brands/:id", "description": "Update brand details and logo" },
        { "method": "DELETE", "url": "/api/brands/:id", "description": "Delete brand" }
      ]
    },
    {
      "module": "Users & Customers",
      "endpoints": [
        { "method": "GET", "url": "/api/users", "description": "List all customers" },
        { "method": "POST", "url": "/api/users", "description": "Create a new customer" },
        { "method": "PUT", "url": "/api/users/:id", "description": "Update customer details" },
        { "method": "DELETE", "url": "/api/users/:id", "description": "Delete customer" }
      ]
    },
    {
      "module": "Sellers & Stores",
      "endpoints": [
        { "method": "GET", "url": "/api/sellers", "description": "List all sellers" },
        { "method": "POST", "url": "/api/sellers", "description": "Create a seller" },
        { "method": "PUT", "url": "/api/sellers/:id", "description": "Update seller details" },
        { "method": "DELETE", "url": "/api/sellers/:id", "description": "Delete seller" },
        { "method": "GET", "url": "/api/stores", "description": "List all stores" },
        { "method": "POST", "url": "/api/stores", "description": "Create a store with logo/banner" },
        { "method": "PUT", "url": "/api/stores/:id", "description": "Update store details" },
        { "method": "DELETE", "url": "/api/stores/:id", "description": "Delete store" }
      ]
    },
    {
      "module": "Products",
      "endpoints": [
        { "method": "GET", "url": "/api/products", "description": "List all products" },
        { "method": "POST", "url": "/api/products", "description": "Create a product with media" },
        { "method": "PUT", "url": "/api/products/:id", "description": "Update a product" },
        { "method": "DELETE", "url": "/api/products/:id", "description": "Delete a product" },
        { "method": "GET", "url": "/api/product-faqs", "description": "List product FAQs" },
        { "method": "POST", "url": "/api/product-faqs", "description": "Create a product FAQ" },
        { "method": "PUT", "url": "/api/product-faqs/:id", "description": "Update a product FAQ" },
        { "method": "DELETE", "url": "/api/product-faqs/:id", "description": "Delete a product FAQ" }
      ]
    },
    {
      "module": "Delivery Boys",
      "endpoints": [
        { "method": "GET", "url": "/api/delivery-boys", "description": "List delivery boys" },
        { "method": "POST", "url": "/api/delivery-boys", "description": "Register a new delivery boy" },
        { "method": "PUT", "url": "/api/delivery-boys/:id", "description": "Update delivery boy info" },
        { "method": "DELETE", "url": "/api/delivery-boys/:id", "description": "Delete a delivery boy" }
      ]
    },
    {
      "module": "Banners",
      "endpoints": [
        { "method": "GET", "url": "/api/banners", "description": "List promotional banners" },
        { "method": "POST", "url": "/api/banners", "description": "Create a new banner with image" },
        { "method": "DELETE", "url": "/api/banners/:id", "description": "Delete a banner" }
      ]
    },
    {
      "module": "Featured Sections",
      "endpoints": [
        { "method": "GET", "url": "/api/featured-sections", "description": "List featured sections" },
        { "method": "POST", "url": "/api/featured-sections", "description": "Create a featured section" },
        { "method": "PUT", "url": "/api/featured-sections/:id", "description": "Update featured section" },
        { "method": "DELETE", "url": "/api/featured-sections/:id", "description": "Delete featured section" },
        { "method": "POST", "url": "/api/featured-sections/update-order", "description": "Reorder featured sections" }
      ]
    },
    {
      "module": "Promocodes",
      "endpoints": [
        { "method": "GET", "url": "/api/promos", "description": "List all promo codes" },
        { "method": "POST", "url": "/api/promos", "description": "Create a promo code" },
        { "method": "PUT", "url": "/api/promos/:id", "description": "Update a promo code" },
        { "method": "DELETE", "url": "/api/promos/:id", "description": "Delete a promo code" }
      ]
    },
    {
      "module": "Settings",
      "endpoints": [
        { "method": "GET", "url": "/api/settings", "description": "Get all global application settings" },
        { "method": "POST", "url": "/api/settings", "description": "Bulk update application settings" }
      ]
    },
    {
      "module": "Other Data Management",
      "endpoints": [
        { "method": "CRUD", "url": "/api/faqs", "description": "Manage App FAQs" },
        { "method": "CRUD", "url": "/api/delivery-zones", "description": "Manage Geofenced Delivery Zones" },
        { "method": "CRUD", "url": "/api/app-notifications", "description": "Manage Push Notifications" },
        { "method": "CRUD", "url": "/api/roles", "description": "Manage Admin Roles" },
        { "method": "CRUD", "url": "/api/admin-users", "description": "Manage Admin Users" },
        { "method": "CRUD", "url": "/api/tax", "description": "Manage Tax Rates" }
      ]
    }
  ]
};

const doc = new PDFDocument({ margin: 50 });
const pdfPath = path.join(__dirname, 'ChotaBeta_Admin_APIs.pdf');
doc.pipe(fs.createWriteStream(pdfPath));

doc.fontSize(24).fillColor('#007bff').text('ChotaBeta Admin Panel', { align: 'center' });
doc.fontSize(16).fillColor('#333333').text('API Endpoints Documentation', { align: 'center' });
doc.moveDown(2);

doc.fontSize(10).fillColor('#666666').text('Below is the complete list of RESTful API endpoints available in the Admin Panel backend. All JSON payloads conform to the internal DB structure.', { align: 'center' });
doc.moveDown(2);

endpoints.admin_api_endpoints.forEach(mod => {
    doc.fontSize(14).fillColor('#000000').text(`>> ${mod.module}`, { underline: true });
    doc.moveDown(0.5);

    mod.endpoints.forEach(ep => {
        doc.fontSize(11).fillColor('#d32f2f').text(`[${ep.method}] `, { continued: true });
        doc.fillColor('#007bff').text(`${ep.url} `, { continued: true });
        doc.fillColor('#333333').text(`- ${ep.description}`);
    });

    doc.moveDown(1.5);
});

doc.addPage();
doc.fontSize(16).fillColor('#333333').text('JSON Representation', { align: 'center' });
doc.moveDown();
doc.fontSize(9).fillColor('#4caf50').text(JSON.stringify(endpoints, null, 4), {
    width: 500,
    align: 'left'
});

doc.end();

console.log('PDF generated at ' + pdfPath);
