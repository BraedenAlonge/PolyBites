import fs from 'fs';
// https://api-gtm.grubhub.com/restaurants/3267177/menu_items
// Simulate the JSON you captured (later we will automate the fetching part)
import menuData from './subway-menu.json' assert { type: "json" }; // <-- Save your JSON file manually for now

// Function to extract menu items
function extractMenuItems(data) {
    const restaurantName = data.restaurant_data.restaurant.name;

    const menuItems = data.menu_items.map(item => ({
        restaurant: restaurantName,
        name: item.name,
        description: item.description,
        priceUSD: (item.minimum_price_variation.amount / 100).toFixed(2) // It's in cents
    }));

    return menuItems;
}

// Main function
function main() {
    const extracted = extractMenuItems(menuData);

    fs.writeFileSync('extracted_subway_menu.json', JSON.stringify(extracted, null, 2));

    console.log('✅ Menu items extracted and saved to extracted_menu.json');
}

main();