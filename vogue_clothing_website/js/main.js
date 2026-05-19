const STORAGE_KEY = 'vogue_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function addToCart(name, price) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (item) item.qty += 1;
  else cart.push({ name, price, qty: 1 });
  saveCart(cart);
  alert(`${name} added to your order.`);
}

function clearCart() {
  localStorage.removeItem(STORAGE_KEY);
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

function renderCart() {
  const wrap = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!wrap || !totalEl) return;
  const cart = getCart();
  if (cart.length === 0) {
    wrap.innerHTML = 'No items added yet.';
    totalEl.textContent = 'LKR 0';
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  wrap.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} × ${item.qty}</span>
      <strong>LKR ${item.price * item.qty}</strong>
    </div>`).join('');
  totalEl.textContent = `LKR ${total}`;
}

function submitOrder(event) {
  event.preventDefault();
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const note = document.getElementById('orderNote').value.trim();
  const cart = getCart();

  if (!cart.length) {
    alert('Please add at least one product to your cart.');
    return;
  }

  const items = cart.map(i => `${i.name} x${i.qty}`).join(', ');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = `Hello VOGUE, I would like to place an order.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AItems: ${encodeURIComponent(items)}%0ATotal: LKR ${total}%0ANote: ${encodeURIComponent(note)}`;
  const whatsapp = `https://wa.me/94770000000?text=${message}`;
  window.open(whatsapp, '_blank');
}

function toggleMenu() {
  document.getElementById('siteNav')?.classList.toggle('open');
}

function filterProducts() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const cat = document.getElementById('categoryFilter')?.value || 'all';
  document.querySelectorAll('.product-card').forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category;
    const match = name.includes(q) && (cat === 'all' || category === cat);
    card.style.display = match ? 'flex' : 'none';
  });
}

document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
updateCartCount();
renderCart();