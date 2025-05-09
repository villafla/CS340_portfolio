// Citation for the following code
// Date: 5/21/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/* SETUP */

var express = require('express');   
var app     = express();            
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 19091;                 

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     
app.engine('.hbs', engine({extname: ".hbs"}));  
app.set('view engine', '.hbs');                 

// Database
var db = require('./database/db-connector')


/* ROUTES */

// GET index page
app.get('/', function(req, res) {
    res.render('index', {});
});         
            

// GET Customers 
app.get('/customers', function(req, res)
{
    let query1;

    if (req.query.Name === undefined)
    {
        query1 = "SELECT customerID AS 'ID', CONCAT(Customers.firstName, ' ', Customers.lastName) AS 'Name', CONCAT_WS(' ', Customers.addressLine1, Customers.addressLine2) AS 'Address', city, state, zipCode AS 'Zip Code', country, email, phone FROM Customers;";
    }
    else
    {
        query1 = `SELECT customerID AS 'ID', CONCAT(Customers.firstName, ' ', Customers.lastName) AS 'Name', CONCAT_WS(' ', Customers.addressLine1, Customers.addressLine2) AS 'Address', city, state, zipCode AS 'Zip Code', country, email, phone FROM Customers WHERE CONCAT(Customers.firstName, ' ', Customers.lastName) LIKE "${req.query.Name}%"`
    }

    db.pool.query(query1, function(error, rows, fields){
        
        let customers = rows;        

            return res.render('customers', {data: customers})
        })
});                                                


// GET Orders 
app.get('/orders', function(req, res)
{
    // Query 1: Use aliases for column names
    let query1 = "SELECT orderID AS 'ID', customerID AS 'Name', orderDate AS 'Order Date', orderStatus AS 'Order Status', shippedDate AS 'Shipped Date', orderTotal AS 'Total' FROM Orders;";

    // Query 2: Display Orders; If there is a query string, search and then return matching order ID
    let query2;
    if (req.query.customerID === undefined)
    {
        query2 = "SELECT * FROM Orders;";
    }
    else
    {
        query2 = `SELECT * FROM Orders WHERE customerID LIKE "${req.query.customerID}%"`
    }

    // Query 3: Select from Customers
    let query3 = "SELECT * FROM Customers;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save orders
        let order = rows;

        db.pool.query(query2, function(error, rows, fields){
        
            // Save orders
            let orders = rows;
        
        // Run the second query
        db.pool.query(query3, (error, rows, fields) => {
            
            // Save customers
            let customers = rows; 

            let customermap = {}
            customers.map(customer => {
                let id = parseInt(customer.customerID, 10);

                customermap[id] = customer["firstName"]+ ' '+ customer["lastName"];
            })

            orders = orders.map(orders => {
                return Object.assign(orders, {customerID: customermap[orders.customerID]})
            })

            return res.render('orders', {data: order, data2: orders, customers: customers});
            })
        })
    })
});                                                      


// Get Order Details
app.get('/orderdetails', function(req, res)
    {  
        let query1 = "SELECT orderDetailsID AS 'ID', orderLine AS 'Order Line', orderID AS 'Order ID', (Products.productName) AS 'Product', quantity, itemPrice AS 'Item Price' FROM OrderDetails INNER JOIN Products ON Products.productID = OrderDetails.productID;";               

        let query2 = "SELECT * FROM OrderDetails;"; 

        let query3 = "SELECT * FROM Orders;"; 

        let query4 = "SELECT * FROM Products;"; 

        db.pool.query(query1, function(error, rows, fields){
        
            // Save order details
            let details = rows;

            db.pool.query(query2, function(error, rows, fields){    
                // Save orders details
                let orderdetails = rows;

                db.pool.query(query3, function(error, rows, fields){    
                    // Save orders
                    let orders = rows;

        
                    db.pool.query(query4, function(error, rows, fields){    
                        // Save products
                        let products = rows;

            res.render('orderdetails', {data: details, orderdetails: orderdetails, orders: orders, products: products});                  
                })     
            })
        })   
    })                              
});   


// GET Products 
app.get('/products', function(req, res)
{
    // Query 1: Use aliases for column names
        let query1 = "SELECT productID AS 'ID', productName AS 'Product Name', categoryID AS 'Category Name', quantityInStock AS 'Quantity in Stock', retailPrice AS 'Retail Price', msrp FROM Products;";               

    // Query 2: Display Products; If there is a query string, search and then return matching product ID
    let query2;
    if (req.query.productID === undefined)
    {
        query2 = "SELECT * FROM Products;";
    }
    else
    {
        query2 = `SELECT * FROM Products WHERE productID LIKE "${req.query.productID}%"`
    } 

    // Query 3: Select from Categories
    let query3 = "SELECT * FROM Categories;"; 

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save products
        let product = rows;

        db.pool.query(query2, function(error, rows, fields){
        
            // Save products
            let products = rows;
        
        // Run the second query
        db.pool.query(query3, (error, rows, fields) => {
            
            // Save customers
            let categories = rows; 

            let categorymap = {}
            categories.map(category => {
                let id = parseInt(category.categoryID, 10);

                categorymap[id] = category["categoryName"];
            })

            products = products.map(products => {
                return Object.assign(products, {categoryID: categorymap[products.categoryID]})
            })

            return res.render('products', {data: product, product: products, categories: categories});
        })
    })
    })
});     

// GET Category
app.get('/categories', function(req, res)
    {  
        let query1 = "SELECT categoryID AS 'ID', categoryName AS 'Category Name' FROM Categories;";               

        let query2;
        if (req.query.categoryID === undefined)
        {
            query2 = "SELECT * FROM Categories;";
        }
        else
        {
            query2 = `SELECT * FROM Categories WHERE categoryID LIKE "${req.query.categoryID}%"`
        } 

        db.pool.query(query1, function(error, rows, fields){
        
            let categories = rows;

            db.pool.query(query2, function(error, rows, fields){    
                let category = rows;


            res.render('categories', {data: categories, category: category});                  
        })     
    })                              
});  


// POST Order
app.post('/add-orders-ajax', function(req, res) 
{
    let data = req.body;

    query1 = `INSERT INTO Orders (customerID, orderDate, orderStatus, shippedDate, orderTotal) VALUES ('${data.customerID}', '${data.orderDate}', '${data.orderStatus}', NULLIF('${data.shippedDate}', ''), '${data.orderTotal}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {

            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Orders;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// POST Customers    
app.post('/add-customer-ajax', function(req, res) 
{
    let data = req.body;

    let addressLine2 = parseInt(data.addressLine2);
    if (isNaN(addressLine2))
    {
        addressLine2 = 'NULL'
    }

    query1 = `INSERT INTO Customers (firstName, lastName, addressLine1, addressLine2, city, state, zipCode, country, email, phone) 
    VALUES ('${data.firstName}', '${data.lastName}', '${data.addressLine1}', ${addressLine2}, '${data.city}', '${data.state}', '${data.zipCode}', '${data.country}', '${data.email}', '${data.phone}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Customers;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});



// POST Order Details   
app.post('/add-details-ajax', function(req, res) 
{
    let data = req.body;

    query1 = `INSERT INTO OrderDetails (orderLine, orderID, productID, quantity, itemPrice) 
    VALUES ('${data.orderLine}', '${data.orderID}', '${data.productID}', '${data.quantity}', '${data.itemPrice}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM OrderDetails;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// POST Products 
app.post('/add-products-ajax', function(req, res) 
{
    let data = req.body;

    query1 = `INSERT INTO Products (productID, productName, categoryID, quantityInStock, retailPrice, msrp) 
    VALUES ('${data.productID}', '${data.productName}', NULLIF('${data.categoryID}', ''), '${data.quantityInStock}', '${data.retailPrice}', '${data.msrp}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Products;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});



// POST Category 
app.post('/add-category-ajax', function(req, res) {
    let data = req.body;
  
    let query1 = `INSERT INTO Categories (categoryName) VALUES ('${data.categoryName}')`;
  
    db.pool.query(query1, function(error, results, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        let query2 = `SELECT * FROM Categories`;
  
        db.pool.query(query2, function(error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            res.send(rows);
          }
        });
      }
    });
  });
  


// UPDATE Order
app.put('/put-order-ajax', function(req,res,next){
    let data = req.body;
  

    let customerID = data.customerID;
    let orderDate = data.orderDate;
    let orderStatus = data.orderStatus;
    let shippedDate = data.shippedDate;
    let orderTotal = data.orderTotal;
    let orderID = parseInt(data.orderID);
    console.log(data);

    let queryUpdateOrder = `UPDATE Orders SET customerID = COALESCE(NULLIF(?, ''), customerID), orderDate = COALESCE(NULLIF(?, ''), orderDate), orderStatus = COALESCE(NULLIF(?, ''), orderStatus), shippedDate = COALESCE(NULLIF(?, ''), NULL), orderTotal = COALESCE(NULLIF(?, ''), orderTotal) WHERE Orders.orderID = ?`;
    let selectCustomer = `SELECT * FROM Customers WHERE customerID = ?`
  
          db.pool.query(queryUpdateOrder, [customerID, orderDate, orderStatus, shippedDate, orderTotal, orderID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  db.pool.query(selectCustomer, [customerID, orderDate, orderStatus, shippedDate, orderTotal], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});



// Update Order Details
app.put('/put-orderdetails-ajax', function(req,res,next){
    let data = req.body;
    
    let orderLine = data.orderLine;
    let orderID = data.orderID;
    let productID = data.productID;
    let quantity = data.quantity;
    let itemPrice = data.itemPrice;
    let orderDetailsID = parseInt(data.orderDetailsID);
    console.log(data);

    let queryUpdateOrderDetail = `UPDATE OrderDetails SET orderLine = COALESCE(NULLIF(?, ''), orderLine), orderID = COALESCE(NULLIF(?, ''), orderID), productID = COALESCE(NULLIF(?, ''), productID), quantity = COALESCE(NULLIF(?, ''), quantity), itemPrice = COALESCE(NULLIF(?, ''), itemPrice) WHERE OrderDetails.orderDetailsID = ?`;
    let selectOrder = `SELECT * FROM Orders WHERE orderID = ?`
  
          db.pool.query(queryUpdateOrderDetail, [orderLine, orderID, productID, quantity, itemPrice, orderDetailsID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  db.pool.query(selectOrder, [orderID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

// UPDATE Product
app.put('/put-product-ajax', function(req,res,next){
    let data = req.body;
  
    let categoryID = data.categoryID;
    let productID = data.productID;

    let queryUpdateProduct = `UPDATE Products SET categoryID = COALESCE(NULLIF(?, ''), NULL) WHERE Products.productID = ?`;
    let selectCategory = `SELECT * FROM Categories WHERE categoryID = ?`
        
          db.pool.query(queryUpdateProduct, [categoryID, productID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  db.pool.query(selectCategory, [categoryID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});



// DELETE Order
app.delete('/delete-order-ajax/', function(req,res,next){
    let data = req.body;
    let orderID = parseInt(data.id);
    let deleteOrderDetail = `DELETE FROM OrderDetails WHERE orderDetailsID = ?`;
    let deleteOrder = `DELETE FROM Orders WHERE orderID = ?`;
  
  
          db.pool.query(deleteOrderDetail, [orderID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  db.pool.query(deleteOrder, [orderID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});  

// DELETE Product 
app.delete('/delete-product-ajax/', function(req,res,next){
    let data = req.body;
    let productID = data.id;
    console.log(data)

    let deleteOrderDetail = `DELETE FROM OrderDetails WHERE orderDetailsID = ?`;
    let deleteProduct = `DELETE FROM Products WHERE productID = ?`;
  
  
          db.pool.query(deleteOrderDetail, [productID], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  db.pool.query(deleteProduct, [productID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});  
  


/* LISTENER */
app.listen(PORT, function(){            
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

