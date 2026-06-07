// ===================================================
// B2 — Product Catalog
// Tính năng: Render từ JS, Search, Filter, Sort,
//            Modal, Cart badge, Dark mode
// ===================================================

// --- 1. DỮ LIỆU SẢN PHẨM (khai báo trong JS, không hardcode HTML) ---
const products = [
  { id:1,  name:"iPhone 16 Pro",      price:28990000, category:"phone",    image:"https://placehold.co/400x300/6366f1/white?text=iPhone+16",    rating:4.8, inStock:true  },
  { id:2,  name:"Samsung Galaxy S25", price:22990000, category:"phone",    image:"https://placehold.co/400x300/0ea5e9/white?text=Galaxy+S25",   rating:4.6, inStock:true  },
  { id:3,  name:"Xiaomi 14T",         price:12990000, category:"phone",    image:"https://placehold.co/400x300/10b981/white?text=Xiaomi+14T",   rating:4.3, inStock:true  },
  { id:4,  name:"OPPO Reno 13",       price:9990000,  category:"phone",    image:"https://placehold.co/400x300/f59e0b/white?text=OPPO+Reno13",  rating:4.1, inStock:false },

  { id:5,  name:"MacBook Air M3",     price:34990000, category:"laptop",   image:"https://placehold.co/400x300/6366f1/white?text=MacBook+Air",  rating:4.9, inStock:true  },
  { id:6,  name:"Dell XPS 15",        price:32990000, category:"laptop",   image:"https://placehold.co/400x300/0ea5e9/white?text=Dell+XPS15",   rating:4.5, inStock:true  },
  { id:7,  name:"ASUS ROG Zephyrus",  price:38990000, category:"laptop",   image:"https://placehold.co/400x300/ef4444/white?text=ROG+Zephyrus", rating:4.7, inStock:true  },

  { id:8,  name:"AirPods Pro 2",      price:6490000,  category:"audio",    image:"https://placehold.co/400x300/6366f1/white?text=AirPods+Pro",  rating:4.7, inStock:true  },
  { id:9,  name:"Sony WH-1000XM5",    price:7990000,  category:"audio",    image:"https://placehold.co/400x300/0f172a/white?text=Sony+XM5",    rating:4.8, inStock:true  },
  { id:10, name:"JBL Flip 6",         price:2590000,  category:"audio",    image:"https://placehold.co/400x300/f59e0b/white?text=JBL+Flip6",   rating:4.4, inStock:false },

  { id:11, name:"iPad Air 11 M3",     price:18990000, category:"tablet",   image:"https://placehold.co/400x300/6366f1/white?text=iPad+Air",    rating:4.7, inStock:true  },
  { id:12, name:"Samsung Tab S10",    price:17490000, category:"tablet",   image:"https://placehold.co/400x300/0ea5e9/white?text=Tab+S10",     rating:4.5, inStock:true  },
  { id:13, name:"Xiaomi Pad 7",       price:8990000,  category:"tablet",   image:"https://placehold.co/400x300/10b981/white?text=Xiaomi+Pad7", rating:4.2, inStock:true  },
];

// --- 2. STATE ---
let currentCategory = "all";
let currentSort     = "default";
let searchQuery     = "";
let cartCount       = 0;

// --- 3. LẤY DOM ELEMENTS ---
const productGrid  = document.querySelector("#productGrid");
const categoryBar  = document.querySelector("#categoryBar");
const searchInput  = document.querySelector("#searchInput");
const sortSelect   = document.querySelector("#sortSelect");
const cartBadge    = document.querySelector("#cartBadge");
const darkModeBtn  = document.querySelector("#darkModeBtn");
const modal        = document.querySelector("#modal");
const modalOverlay = document.querySelector("#modalOverlay");
const modalBox     = document.querySelector("#modalBox");

// --- 4. HELPER: Format giá VND ---
function formatPrice(price) {
  return price.toLocaleString("vi-VN") + "đ";
}

// --- 5. HELPER: Render ngôi sao ---
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "⭐".repeat(full) + (half ? "✨" : "") + "☆".repeat(empty) + ` (${rating})`;
}

// --- 6. LẤY DANH SÁCH CÁC CATEGORY ĐỘC LẬP ---
function getCategories() {
  const cats = products.map(p => p.category);
  return ["all", ...new Set(cats)]; // Set loại bỏ trùng lặp
}

// --- 7. RENDER CÁC NÚT CATEGORY ---
function renderCategoryBar() {
  categoryBar.innerHTML = ""; // Xóa cũ
  getCategories().forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "cat-btn" + (cat === currentCategory ? " active" : "");
    btn.textContent = cat === "all" ? "🏠 Tất cả" : "📦 " + cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.dataset.cat = cat;
    categoryBar.appendChild(btn);
  });
}

// --- 8. LỌC SẢN PHẨM THEO CATEGORY & SEARCH ---
function filterProducts() {
  return products.filter(p => {
    const matchCat    = currentCategory === "all" || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });
}

// --- 9. SẮP XẾP SẢN PHẨM ---
function sortProducts(list) {
  const sorted = [...list]; // Copy mảng để không thay đổi bản gốc
  switch (currentSort) {
    case "price-asc":   return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":  return sorted.sort((a, b) => b.price - a.price);
    case "name-az":     return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "rating-desc": return sorted.sort((a, b) => b.rating - a.rating);
    default:            return sorted;
  }
}

// --- 10. TẠO CARD SẢN PHẨM BẰNG createElement ---
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.id = product.id;

  // Ảnh
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.loading = "lazy";

  // Body
  const body = document.createElement("div");
  body.className = "card-body";

  const catEl   = document.createElement("div");
  catEl.className = "card-category";
  catEl.textContent = product.category;

  const nameEl  = document.createElement("div");
  nameEl.className = "card-name";
  nameEl.textContent = product.name;

  const ratingEl = document.createElement("div");
  ratingEl.className = "card-rating";
  ratingEl.textContent = renderStars(product.rating);

  const priceEl = document.createElement("div");
  priceEl.className = "card-price";
  priceEl.textContent = formatPrice(product.price);

  const footer = document.createElement("div");
  footer.className = "card-footer";

  if (product.inStock) {
    const addBtn = document.createElement("button");
    addBtn.className = "btn-add-cart";
    addBtn.textContent = "🛒 Thêm giỏ";
    addBtn.dataset.id = product.id; // Để xử lý qua event delegation
    footer.appendChild(addBtn);
  } else {
    const oos = document.createElement("span");
    oos.className = "out-of-stock";
    oos.textContent = "❌ Hết hàng";
    footer.appendChild(oos);
  }

  body.appendChild(catEl);
  body.appendChild(nameEl);
  body.appendChild(ratingEl);
  body.appendChild(priceEl);
  body.appendChild(footer);

  card.appendChild(img);
  card.appendChild(body);

  return card;
}

// --- 11. RENDER DANH SÁCH SẢN PHẨM ---
function renderProducts() {
  productGrid.innerHTML = "";

  const filtered = filterProducts();
  const sorted   = sortProducts(filtered);

  if (sorted.length === 0) {
    const msg = document.createElement("div");
    msg.className = "no-result";
    msg.textContent = "😕 Không tìm thấy sản phẩm nào.";
    productGrid.appendChild(msg);
    return;
  }

  sorted.forEach(product => {
    const card = createProductCard(product);
    productGrid.appendChild(card);
  });
}

// --- 12. HIỆN MODAL CHI TIẾT ---
function openModal(product) {
  modalBox.innerHTML = ""; // Xóa nội dung cũ

  // Nút đóng
  const closeBtn = document.createElement("button");
  closeBtn.className = "modal-close";
  closeBtn.textContent = "✕";
  closeBtn.addEventListener("click", closeModal);

  // Ảnh
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;

  // Tên
  const h2 = document.createElement("h2");
  h2.textContent = product.name;

  // Meta
  const meta = document.createElement("div");
  meta.className = "modal-meta";
  meta.textContent = `📦 ${product.category}   ⭐ ${product.rating}/5   ${product.inStock ? "✅ Còn hàng" : "❌ Hết hàng"}`;

  // Giá
  const price = document.createElement("div");
  price.className = "modal-price";
  price.textContent = formatPrice(product.price);

  // Nút thêm giỏ (trong modal)
  if (product.inStock) {
    const addBtn = document.createElement("button");
    addBtn.className = "btn-add-cart";
    addBtn.textContent = "🛒 Thêm vào giỏ hàng";
    addBtn.addEventListener("click", () => {
      updateCart();
      closeModal();
    });
    modalBox.appendChild(closeBtn);
    modalBox.appendChild(img);
    modalBox.appendChild(h2);
    modalBox.appendChild(meta);
    modalBox.appendChild(price);
    modalBox.appendChild(addBtn);
  } else {
    modalBox.appendChild(closeBtn);
    modalBox.appendChild(img);
    modalBox.appendChild(h2);
    modalBox.appendChild(meta);
    modalBox.appendChild(price);
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Khóa scroll nền
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

// --- 13. CẬP NHẬT GIỎ HÀNG BADGE ---
function updateCart() {
  cartCount++;
  cartBadge.textContent = cartCount;
  cartBadge.classList.remove("hidden");
  // Animation nhỏ
  cartBadge.style.transform = "scale(1.4)";
  setTimeout(() => cartBadge.style.transform = "scale(1)", 200);
}

// ===================================================
// 14. CÁC EVENT LISTENERS
// ===================================================

// Search realtime (event "input" = mỗi ký tự gõ)
searchInput.addEventListener("input", function(e) {
  searchQuery = e.target.value;
  renderProducts();
});

// Sort
sortSelect.addEventListener("change", function(e) {
  currentSort = e.target.value;
  renderProducts();
});

// Category filter — event delegation trên categoryBar
categoryBar.addEventListener("click", function(e) {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;

  currentCategory = btn.dataset.cat;
  // Cập nhật active class
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts();
});

// Click card → mở modal / Click "Thêm giỏ" → thêm vào cart
// Event delegation trên productGrid
productGrid.addEventListener("click", function(e) {
  // Click nút "Thêm giỏ"
  const addBtn = e.target.closest(".btn-add-cart");
  if (addBtn) {
    e.stopPropagation(); // Ngăn event nổi lên card
    updateCart();
    return;
  }

  // Click card → mở modal
  const card = e.target.closest(".product-card");
  if (card) {
    const id = Number(card.dataset.id);
    const product = products.find(p => p.id === id);
    if (product) openModal(product);
  }
});

// Đóng modal khi click overlay
modalOverlay.addEventListener("click", closeModal);

// Đóng modal khi nhấn Escape
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeModal();
});

// Dark mode toggle
darkModeBtn.addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");
  darkModeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// ===================================================
// 15. KHỞI ĐỘNG APP
// ===================================================
renderCategoryBar();
renderProducts();
