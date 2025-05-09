// Citation for the following code 
// Date: 5/21/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form-ajax');


// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
  
   // Prevent the form from submitting
   e.preventDefault();


   // Get form fields we need to get data from
   let inputCustomerID = document.getElementById("input-customerID");
   let inputOrderDate = document.getElementById("input-orderDate");
   let inputOrderStatus = document.getElementById("input-orderStatus");
   let inputShippedDate = document.getElementById("input-shippedDate");
   let inputOrderTotal = document.getElementById("input-orderTotal");


   // Get the values from the form fields
   let customerIDValue = inputCustomerID.value;
   let orderDateValue = inputOrderDate.value;
   let orderStatusValue = inputOrderStatus.value;
   let shippedDateValue = inputShippedDate.value;
   let orderTotalValue = inputOrderTotal.value;

   // Displays alert if user entered order date value greater than shipped date value
   if (shippedDateValue !== '' && orderDateValue > shippedDateValue){
    console.log(shippedDateValue)
    alert('Order Date must be before Shipped Date')
    return
}

   // Put our data we want to send in a javascript object
   let data = {
       customerID: customerIDValue,
       orderDate: orderDateValue,
       orderStatus: orderStatusValue,
       shippedDate: shippedDateValue,
       orderTotal: orderTotalValue
   }
  
   // Setup our AJAX request
   var xhttp = new XMLHttpRequest();
   xhttp.open("POST", "/add-orders-ajax", true);
   xhttp.setRequestHeader("Content-type", "application/json");


   // Tell our AJAX request how to resolve
   xhttp.onreadystatechange = () => {
       if (xhttp.readyState == 4 && xhttp.status == 200) {


           // Add the new data to the table
           addRowToTable(xhttp.response);
           window.alert('Order was added successfully');
           window.location.reload();
           

           // Clear the input fields for another transaction
           inputCustomerID.value = '';
           inputOrderDate.value = '';
           inputOrderStatus.value = '';
           inputShippedDate.value = '';
           inputOrderTotal.value = '';
       }
       else if (xhttp.readyState == 4 && xhttp.status != 200) {
           console.log("There was an error with the input.")
       }
   }


   // Send the request and wait for the response
   xhttp.send(JSON.stringify(data));


})


addRowToTable = (data) => {


   // Get a reference to the current table on the page and clear it out.
   let currentTable = document.getElementById("orders-table");


   // Get the location where we should insert the new row (end of table)
   let newRowIndex = currentTable.rows.length;


   // Get a reference to the new row from the database query (last object)
   let parsedData = JSON.parse(data);
   let newRow = parsedData[parsedData.length - 1]


   // Create a row and cells
   let row = document.createElement("TR");
   let idCell = document.createElement("TD");
   let customerIDCell = document.createElement("TD");
   let orderDateCell = document.createElement("TD");
   let orderStatusCell = document.createElement("TD");
   let shippedDateCell = document.createElement("TD");
   let orderTotalCell = document.createElement("TD");

   let deleteCell = document.createElement("TD");

   // Fill the cells with correct data
   idCell.innerText = newRow.orderID;
   customerIDCell.innerText = newRow.customerID;
   orderDateCell.innerText = newRow.orderDate;
   orderStatusCell.innerText = newRow.orderStatus;
   shippedDateCell.innerText = newRow.shippedDate;
   orderTotalCell.innerText = newRow.orderTotal;

   deleteCell = document.createElement("button");
   deleteCell.innerHTML = "Delete";
   deleteCell.onclick = function(){
       deleteOrder(newRow.id);
   };

   // Add the cells to the row
   row.appendChild(idCell);
   row.appendChild(customerIDCell);
   row.appendChild(orderDateCell);
   row.appendChild(orderStatusCell);
   row.appendChild(shippedDateCell);
   row.appendChild(orderTotalCell);
   row.appendChild(deleteCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
 

   // Add the row to the table
   currentTable.appendChild(row);

}

