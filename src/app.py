"""
Food Ordering System API

A super simple FastAPI application that allows customers to view menu items
and place orders at The Delicious Bite Restaurant.
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os
from pathlib import Path

app = FastAPI(title="The Delicious Bite Restaurant API",
              description="API for viewing menu items and placing food orders")

# Mount the static files directory
current_dir = Path(__file__).parent
app.mount("/static", StaticFiles(directory=os.path.join(Path(__file__).parent,
          "static")), name="static")

# In-memory menu database
menu_items = {
    "Margherita Pizza": {
        "description": "Classic pizza with fresh mozzarella, tomatoes, and basil",
        "price": 12.99,
        "category": "Main Course",
        "available": True
    },
    "Caesar Salad": {
        "description": "Crisp romaine lettuce with parmesan cheese and croutons",
        "price": 8.99,
        "category": "Appetizer",
        "available": True
    },
    "Chocolate Lava Cake": {
        "description": "Warm chocolate cake with a molten chocolate center",
        "price": 6.99,
        "category": "Dessert",
        "available": True
    },
    "Grilled Salmon": {
        "description": "Fresh Atlantic salmon with lemon butter sauce and vegetables",
        "price": 18.99,
        "category": "Main Course",
        "available": True
    },
    "Cheeseburger": {
        "description": "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
        "price": 10.99,
        "category": "Main Course",
        "available": True
    }
}

# In-memory orders storage
orders = []


@app.get("/")
def root():
    return RedirectResponse(url="/static/index.html")


@app.get("/menu")
def get_menu():
    """Get all menu items"""
    return menu_items


@app.post("/orders")
def place_order(customer_name: str, customer_email: str, item_name: str, quantity: int = 1):
    """Place an order for a menu item"""
    # Validate menu item exists
    if item_name not in menu_items:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Get the menu item
    item = menu_items[item_name]
    
    # Check if item is available
    if not item["available"]:
        raise HTTPException(status_code=400, detail="Menu item is currently unavailable")
    
    # Calculate total price
    total_price = item["price"] * quantity
    
    # Create order
    order = {
        "customer_name": customer_name,
        "customer_email": customer_email,
        "item_name": item_name,
        "quantity": quantity,
        "total_price": total_price
    }
    
    # Add to orders list
    orders.append(order)
    
    return {
        "message": f"Order placed successfully for {customer_name}",
        "order": order
    }
