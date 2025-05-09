// Citation for the following code
// Date: 5/21/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("input-orderID");
    let inputCustomerID= document.getElementById("input-customerID-update");
    let inputOrderDate= document.getElementById("input-orderDate-update");
    let inputOrderStatus= document.getElementById("input-orderStatus-update");
    let inputShippedDate= document.getElementById("input-shippedDate-update");
    let inputOrderTotal= document.getElementById("input-orderTotal-update");

    // Get the values from the form fields
    let orderIDValue = inputOrderID.value;
    let customerIDValue = inputCustomerID.value;
    let orderDateValue = inputOrderDate.value;
    let orderStatusValue = inputOrderStatus.value;
    let shippedDateValue = inputShippedDate.value;
    let orderTotalValue = inputOrderTotal.value;


    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        customerID: customerIDValue,
        orderDate: orderDateValue,
        orderStatus: orderStatusValue,
        shippedDate: shippedDateValue,
        orderTotal: orderTotalValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderIDValue);
            window.alert('Order was updated successfully');
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, orderID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching orderID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td = updateRowIndex.getElementsByTagName("td")[2];
            let td1 = updateRowIndex.getElementsByTagName("td")[3];
            let td2 = updateRowIndex.getElementsByTagName("td")[4];
            let td3 = updateRowIndex.getElementsByTagName("td")[5];
            let td4 = updateRowIndex.getElementsByTagName("td")[6];
       
            td.innerHTML = parsedData[0].customerID; 
            td1.innerHTML = parsedData[0].orderDate; 
            td2.innerHTML = parsedData[0].orderStatus; 
            td3.innerHTML = parsedData[0].shippedDate; 
            td4.innerHTML = parsedData[0].orderTotal; 
       }
    }
}
