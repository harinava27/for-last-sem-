// Menu Data
const menuItems = [
    { id: 'samosa', name: 'Samosa', price: 15, image: 'images/samosa.png' },
    { id: 'egg-puffs', name: 'Egg Puffs', price: 25, image: 'images/egg-puffs.png' },
    { id: 'veg-puffs', name: 'Veg Puffs', price: 20, image: 'images/veg-puffs.png' },
    { id: 'vada', name: 'Vada', price: 12, image: 'images/vada.png' },
    { id: 'putting-cake', name: 'Putting Cake', price: 30, image: 'images/putting-cake.png' },
    { id: 'gooday-biscuit', name: 'Gooday Biscuit', price: 10, image: 'images/gooday-biscuit.png' }
];

// Order Class
class Order {
    constructor(id) {
        this.id = id;
        this.items = [];
        this.timestamp = new Date();
        this.status = 'active';
    }

    addItem(itemId, quantity = 1) {
        const menuItem = menuItems.find(item => item.id === itemId);
        if (!menuItem) return;

        const existingItem = this.items.find(item => item.itemId === itemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                itemId: itemId,
                name: menuItem.name,
                quantity: quantity,
                price: menuItem.price
            });
        }
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.itemId !== itemId);
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.itemId === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getSubtotal() {
        return this.getTotal();
    }

    complete() {
        this.status = 'completed';
        this.timestamp = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            items: this.items,
            timestamp: this.timestamp.toISOString(),
            total: this.getTotal(),
            status: this.status
        };
    }

    static fromJSON(json) {
        const order = new Order(json.id);
        order.items = json.items;
        order.timestamp = new Date(json.timestamp);
        order.status = json.status;
        return order;
    }
}

// Order Manager Class
class OrderManager {
    constructor() {
        this.orders = [];
        this.currentOrderId = null;
        this.loadFromStorage();
        if (this.orders.length === 0) {
            this.createNewOrder();
        } else {
            const activeOrder = this.orders.find(o => o.status === 'active');
            if (activeOrder) {
                this.currentOrderId = activeOrder.id;
            } else {
                this.createNewOrder();
            }
        }
    }

    createNewOrder() {
        const orderId = `ORDER-${Date.now()}`;
        const newOrder = new Order(orderId);
        this.orders.push(newOrder);
        this.currentOrderId = orderId;
        this.saveToStorage();
        return newOrder;
    }

    getCurrentOrder() {
        if (!this.currentOrderId) {
            return this.createNewOrder();
        }
        return this.orders.find(o => o.id === this.currentOrderId) || this.createNewOrder();
    }

    setCurrentOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order && order.status === 'active') {
            this.currentOrderId = orderId;
            this.saveToStorage();
        }
    }

    completeCurrentOrder() {
        const order = this.getCurrentOrder();
        if (order.items.length === 0) return null;
        
        order.complete();
        this.saveToStorage();
        this.saveToHistory(order);
        this.currentOrderId = null;
        this.createNewOrder();
        return order;
    }

    clearCurrentOrder() {
        const order = this.getCurrentOrder();
        order.items = [];
        this.saveToStorage();
    }

    getActiveOrders() {
        return this.orders.filter(o => o.status === 'active');
    }

    getOrderHistory() {
        const history = localStorage.getItem('orderHistory');
        return history ? JSON.parse(history) : [];
    }

    saveToHistory(order) {
        const history = this.getOrderHistory();
        history.push(order.toJSON());
        localStorage.setItem('orderHistory', JSON.stringify(history));
    }

    clearHistory() {
        localStorage.removeItem('orderHistory');
    }

    saveToStorage() {
        const activeOrders = this.orders.filter(o => o.status === 'active').map(o => o.toJSON());
        localStorage.setItem('activeOrders', JSON.stringify(activeOrders));
        localStorage.setItem('currentOrderId', this.currentOrderId);
    }

    loadFromStorage() {
        const storedOrders = localStorage.getItem('activeOrders');
        const storedCurrentId = localStorage.getItem('currentOrderId');
        
        if (storedOrders) {
            this.orders = JSON.parse(storedOrders).map(json => Order.fromJSON(json));
        }
        
        if (storedCurrentId) {
            this.currentOrderId = storedCurrentId;
        }
    }
}

// Initialize Order Manager
const orderManager = new OrderManager();

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const currentOrderItems = document.getElementById('currentOrderItems');
const orderSummary = document.getElementById('orderSummary');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const completeOrderBtn = document.getElementById('completeOrderBtn');
const clearOrderBtn = document.getElementById('clearOrderBtn');
const newOrderBtn = document.getElementById('newOrderBtn');
const ordersList = document.getElementById('ordersList');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const billModal = document.getElementById('billModal');
const billContent = document.getElementById('billContent');
const closeBillBtn = document.getElementById('closeBillBtn');
const closeBillBtn2 = document.getElementById('closeBillBtn2');
const printBillBtn = document.getElementById('printBillBtn');

// Tab switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        if (targetTab === 'orders-list') {
            renderOrdersList();
        } else if (targetTab === 'history') {
            renderHistory();
        }
    });
});

// Render Menu
function renderMenu() {
    menuGrid.innerHTML = '';
    menuItems.forEach(item => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-item';
        
        const currentOrder = orderManager.getCurrentOrder();
        const orderItem = currentOrder.items.find(i => i.itemId === item.id);
        const quantity = orderItem ? orderItem.quantity : 0;
        
        menuCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect fill=%22%23ddd%22 width=%22150%22 height=%22150%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 dy=%2210.5%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3E${item.name}%3C/text%3E%3C/svg%3E'">
            <h3>${item.name}</h3>
            <div class="price">₹${item.price}</div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')" ${quantity === 0 ? 'disabled' : ''}>-</button>
                <span class="quantity-display">${quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">+</button>
            </div>
        `;
        
        menuGrid.appendChild(menuCard);
    });
}

// Quantity Functions
function increaseQuantity(itemId) {
    const order = orderManager.getCurrentOrder();
    order.addItem(itemId, 1);
    orderManager.saveToStorage();
    renderMenu();
    renderCurrentOrder();
}

function decreaseQuantity(itemId) {
    const order = orderManager.getCurrentOrder();
    const orderItem = order.items.find(i => i.itemId === itemId);
    if (orderItem) {
        order.updateQuantity(itemId, orderItem.quantity - 1);
        orderManager.saveToStorage();
        renderMenu();
        renderCurrentOrder();
    }
}

// Render Current Order
function renderCurrentOrder() {
    const order = orderManager.getCurrentOrder();
    
    if (order.items.length === 0) {
        currentOrderItems.innerHTML = '<p class="empty-message">No items in current order</p>';
        completeOrderBtn.disabled = true;
        clearOrderBtn.disabled = true;
    } else {
        currentOrderItems.innerHTML = order.items.map(item => `
            <div class="order-item">
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-details">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</div>
                </div>
                <div class="order-item-controls">
                    <button class="quantity-btn" onclick="updateOrderQuantity('${item.itemId}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateOrderQuantity('${item.itemId}', ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeOrderItem('${item.itemId}')">Remove</button>
                </div>
            </div>
        `).join('');
        
        completeOrderBtn.disabled = false;
        clearOrderBtn.disabled = false;
    }
    
    const subtotal = order.getSubtotal();
    const total = order.getTotal();
    
    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    totalEl.textContent = `₹${total.toFixed(2)}`;
}

function updateOrderQuantity(itemId, quantity) {
    const order = orderManager.getCurrentOrder();
    order.updateQuantity(itemId, quantity);
    orderManager.saveToStorage();
    renderMenu();
    renderCurrentOrder();
}

function removeOrderItem(itemId) {
    const order = orderManager.getCurrentOrder();
    order.removeItem(itemId);
    orderManager.saveToStorage();
    renderMenu();
    renderCurrentOrder();
}

// Render Orders List
function renderOrdersList() {
    const activeOrders = orderManager.getActiveOrders();
    const currentOrder = orderManager.getCurrentOrder();
    
    if (activeOrders.length === 0) {
        ordersList.innerHTML = '<p class="empty-message">No active orders</p>';
    } else {
        ordersList.innerHTML = activeOrders.map(order => `
            <div class="order-card ${order.id === currentOrder.id ? 'active' : ''}" onclick="switchToOrder('${order.id}')">
                <div class="order-card-header">
                    <span class="order-card-id">${order.id}</span>
                    <span class="order-card-total">₹${order.getTotal().toFixed(2)}</span>
                </div>
                <div class="order-card-items">${order.items.length} item(s)</div>
            </div>
        `).join('');
    }
}

function switchToOrder(orderId) {
    orderManager.setCurrentOrder(orderId);
    renderMenu();
    renderCurrentOrder();
    renderOrdersList();
    
    // Switch to current order tab
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="current-order"]').classList.add('active');
    document.getElementById('current-order').classList.add('active');
}

// Render History
function renderHistory() {
    const history = orderManager.getOrderHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-message">No order history</p>';
    } else {
        historyList.innerHTML = history.reverse().map(order => {
            const date = new Date(order.timestamp);
            return `
                <div class="history-item">
                    <div class="history-item-header">
                        <div>
                            <div class="order-card-id">${order.id}</div>
                            <div class="history-item-date">${date.toLocaleString()}</div>
                        </div>
                        <div class="history-item-total">₹${order.total.toFixed(2)}</div>
                    </div>
                    <div class="history-item-items">
                        ${order.items.map(item => `
                            <div class="history-item-item">
                                <span>${item.name} × ${item.quantity}</span>
                                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="view-bill-btn" onclick="viewBill('${order.id}')">View Bill</button>
                </div>
            `;
        }).join('');
    }
}

function viewBill(orderId) {
    const history = orderManager.getOrderHistory();
    const order = history.find(o => o.id === orderId);
    
    if (!order) return;
    
    const date = new Date(order.timestamp);
    billContent.innerHTML = `
        <div class="bill-header">
            <h2>College Canteen</h2>
            <p>Bill Receipt</p>
            <div class="bill-date">${date.toLocaleString()}</div>
        </div>
        <div class="bill-items">
            ${order.items.map(item => `
                <div class="bill-item">
                    <span class="bill-item-name">${item.name}</span>
                    <span class="bill-item-quantity">${item.quantity} × ₹${item.price}</span>
                    <span class="bill-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="bill-total">
            <span>Total:</span>
            <span>₹${order.total.toFixed(2)}</span>
        </div>
    `;
    
    billModal.classList.add('active');
}

// Event Listeners
newOrderBtn.addEventListener('click', () => {
    orderManager.createNewOrder();
    renderMenu();
    renderCurrentOrder();
    renderOrdersList();
});

completeOrderBtn.addEventListener('click', () => {
    const order = orderManager.completeCurrentOrder();
    if (order) {
        alert(`Order ${order.id} completed successfully!`);
        renderMenu();
        renderCurrentOrder();
        renderOrdersList();
    }
});

clearOrderBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the current order?')) {
        orderManager.clearCurrentOrder();
        renderMenu();
        renderCurrentOrder();
    }
});

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all order history?')) {
        orderManager.clearHistory();
        renderHistory();
    }
});

closeBillBtn.addEventListener('click', () => {
    billModal.classList.remove('active');
});

closeBillBtn2.addEventListener('click', () => {
    billModal.classList.remove('active');
});

printBillBtn.addEventListener('click', () => {
    window.print();
});

billModal.addEventListener('click', (e) => {
    if (e.target === billModal) {
        billModal.classList.remove('active');
    }
});

// Initialize
renderMenu();
renderCurrentOrder();
renderOrdersList();
renderHistory();
