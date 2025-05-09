// Citation for the following code
// Date: 5/21/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

let addCategoryForm = document.getElementById('add-category-form-ajax');

addCategoryForm.addEventListener("submit", function (e) {
    
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCategoryName = document.getElementById("input-categoryName");

    // Get the values from the form fields
    let categoryNameValue = inputCategoryName.value;

    // Put our data we want to send in a javascript object
    let data = {
        categoryName: categoryNameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-category-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            window.alert('Category was added successfully');
            window.location.reload();

            // Clear the input fields for another transaction
            inputCategoryName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Categories
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("categories-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row and cells
    let row = document.createElement("TR");
    let categoryIDCell = document.createElement("TD");
    let categoryNameCell = document.createElement("TD");

    // Fill the cells with correct data
    categoryIDCell.innerText = newRow.categoryID;
    categoryNameCell.innerText = newRow.categoryName;

    // Add the cells to the row 
    row.appendChild(categoryIDCell);
    row.appendChild(categoryNameCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}