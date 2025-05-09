// Citation for the following code 
// Date: 5/21/23
// Adapted from CS 340 Node JS Starter Code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addProductForm = document.getElementById('add-product-form-ajax');


// Modify the objects we need
addProductForm.addEventListener("submit", function (e) {
  
   // Prevent the form from submitting
   e.preventDefault();


   // Get form fields we need to get data from
   let inputProductID = document.getElementById("input-productID");
   let inputProductName = document.getElementById("input-productName");
   let inputCategoryID = document.getElementById("input-categoryID");
   let inputQuantityInStock = document.getElementById("input-quantityInStock");
   let inputRetailPrice = document.getElementById("input-retailPrice");
   let inputMsrp = document.getElementById("input-msrp");

   // Get the values from the form fields
   let productIDValue = inputProductID.value;
   let productNameValue = inputProductName.value;
   let categoryIDValue = inputCategoryID.value;
   let quantityInStockValue = inputQuantityInStock.value;
   let retailPriceValue = inputRetailPrice.value;
   let msrpValue = inputMsrp.value;


   // Put our data we want to send in a javascript object
   let data = {
       productID: productIDValue,
       productName: productNameValue,
       categoryID: categoryIDValue,
       quantityInStock: quantityInStockValue,
       retailPrice: retailPriceValue,
       msrp: msrpValue
   }
  
   // Setup our AJAX request
   var xhttp = new XMLHttpRequest();
   xhttp.open("POST", "/add-products-ajax", true);
   xhttp.setRequestHeader("Content-type", "application/json");


   // Tell our AJAX request how to resolve
   xhttp.onreadystatechange = () => {
       if (xhttp.readyState == 4 && xhttp.status == 200) {


           // Add the new data to the table
           addRowToTable(xhttp.response);
           window.alert('Product was added successfully');
           window.location.reload();


           // Clear the input fields for another transaction
           inputProductID.value = '';
           inputProductName.value = '';
           inputCategoryID.value = '';
           inputQuantityInStock.value = '';
           inputRetailPrice.value = '';
           inputMsrp.value = '';
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
   let currentTable = document.getElementById("products-table");


   // Get the location where we should insert the new row (end of table)
   let newRowIndex = currentTable.rows.length;


   // Get a reference to the new row from the database query (last object)
   let parsedData = JSON.parse(data);
   let newRow = parsedData[parsedData.length - 1]


   // Create a row and cells
   let row = document.createElement("TR");
   let idCell = document.createElement("TD");
   let productNameCell = document.createElement("TD");
   let categoryIDCell = document.createElement("TD");
   let quantityInStockCell = document.createElement("TD");
   let retailPriceCell = document.createElement("TD");
   let msrpCell = document.createElement("TD");

   let deleteCell = document.createElement("TD");

   // Fill the cells with correct data
   idCell.innerText = newRow.productID;
   productNameCell.innerText = newRow.productName;
   categoryIDCell.innerText = newRow.categoryID;
   quantityInStockCell.innerText = newRow.quantityInStock;
   retailPriceCell.innerText = newRow.retailPrice;
   msrpCell.innerText = newRow.msrp;

   deleteCell = document.createElement("button");
   deleteCell.innerHTML = "Delete";
   deleteCell.onclick = function(){
       deleteProduct(newRow.id);
   };

   // Add the cells to the row
   row.appendChild(idCell);
   row.appendChild(productNameCell);
   row.appendChild(categoryIDCell);
   row.appendChild(quantityInStockCell);
   row.appendChild(retailPriceCell);
   row.appendChild(msrpCell);
   row.appendChild(deleteCell);

    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
 

   // Add the row to the table
   currentTable.appendChild(row);

}

