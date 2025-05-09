// Citation for the following code 
// Date: 5/21/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


let addDetailsForm = document.getElementById('add-details-form-ajax');

addDetailsForm.addEventListener("submit", function (e) {
    
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderLine = document.getElementById("input-orderLine");
    let inputOrderID = document.getElementById("input-orderID");
    let inputProductID = document.getElementById("input-productID");
    let inputQuantity = document.getElementById("input-quantity");
    let inputItemPrice = document.getElementById("input-itemPrice");


    // Get the values from the form fields
    let orderLineValue = inputOrderLine.value;
    let orderIDValue = inputOrderID.value;
    let productIDValue = inputProductID.value;
    let quantityValue = inputQuantity.value;
    let itemPriceValue = inputItemPrice.value;


    // Put our data we want to send in a javascript object
    let data = {
        orderLine: orderLineValue,
        orderID: orderIDValue,
        productID: productIDValue,
        quantity: quantityValue,
        itemPrice: itemPriceValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-details-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            window.alert('Order Details was added successfully');
            window.location.reload();

            // Clear the input fields for another transaction
            inputOrderLine.value = '';
            inputOrderID.value = '';
            inputProductID.value = '';
            inputQuantity.value = '';
            inputItemPrice.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Order Details
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("details-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row and cells
    let row = document.createElement("TR");
    let orderDetailsIDCell = document.createElement("TD");
    let orderLineCell = document.createElement("TD");
    let productIDCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let itemPriceCell = document.createElement("TD");


    // Fill the cells with correct data
    orderDetailsIDCell.innerText = newRow.orderDetailsID;
    orderLineCell.innerText = newRow.orderLine;
    productIDCell.innerText = newRow.productID;
    quantityCell.innerText = newRow.quantity;
    itemPriceCell.innerText = newRow.itemPrice;

    // Add the cells to the row 
    row.appendChild(orderDetailsIDCell);
    row.appendChild(orderLineCell);
    row.appendChild(productIDCell);
    row.appendChild(quantityCell);
    row.appendChild(itemPriceCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}