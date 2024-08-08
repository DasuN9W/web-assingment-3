//intialize price for each products.
const prices = {
    'Apple': 200,
    'Banana': 200,
    'Orange': 200,
    'Grapes': 200,
    'Mango': 200,
    'Pineapple': 200,
    'Carrot': 200,
    'Beans': 200,
    'beet-root': 200,
    'Potato': 200,
    'Tomato': 200,
    'Onion': 200,
    'milk-powder': 200,
    'Cheese': 200,
    'Yogurt': 200,
    'Butter': 200,
    'Cream': 200,
    'Eggs': 200,
    'Chicken': 200,
    'Salmon': 200,
    'Beef': 200,
    'Shrimp': 200,
    'Pork': 200,
    'Lamb': 200,
    'Flour': 200,
    'Sugar': 200,
    'Baking Powder': 200,
    'salt': 200,
    'bell-pepper': 200,
    'chocolate-powder': 200,
};

//add items to the order table
function addItem(name, category) {

    //parse the quantity for the each item
    const quantityInput = document.getElementById(`${name.toLowerCase().replace(' ', '-')}-quantity`);
    const quantity = parseFloat(quantityInput.value);

    //check quantity is greater than zero or not
    if (quantity > 0) {
        const price = prices[name] * quantity; //calculate price for the enter quantity
        const tableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];
        const rows = tableBody.getElementsByTagName('tr');
        let itemExists = false;

        //check any products already in order table
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.cells[0].textContent === name) {
                //if items in order table update pice and quantity

                const existingQuantity = parseFloat(row.cells[2].textContent);
                row.cells[2].textContent = (existingQuantity + quantity).toFixed(1);
                row.cells[3].textContent = (parseFloat(row.cells[3].textContent) + price).toFixed(2);
                itemExists = true;
                break;
            }
        }
//if products not in order table update the order table and add row for order details
        if (!itemExists) {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = name;
            row.insertCell(1).textContent = category;
            row.insertCell(2).textContent = quantity.toFixed(1);
            row.insertCell(3).textContent = price.toFixed(2);
            row.insertCell(4).innerHTML = '<button onclick="removeItem(this)">Remove</button>';
        }
        updateTotalPrice(); //after upate the table count total price
        alert(`Added ${quantity.toFixed(1)} kg of ${name} to your order.\nThank For Choose Us...`);
    } else {
        alert(`Please enter a quantity greater than 0 for ${name}.`);//if quantity is not greater than zero notify user to eneter quantity greater than zero
    }
}

//remove item from orer table when click on remove button
function removeItem(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);//remove the order row
    updateTotalPrice(); //after remove the order, count total price again 
}

//update total price
function updateTotalPrice() {
    let totalPrice = 0;
    const rows = document.querySelectorAll('#order-table tbody tr'); //read all rows in the order table
    rows.forEach(row => {
        const price = parseFloat(row.children[3].textContent); //read prices from each products
        totalPrice += price; //sum to the prices
    });
    document.getElementById('total-price').textContent = `Rs${totalPrice.toFixed(2)}`; //update total in displyed on the web page
}

//add items to favorite
function addToFavourites() {
    const rows = document.querySelectorAll('#order-table tbody tr');
    if (rows.length === 0) {

        //if there not any items in order give alert message to user
        alert('No items to add to favorite.\nplease choose products to add favorite...!');
        return;
    }
    
    const favourites = JSON.parse(localStorage.getItem('favourites')) || []; //store in the local storage.

    rows.forEach(row => {

        //get the order details from the table
        const itemName = row.children[0].textContent;
        const category = row.children[1].textContent;
        const quantity = row.children[2].textContent;
        const price = row.children[3].textContent;
            
        //check order is not in already in favorite array.
        if (!favourites.some(fav => fav.itemName === itemName)) {
            favourites.push({ itemName, category, quantity, price }); // order is not in array add it to favorite array.
        }
    });

    localStorage.setItem('favourites', JSON.stringify(favourites)); //updated the favorite array into the local storage.
    alert('Chosen products added to favourites.\nYou can apply it after you choose products.'); //give alert messsage to user to notify their order added to favorites
}

function applyFavourites() {
    //get the favorite array from local storage or get as empty array it is dosen't exist in local storage.
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    //check there are any favorite to apply 
    if (favourites.length === 0) {

        //if there are not any favorite give alert to user and exit the funtions
        alert('No favourites to apply.\nYou can add favorite to apply favorite..');
        return;
    }
    
    //table body from the order table.
    const tableBody = document.getElementById('order-table').getElementsByTagName('tbody')[0];

    //iterate over each favorite item
    favourites.forEach(fav => {
        const rows = tableBody.getElementsByTagName('tr'); //all rows from the order table.
        let itemExists = false;

        //check any item already exist in the order table.
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.cells[0].textContent === fav.itemName) {

                //if item already exist ,update the quantity and prices.
                const existingQuantity = parseFloat(row.cells[2].textContent);
                const quantityToAdd = parseFloat(fav.quantity);
                row.cells[2].textContent = (existingQuantity + quantityToAdd).toFixed(1);
                row.cells[3].textContent = (parseFloat(row.cells[3].textContent) + (prices[fav.itemName] * quantityToAdd)).toFixed(2);
                itemExists = true;
                break;
            }
        }

        //if the items dosen't exsit update new row for order.
        if (!itemExists) {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = fav.itemName;
            row.insertCell(1).textContent = fav.category;
            row.insertCell(2).textContent = fav.quantity;
            row.insertCell(3).textContent = fav.price;
            row.insertCell(4).innerHTML = '<button onclick="removeItem(this)">Remove</button>';
        }
    });

    //update the total price after appling the favorites.
    updateTotalPrice();

    //give alert to user to their order apply from favorite.
    alert('Your chosen products were applied.\nYou can customize it.');
}

function clearLocalStorage() {

    //remove the customer favorite from the local storage.
    localStorage.removeItem('favourites');

    //give alert messase user to notify the their favorite cleared .
    alert('Your favourites have been cleared.\nYou can choose again what you want!');
}

function navigateToCheckout() {

    //getting all rows from the order table.
    const rows = document.querySelectorAll('#order-table tbody tr');

    //check if there not any order in order table.
    if (rows.length === 0) {

        //if not  any items found in order table give alert and notify the user there are not any order to checkout.
        alert('No items in the order to Purchase...!');
        return;
    }

    //intialize array to store the order details.
    const orderDetails = [];

    //iterate all rows from the table.
    rows.forEach(row => {

        //get order details from each rows.
        const itemName = row.children[0].textContent;
        const category = row.children[1].textContent;
        const quantity = row.children[2].textContent;
        const price = row.children[3].textContent;

        //add the order details info to the order details array above we created.
        orderDetails.push({ itemName, category, quantity, price });
    });

    //store the order details in local storage.
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    //redirect user to pay.html page to checkout their order.
    window.location.href = 'odercon.html';
}
document.addEventListener("DOMContentLoaded", function () {
    //attached the submit event listner to the ceckout form.

    document.getElementById("checkout-form").addEventListener("submit", submitOrder);
    //call the funtion populate order details on the page load
    populateOrderDetails();
});

function submitOrder(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    //retrieve form input 
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const town = document.getElementById("town").value;
    const zip = document.getElementById("zip").value;
    const recoveryAddress = document.getElementById("recoveryAddress").value;
    const paymentType = document.getElementById("paymentType").value;
    const cardName = document.getElementById("cardName").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    // Validate the user inputs.
    if (name && email && phone && address && town && zip && paymentType && cardName && expiryDate && cvv) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5); // Assuming delivery takes 5 days
        
        //create delivery date.
        const formattedDate = deliveryDate.toLocaleDateString("en-US", {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        //show alert to customer included name,adress,town,zip code and delivery date.
        alert(`Thank you for your purchase, ${name}! Your order will be delivered to ${address}, ${town}, ${zip} by ${formattedDate}.`);
    } else {
        //if customer dosen't fill every input in form give alert to customer to fill all fields.
        alert("Please fill in all required fields to checkout your order...!");
    }
}

// Function to populate order details on the pay.html page
function populateOrderDetails() {

    //retrieve the order detaild from localstorage or initialize an empty array.
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];

    //get the table body elemnt order details will be appended.
    const tableBody = document.querySelector('#checkout-order-table tbody');
    
    //initialize variable for the total price.
    let totalPrice = 0;

    //iterate other every details.
    orderDetails.forEach(detail => {

        //create new row in table
        const row = document.createElement('tr');

        //populate the row with customer order details
        row.innerHTML = `
            <td>${detail.itemName}</td>
            <td>${detail.category}</td>
            <td>${detail.quantity}</td>
            <td>${detail.price}</td>
        `;
        //append table row to table body
        tableBody.appendChild(row);

        // Extract price from the string, remove '$' and convert to number
        const priceValue = parseFloat(detail.price.replace('Rs.', ''));
        
        //add the price to the total pric
        totalPrice += priceValue;
    });

    //show the total price wich element have id named'total-price'
    document.getElementById('total-price').textContent = `Rs ${totalPrice.toFixed(2)}`;
}