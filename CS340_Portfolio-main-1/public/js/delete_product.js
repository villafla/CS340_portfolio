// Citation for the following code
// Date: 6/01/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


function deleteProduct(productID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: productID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(productID);
            window.alert('Product was deleted successfully');
            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(productID){

    let table = document.getElementById("products-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
 
        if (table.rows[i].getAttribute("data-value") == productID) {
            table.deleteRow(i);
            
            break;
            
       }}
    }
