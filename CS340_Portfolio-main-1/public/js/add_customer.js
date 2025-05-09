// Citation for the following code
// Date: 5/21/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


let addCustomerForm = document.getElementById('add-customer-form-ajax');

addCustomerForm.addEventListener("submit", function (e) {
    
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-firstName");
    let inputLastName = document.getElementById("input-lastName");
    let inputAddressLine1 = document.getElementById("input-addressLine1");
    let inputAddressLine2 = document.getElementById("input-addressLine2");
    let inputCity = document.getElementById("input-city");
    let inputState = document.getElementById("input-state");
    let inputZipCode = document.getElementById("input-zipCode");
    let inputCountry = document.getElementById("input-country");
    let inputEmail = document.getElementById("input-email");
    let inputPhone = document.getElementById("input-phone");


    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let addressLine1Value = inputAddressLine1.value;
    let addressLine2Value = inputAddressLine2.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let zipCodeValue = inputZipCode.value;
    let countryValue = inputCountry.value;
    let emailValue = inputEmail.value;
    let phoneValue = inputPhone.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        addressLine1: addressLine1Value,
        addressLine2: addressLine2Value,
        city: cityValue,
        state: stateValue,
        zipCode: zipCodeValue,
        country: countryValue,
        email: emailValue,
        phone: phoneValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            window.alert('Customer was added successfully');
            window.location.reload();

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputAddressLine1.value = '';
            inputAddressLine2.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputZipCode.value = '';
            inputCountry.value = '';
            inputEmail.value = '';
            inputPhone.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Customers
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("customers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create row and cells
    let row = document.createElement("TR");
    let customerIDCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let addressLine1Cell = document.createElement("TD");
    let addressLine2Cell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let zipCodeCell = document.createElement("TD");
    let countryCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");

    // Fill the cells with correct data
    customerIDCell.innerText = newRow.customerID;
    firstNameCell.innerText = newRow.firstName;
    lastNameCell.innerText = newRow.lastName;
    addressLine1Cell.innerText = newRow.addressLine1;
    addressLine2Cell.innerText = newRow.addressLine2;
    cityCell.innerText = newRow.city;
    stateCell.innerText = newRow.state;
    zipCodeCell.innerText = newRow.zipCode;
    countryCell.innerText = newRow.country;
    emailCell.innerText = newRow.email;
    phoneCell.innerText = newRow.phone;

    // Add the cells to the row 
    row.appendChild(customerIDCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(addressLine1Cell);
    row.appendChild(addressLine2Cell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(zipCodeCell);
    row.appendChild(countryCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}