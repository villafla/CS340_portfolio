// Citation for the following code
// Date: 5/21/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateOrderDetailsForm = document.getElementById('update-orderdetails-form-ajax');

// Modify the objects we need
updateOrderDetailsForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();
    

    // Get form fields we need to get data from
    let inputOrderDetailsID = document.getElementById("input-orderdetailsID-update");
    let inputOrderLine= document.getElementById("input-orderLine-update");
    let inputOrderID= document.getElementById("input-orderID-update");
    let inputProductID= document.getElementById("input-productID-update");
    let inputQuantity = document.getElementById("input-quantity-update");
    let inputItemPrice= document.getElementById("input-itemPrice-update");


    // Get the values from the form fields
    let orderDetailsIDValue = inputOrderDetailsID.value;
    let orderLineValue = inputOrderLine.value;
    let orderIDValue = inputOrderID.value;
    let productIDValue = inputProductID.value;
    let quantityValue = inputQuantity.value;
    let itemPriceValue = inputItemPrice.value;


    // Put our data we want to send in a javascript object
    let data = {
        orderDetailsID: orderDetailsIDValue,
        orderLine: orderLineValue,
        orderID: orderIDValue,
        productID: productIDValue, 
        quantity: quantityValue,
        itemPrice: itemPriceValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-orderdetails-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderDetailsIDValue);
            window.alert('Order Details was updated successfully');
            window.location.reload();
            

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, orderDetailsID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("details-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderDetailsID) {

            // Get the location of the row where we found the matching orderDetailsID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            
            let td = updateRowIndex.getElementsByTagName("td")[2];
            let td1 = updateRowIndex.getElementsByTagName("td")[3];
            let td2 = updateRowIndex.getElementsByTagName("td")[4];
            let td3 = updateRowIndex.getElementsByTagName("td")[5];
            let td4 = updateRowIndex.getElementsByTagName("td")[6];

            td.innerHTML = parsedData[0].orderLine; 
            td1.innerHTML = parsedData[0].orderID; 
            td2.innerHTML = parsedData[0].productID; 
            td3.innerHTML = parsedData[0].quantity; 
            td4.innerHTML = parsedData[0].itemPrice; 

       
       }
    }
}
