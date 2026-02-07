document.addEventListener("DOMContentLoaded", () => {
  const menuList = document.getElementById("menu-list");
  const menuItemSelect = document.getElementById("menu-item");
  const orderForm = document.getElementById("order-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch menu items from API
  async function fetchMenu() {
    try {
      const response = await fetch("/menu");
      const menuItems = await response.json();

      // Clear loading message
      menuList.innerHTML = "";

      // Populate menu list
      Object.entries(menuItems).forEach(([name, details]) => {
        const menuCard = document.createElement("div");
        menuCard.className = "menu-card";

        menuCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Category:</strong> ${details.category}</p>
          <p class="price"><strong>Price:</strong> $${details.price.toFixed(2)}</p>
          <p class="${details.available ? 'available' : 'unavailable'}">
            ${details.available ? '✓ Available' : '✗ Unavailable'}
          </p>
        `;

        menuList.appendChild(menuCard);

        // Add option to select dropdown if available
        if (details.available) {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = `${name} - $${details.price.toFixed(2)}`;
          menuItemSelect.appendChild(option);
        }
      });
    } catch (error) {
      menuList.innerHTML = "<p>Failed to load menu. Please try again later.</p>";
      console.error("Error fetching menu:", error);
    }
  }

  // Handle form submission
  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const customerName = document.getElementById("customer-name").value;
    const customerEmail = document.getElementById("customer-email").value;
    const itemName = document.getElementById("menu-item").value;
    const quantity = document.getElementById("quantity").value;

    try {
      const response = await fetch(
        `/orders?customer_name=${encodeURIComponent(customerName)}&customer_email=${encodeURIComponent(customerEmail)}&item_name=${encodeURIComponent(itemName)}&quantity=${quantity}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = `${result.message} - Total: $${result.order.total_price.toFixed(2)}`;
        messageDiv.className = "success";
        orderForm.reset();
        document.getElementById("quantity").value = 1; // Reset quantity to 1
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to place order. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error placing order:", error);
    }
  });

  // Initialize app
  fetchMenu();
});
