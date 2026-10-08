/* =========================
   INITIAL FOOD DATA
========================= */

let foods = JSON.parse(localStorage.getItem("foods"));

if (!foods) {

    foods = [
        {
            id: 1,
            name: "Pizza",
            price: 250,
            category: "Fast Food"
        },
        {
            id: 2,
            name: "Burger",
            price: 150,
            category: "Fast Food"
        },
        {
            id: 3,
            name: "Biryani",
            price: 220,
            category: "Indian"
        },
        {
            id: 4,
            name: "Dosa",
            price: 100,
            category: "South Indian"
        }
    ];

    localStorage.setItem("foods", JSON.stringify(foods));
}


/* =========================
   SIGNUP
========================= */

function signup() {

    let name = document.getElementById("signupName").value;
    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;

    if (name === "" || email === "" || password === "") {
        document.getElementById("signupMessage").innerText =
            "Please fill all fields.";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let existingUser = users.find(user => user.email === email);

    if (existingUser) {
        document.getElementById("signupMessage").innerText =
            "User already exists.";
        return;
    }

    let newUser = {
        name: name,
        email: email,
        password: password,
        role: "user"
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("signupMessage").innerText =
        "Signup successful! Redirecting...";

    setTimeout(function () {
        window.location.href = "login.html";
    }, 1000);
}


/* =========================
   LOGIN
========================= */

function login() {

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    /*
       Default admin account
    */

    if (email === "admin@food.com" && password === "admin123") {

        let admin = {
            name: "Administrator",
            email: email,
            role: "admin"
        };

        localStorage.setItem("currentUser", JSON.stringify(admin));

        window.location.href = "admin.html";

        return;
    }


    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(
        user => user.email === email &&
                user.password === password
    );


    if (user) {

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        window.location.href = "user.html";

    } else {

        document.getElementById("loginMessage").innerText =
            "Invalid email or password.";
    }
}


/* =========================
   USER PAGE
========================= */

function loadUserPage() {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "user") {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("welcomeUser").innerText =
        "Welcome " + currentUser.name;

    displayFoods();
    displayCart();
    displayUserOrders();
}


/* =========================
   DISPLAY FOOD
========================= */

function displayFoods() {

    let foods =
        JSON.parse(localStorage.getItem("foods")) || [];

    let foodList =
        document.getElementById("foodList");

    foodList.innerHTML = "";

    foods.forEach(food => {

        foodList.innerHTML += `

            <div class="food-card">

                <h3>🍽️ ${food.name}</h3>

                <p>Category: ${food.category}</p>

                <p><b>₹${food.price}</b></p>

                <button onclick="addToCart(${food.id})">
                    Add to Cart
                </button>

            </div>
        `;
    });
}


/* =========================
   ADD TO CART
========================= */

function addToCart(foodId) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let foods =
        JSON.parse(localStorage.getItem("foods")) || [];

    let food = foods.find(item => item.id === foodId);

    if (food) {
        cart.push(food);
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

    alert(food.name + " added to cart!");
}


/* =========================
   DISPLAY CART
========================= */

function displayCart() {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let cartList =
        document.getElementById("cartList");

    let cartTotal =
        document.getElementById("cartTotal");

    if (!cartList) return;

    cartList.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += Number(item.price);

        cartList.innerHTML += `

            <div class="cart-item">

                <span>
                    ${item.name} - ₹${item.price}
                </span>

                <button onclick="removeFromCart(${index})">
                    Remove
                </button>

            </div>
        `;
    });

    cartTotal.innerText = "Total: ₹" + total;
}


/* =========================
   REMOVE FROM CART
========================= */

function removeFromCart(index) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


/* =========================
   PLACE ORDER
========================= */

function placeOrder() {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {

        document.getElementById("orderMessage").innerText =
            "Your cart is empty.";

        return;
    }

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    let orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let total = 0;

    cart.forEach(item => {
        total += Number(item.price);
    });

    let newOrder = {

        id: Date.now(),

        customer: currentUser.name,

        email: currentUser.email,

        items: cart,

        total: total,

        status: "Order Placed"
    };

    orders.push(newOrder);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    localStorage.removeItem("cart");

    document.getElementById("orderMessage").innerText =
        "Order placed successfully!";

    displayCart();
    displayUserOrders();
}


/* =========================
   USER ORDERS
========================= */

function displayUserOrders() {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    let orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let userOrders =
        document.getElementById("userOrders");

    if (!userOrders) return;

    userOrders.innerHTML = "";

    let myOrders = orders.filter(
        order => order.email === currentUser.email
    );

    if (myOrders.length === 0) {

        userOrders.innerHTML =
            "<p>No orders found.</p>";

        return;
    }

    myOrders.forEach(order => {

        let itemNames =
            order.items.map(item => item.name).join(", ");

        userOrders.innerHTML += `

            <div class="order-card">

                <h3>Order #${order.id}</h3>

                <p>Items: ${itemNames}</p>

                <p>Total: ₹${order.total}</p>

                <p>Status: <b>${order.status}</b></p>

            </div>
        `;
    });
}


/* =========================
   ADMIN PAGE
========================= */

function loadAdminPage() {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {

        window.location.href = "login.html";

        return;
    }

    displayAdminFoods();
    displayAdminOrders();
}


/* =========================
   ADD FOOD
========================= */

function addFood() {

    let name =
        document.getElementById("foodName").value;

    let price =
        document.getElementById("foodPrice").value;

    let category =
        document.getElementById("foodCategory").value;

    if (name === "" || price === "" || category === "") {

        alert("Please fill all fields.");

        return;
    }

    let foods =
        JSON.parse(localStorage.getItem("foods")) || [];

    let newFood = {

        id: Date.now(),

        name: name,

        price: Number(price),

        category: category
    };

    foods.push(newFood);

    localStorage.setItem(
        "foods",
        JSON.stringify(foods)
    );

    document.getElementById("foodName").value = "";
    document.getElementById("foodPrice").value = "";
    document.getElementById("foodCategory").value = "";

    displayAdminFoods();

    alert("Food item added successfully!");
}


/* =========================
   DISPLAY ADMIN FOOD
========================= */

function displayAdminFoods() {

    let foods =
        JSON.parse(localStorage.getItem("foods")) || [];

    let list =
        document.getElementById("adminFoodList");

    if (!list) return;

    list.innerHTML = "";

    foods.forEach(food => {

        list.innerHTML += `

            <div class="admin-food">

                <div>
                    <b>${food.name}</b>
                    <br>
                    ₹${food.price}
                    <br>
                    ${food.category}
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteFood(${food.id})">
                    Delete
                </button>

            </div>
        `;
    });
}


/* =========================
   DELETE FOOD
========================= */

function deleteFood(foodId) {

    let foods =
        JSON.parse(localStorage.getItem("foods")) || [];

    foods = foods.filter(
        food => food.id !== foodId
    );

    localStorage.setItem(
        "foods",
        JSON.stringify(foods)
    );

    displayAdminFoods();
}


/* =========================
   DISPLAY ALL ORDERS
========================= */

function displayAdminOrders() {

    let orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let adminOrders =
        document.getElementById("adminOrders");

    if (!adminOrders) return;

    adminOrders.innerHTML = "";

    if (orders.length === 0) {

        adminOrders.innerHTML =
            "<p>No customer orders yet.</p>";

        return;
    }

    orders.forEach(order => {

        let items =
            order.items.map(item => item.name).join(", ");

        adminOrders.innerHTML += `

            <div class="order-card">

                <h3>Order #${order.id}</h3>

                <p>
                    Customer:
                    <b>${order.customer}</b>
                </p>

                <p>Email: ${order.email}</p>

                <p>Items: ${items}</p>

                <p>Total: ₹${order.total}</p>

                <p>Status:
                    <b>${order.status}</b>
                </p>

            </div>
        `;
    });
}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("currentUser");

    localStorage.removeItem("cart");

    window.location.href = "index.html";
}