// ---------- Data ----------
// Todas las fotos provienen de la misma toma de producto; cada artículo
// enfoca una zona distinta de la imagen (frente, espalda, bordados).
const PRODUCTS = [
  {
    id: "sagrado-corazon",
    name: "Sagrado Corazón Oversize",
    price: 890,
    kicker: "Frente bordado",
    desc: "Playera oversize en algodón de 240g con bordado de cruz y laurel al pecho. Corte caído, cuello reforzado.",
    image: "assets/shop1.jpg",
    focus: "0% 0%",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "arriaga-espalda",
    name: "Arriaga Espalda Grande",
    price: 950,
    kicker: "Grabado trasero",
    desc: "El grabado principal: tipografía gótica 'Arriaga' coronando la imagen del Sagrado Corazón en toda la espalda.",
    image: "assets/shop1.jpg",
    focus: "100% 0%",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "monograma-a",
    name: "Monograma A",
    price: 850,
    kicker: "Detalle de pecho",
    desc: "Versión minimalista con el monograma 'A' y laurel bordado, sin grabado en la espalda. Para uso diario.",
    image: "assets/shop1.jpg",
    focus: "0% 100%",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "corona-eterna",
    name: "Corona Eterna",
    price: 920,
    kicker: "Grabado central",
    desc: "Acercamiento al rostro coronado del grabado trasero, impreso en gran formato sobre algodón lavado a piedra.",
    image: "assets/shop1.jpg",
    focus: "75% 100%",
    sizes: ["S", "M", "L", "XL"]
  }
];
 
const currency = (n) => `$${n.toLocaleString("es-MX")} MXN`;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
// ---------- State ----------
let cart = []; // { id, size, qty }
let activeProduct = null;
let selectedSize = null;
 
// ---------- Elements ----------
const productGrid = document.getElementById("productGrid");
const overlay = document.getElementById("overlay");
 
const productPanel = document.getElementById("productPanel");
const panelImage = document.getElementById("panelImage");
const panelKicker = document.getElementById("panelKicker");
const panelName = document.getElementById("panelName");
const panelPrice = document.getElementById("panelPrice");
const panelDesc = document.getElementById("panelDesc");
const sizeOptions = document.getElementById("sizeOptions");
const addToCartBtn = document.getElementById("addToCartBtn");
const panelClose = document.getElementById("panelClose");
 
const cartToggle = document.getElementById("cartToggle");
const cartDrawer = document.getElementById("cartDrawer");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");
const heroImage = document.getElementById("heroImage");
 
const checkoutPanel = document.getElementById("checkoutPanel");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutTotalEl = document.getElementById("checkoutTotal");
const tabCard = document.getElementById("tabCard");
const tabEmail = document.getElementById("tabEmail");
const cardForm = document.getElementById("cardForm");
const emailForm = document.getElementById("emailForm");
const checkoutSuccess = document.getElementById("checkoutSuccess");
const successTitle = document.getElementById("successTitle");
const successMessage = document.getElementById("successMessage");
const successClose = document.getElementById("successClose");
const cardName = document.getElementById("cardName");
const cardNumber = document.getElementById("cardNumber");
const cardExpiry = document.getElementById("cardExpiry");
const cardCvv = document.getElementById("cardCvv");
const checkoutEmail = document.getElementById("checkoutEmail");
 
// ---------- Render product grid ----------
function renderGrid() {
  productGrid.innerHTML = PRODUCTS.map((p) => `
    <article class="product-card reveal-card" data-id="${p.id}">
      <div class="card-image" style="--focus:${p.focus}">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="card-price">${currency(p.price)}</p>
      </div>
    </article>
  `).join("");
 
  productGrid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => openProduct(card.dataset.id));
  });
 
  observeCards();
}
 
// ---------- Scroll reveal ----------
function initReveal() {
  const targets = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach((t) => io.observe(t));
}
 
function observeCards() {
  const cards = document.querySelectorAll(".product-card");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("in-view"), i * 90);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  cards.forEach((c) => io.observe(c));
}
 
// ---------- Parallax hero image ----------
function initParallax() {
  if (prefersReducedMotion || !heroImage) return;
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.12;
    heroImage.style.transform = `translateY(${offset}px) scale(1.04)`;
  }, { passive: true });
}
 
// ---------- Product panel ----------
function openProduct(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  activeProduct = product;
  selectedSize = null;
 
  panelImage.src = product.image;
  panelImage.style.setProperty("--focus", product.focus);
  panelImage.alt = product.name;
  panelKicker.textContent = product.kicker;
  panelName.textContent = product.name;
  panelPrice.textContent = currency(product.price);
  panelDesc.textContent = product.desc;
 
  sizeOptions.innerHTML = product.sizes.map((s) => `
    <button class="size-btn" data-size="${s}">${s}</button>
  `).join("");
 
  sizeOptions.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSize = btn.dataset.size;
      sizeOptions.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
 
  closeCart();
  productPanel.classList.add("active");
  overlay.classList.add("active");
}
 
function closeProduct() {
  productPanel.classList.remove("active");
  overlay.classList.remove("active");
}
 
addToCartBtn.addEventListener("click", () => {
  if (!activeProduct) return;
  if (!selectedSize) {
    selectedSize = activeProduct.sizes[0];
  }
  addToCart(activeProduct.id, selectedSize);
  showToast(`${activeProduct.name} · Talla ${selectedSize} agregada`);
  closeProduct();
  openCart();
});
 
panelClose.addEventListener("click", closeProduct);
overlay.addEventListener("click", () => {
  closeProduct();
  closeCart();
});
 
// ---------- Cart logic ----------
function addToCart(id, size) {
  const existing = cart.find((line) => line.id === id && line.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, size, qty: 1 });
  }
  renderCart(true);
}
 
function removeFromCart(id, size) {
  cart = cart.filter((line) => !(line.id === id && line.size === size));
  renderCart();
}
 
function renderCart(bump = false) {
  const totalQty = cart.reduce((sum, l) => sum + l.qty, 0);
  cartCount.textContent = totalQty;
  if (bump) {
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth; // restart animation
    cartCount.classList.add("bump");
  }
 
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
    cartTotal.textContent = currency(0);
    return;
  }
 
  let total = 0;
  cartItems.innerHTML = cart.map((line) => {
    const product = PRODUCTS.find((p) => p.id === line.id);
    const lineTotal = product.price * line.qty;
    total += lineTotal;
    return `
      <div class="cart-line">
        <img src="${product.image}" alt="${product.name}" style="--focus:${product.focus}">
        <div>
          <p class="cart-line-name">${product.name}</p>
          <p class="cart-line-meta">Talla ${line.size} · x${line.qty} · ${currency(lineTotal)}</p>
          <button class="cart-line-remove" data-id="${line.id}" data-size="${line.size}">Quitar</button>
        </div>
      </div>
    `;
  }).join("");
 
  cartTotal.textContent = currency(total);
 
  cartItems.querySelectorAll(".cart-line-remove").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id, btn.dataset.size));
  });
}
 
function openCart() {
  cartDrawer.classList.add("active");
  overlay.classList.add("active");
}
 
function closeCart() {
  cartDrawer.classList.remove("active");
  if (!productPanel.classList.contains("active")) {
    overlay.classList.remove("active");
  }
}
 
cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
 
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  openCheckout();
});
 
// ---------- Checkout panel ----------
function openCheckout() {
  checkoutTotalEl.textContent = cartTotal.textContent;
  showTab("card");
  checkoutSuccess.classList.remove("active");
  cardForm.reset();
  emailForm.reset();
  clearInvalid();
  closeCart();
  checkoutPanel.classList.add("active");
  overlay.classList.add("active");
}
 
function closeCheckout() {
  checkoutPanel.classList.remove("active");
  overlay.classList.remove("active");
}
 
function showTab(tab) {
  const isCard = tab === "card";
  tabCard.classList.toggle("active", isCard);
  tabEmail.classList.toggle("active", !isCard);
  cardForm.classList.toggle("active", isCard);
  emailForm.classList.toggle("active", !isCard);
  checkoutSuccess.classList.remove("active");
  cardForm.style.display = isCard ? "flex" : "none";
  emailForm.style.display = isCard ? "none" : "flex";
}
 
tabCard.addEventListener("click", () => showTab("card"));
tabEmail.addEventListener("click", () => showTab("email"));
checkoutClose.addEventListener("click", closeCheckout);
successClose.addEventListener("click", closeCheckout);
 
overlay.addEventListener("click", closeCheckout);
 
// ---- Input formatting ----
cardNumber.addEventListener("input", () => {
  const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
  cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
});
 
cardExpiry.addEventListener("input", () => {
  let digits = cardExpiry.value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
  cardExpiry.value = digits;
});
 
cardCvv.addEventListener("input", () => {
  cardCvv.value = cardCvv.value.replace(/\D/g, "").slice(0, 4);
});
 
function markInvalid(el, invalid) {
  el.classList.toggle("invalid", invalid);
}
function clearInvalid() {
  [cardName, cardNumber, cardExpiry, cardCvv, checkoutEmail].forEach((el) => el.classList.remove("invalid"));
}
 
// ---- Card form submit (demo only, no real charge is made) ----
cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearInvalid();
 
  const digits = cardNumber.value.replace(/\D/g, "");
  const [mm, yy] = cardExpiry.value.split("/");
  let valid = true;
 
  if (cardName.value.trim().length < 3) { markInvalid(cardName, true); valid = false; }
  if (digits.length < 13 || digits.length > 16) { markInvalid(cardNumber, true); valid = false; }
  const monthOk = mm && Number(mm) >= 1 && Number(mm) <= 12;
  if (!monthOk || !yy || yy.length < 2) { markInvalid(cardExpiry, true); valid = false; }
  if (cardCvv.value.length < 3) { markInvalid(cardCvv, true); valid = false; }
 
  if (!valid) return;
 
  const last4 = digits.slice(-4);
  successTitle.textContent = "¡Pago recibido!";
  successMessage.textContent = `Simulamos el cobro de ${checkoutTotalEl.textContent} a la tarjeta terminación ${last4}. (Demo: conecta aquí tu procesador de pagos real, p. ej. Stripe o Conekta.)`;
  finishCheckout();
});
 
// ---- Email form submit ----
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearInvalid();
 
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutEmail.value.trim());
  if (!emailOk) { markInvalid(checkoutEmail, true); return; }
 
  successTitle.textContent = "¡Enviado!";
  successMessage.textContent = `Mandamos la forma de pago a ${checkoutEmail.value.trim()}. Complétala desde ahí para confirmar tu pedido.`;
  finishCheckout();
});
 
function finishCheckout() {
  cardForm.style.display = "none";
  emailForm.style.display = "none";
  checkoutSuccess.classList.add("active");
  cart = [];
  renderCart();
}
 
// ---------- Toast ----------
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
 
// ---------- Init ----------
renderGrid();
renderCart();
initReveal();
initParallax();