// Citation for the following code
// Date: 6/01/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// Get the objects we need to modify
let updateProductForm = document.getElementById('update-product-form-ajax');

// Modify the objects we need
updateProductForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();
    

    // Get form fields we need to get data from
    let inputProductID = document.getElementById("input-productID-update");
    let inputCategoryID= document.getElementById("input-categoryID-update");


    // Get the values from the form fields
    let productIDValue = inputProductID.value;
    let categoryIDValue = inputCategoryID.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        productID: productIDValue,
        categoryID: categoryIDValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, productIDValue);
            window.alert('Product category was updated successfully');
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, productID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("products-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == productID) {

            // Get the location of the row where we found the matching productID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            

            let td1 = updateRowIndex.getElementsByTagName("td")[3];
            td1.innerHTML = parsedData[0].categoryID; 
       
       }
    }
}