# College Canteen Billing System

A simple, user-friendly billing website for college canteen operations with image-based menu, order management, and bill generation.

## Features

- **Image Menu**: Visual menu with images for easy item selection
- **Order Management**: Add items, adjust quantities, and manage orders
- **Multiple Orders**: Handle multiple orders simultaneously
- **Order History**: Save and view completed orders
- **Bill Generation**: Generate and print formatted bills/receipts
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Menu Items

- Samosa - ₹15
- Egg Puffs - ₹25
- Veg Puffs - ₹20
- Vada - ₹12
- Putting Cake - ₹30
- Gooday Biscuit - ₹10

## Setup Instructions

1. **Download/Clone** all files to a local directory

2. **Add Menu Images** (Optional but Recommended):
   - Replace placeholder images in the `images/` folder with actual photos
   - Image files should be named exactly as follows:
     - `samosa.jpg`
     - `egg-puffs.jpg`
     - `veg-puffs.jpg`
     - `vada.jpg`
     - `putting-cake.jpg`
     - `gooday-biscuit.jpg`
   - Recommended image size: 200x200 pixels or larger
   - Supported formats: JPG, PNG, WebP

3. **Open the Website**:
   - Simply open `index.html` in a web browser
   - No server or installation required
   - Works offline after initial load

## Usage Guide

### Adding Items to Order

1. Browse the menu items displayed with images
2. Click the **+** button on any menu item to add it to your current order
3. Use **-** button to decrease quantity
4. The quantity is displayed between the buttons

### Managing Orders

- **Current Order Tab**: View and manage your active order
  - Adjust quantities using +/- buttons
  - Remove items using the "Remove" button
  - View order total at the bottom
  - Click "Complete Order" to finalize and save

- **Orders Tab**: View all active orders
  - Click on any order card to switch to that order
  - Create new orders using "New Order" button

- **History Tab**: View completed orders
  - All completed orders are saved automatically
  - Click "View Bill" to see formatted receipt
  - Use "Clear History" to remove all saved orders

### Generating Bills

1. Complete an order using "Complete Order" button
2. Go to "History" tab
3. Click "View Bill" on any completed order
4. Click "Print Bill" to print the receipt

### Modifying Prices

To change item prices, edit the `menuItems` array in `script.js`:

```javascript
const menuItems = [
    { id: 'samosa', name: 'Samosa', price: 15, image: 'images/samosa.jpg' },
    // ... update price values as needed
];
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari
- Opera

## Data Storage

- All order data is stored locally in your browser using LocalStorage
- No data is sent to any server
- Data persists even after closing the browser
- To clear all data, use "Clear History" button or clear browser LocalStorage

## File Structure

```
Project/
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── script.js           # JavaScript functionality
├── images/             # Menu item images
│   ├── samosa.jpg
│   ├── egg-puffs.jpg
│   ├── veg-puffs.jpg
│   ├── vada.jpg
│   ├── putting-cake.jpg
│   └── gooday-biscuit.jpg
└── README.md           # This file
```

## Customization

### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #50c878;
    /* ... modify as needed */
}
```

### Adding New Menu Items

1. Add image to `images/` folder
2. Add item to `menuItems` array in `script.js`:

```javascript
{ id: 'new-item', name: 'New Item', price: 20, image: 'images/new-item.jpg' }
```

## Troubleshooting

- **Images not showing**: Ensure image files exist in `images/` folder with correct names
- **Orders not saving**: Check browser LocalStorage is enabled
- **Print not working**: Ensure pop-ups are allowed for the page

## License

Free to use and modify for your college canteen.

## Support

For issues or questions, check the code comments in `script.js` for implementation details.
