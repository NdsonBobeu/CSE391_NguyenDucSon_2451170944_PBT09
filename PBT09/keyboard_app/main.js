// ===================================================
// B4 — Keyboard Shortcuts & Accessibility
// Tính năng: Gallery với phím ← → Space 1-9 Esc
//            Command Palette (Ctrl+K)
//            Focus management + aria labels
// ===================================================

// ===================================================
// 1. DỮ LIỆU ẢNH
// ===================================================
const images = [
  { src: "https://placehold.co/800x500/6366f1/white?text=Ảnh+1+🌄",  caption: "1 — Hoàng hôn trên núi" },
  { src: "https://placehold.co/800x500/0ea5e9/white?text=Ảnh+2+🌊",  caption: "2 — Biển xanh yên bình" },
  { src: "https://placehold.co/800x500/10b981/white?text=Ảnh+3+🌿",  caption: "3 — Rừng nhiệt đới" },
  { src: "https://placehold.co/800x500/f59e0b/white?text=Ảnh+4+🏜️",  caption: "4 — Sa mạc cát vàng" },
  { src: "https://placehold.co/800x500/ef4444/white?text=Ảnh+5+🌺",  caption: "5 — Vườn hoa đỏ" },
  { src: "https://placehold.co/800x500/8b5cf6/white?text=Ảnh+6+🌃",  caption: "6 — Thành phố về đêm" },
  { src: "https://placehold.co/800x500/ec4899/white?text=Ảnh+7+🌸",  caption: "7 — Hoa anh đào" },
  { src: "https://placehold.co/800x500/14b8a6/white?text=Ảnh+8+🏔️",  caption: "8 — Đỉnh núi tuyết" },
  { src: "https://placehold.co/800x500/f97316/white?text=Ảnh+9+🌅",  caption: "9 — Bình minh ven biển" },
];

// ===================================================
// 2. STATE
// ===================================================
let currentIndex  = 0;
let isPlaying     = false;
let slideshowTimer = null;
let cpFocusIndex  = -1; // Index item đang focus trong command palette

// ===================================================
// 3. LẤY DOM
// ===================================================
const galleryImg    = document.querySelector("#galleryImg");
const galleryCaption = document.querySelector("#galleryCaption");
const slideCounter  = document.querySelector("#slideCounter");
const prevBtn       = document.querySelector("#prevBtn");
const nextBtn       = document.querySelector("#nextBtn");
const playBtn       = document.querySelector("#playBtn");
const thumbnails    = document.querySelector("#thumbnails");
const galleryFrame  = document.querySelector("#galleryFrame");

const imageModal    = document.querySelector("#imageModal");
const modalImg      = document.querySelector("#modalImg");
const imgModalClose = document.querySelector("#imgModalClose");

const commandPalette = document.querySelector("#commandPalette");
const cpInput        = document.querySelector("#cpInput");
const cpResults      = document.querySelector("#cpResults");

// ===================================================
// 4. GALLERY FUNCTIONS
// ===================================================

// Render ảnh hiện tại lên khung
function showImage(index) {
  // Hiệu ứng fade
  galleryImg.classList.add("fade");
  setTimeout(() => {
    galleryImg.src            = images[index].src;
    galleryImg.alt            = images[index].caption;
    galleryCaption.textContent = images[index].caption;
    slideCounter.textContent  = `${index + 1} / ${images.length}`;
    galleryImg.classList.remove("fade");
  }, 200);

  // Cập nhật thumbnail active
  document.querySelectorAll(".thumb").forEach((t, i) => {
    t.classList.toggle("active", i === index);
    // Scroll thumbnail vào view nếu ẩn
    if (i === index) t.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });

  currentIndex = index;
}

// Đến ảnh trước
function prevImage() {
  const newIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(newIndex);
}

// Đến ảnh tiếp
function nextImage() {
  const newIndex = (currentIndex + 1) % images.length;
  showImage(newIndex);
}

// Play / Pause slideshow
function toggleSlideshow() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    playBtn.textContent = "⏸ Pause";
    playBtn.classList.add("playing");
    slideshowTimer = setInterval(nextImage, 2500);
  } else {
    playBtn.textContent = "▶ Play";
    playBtn.classList.remove("playing");
    clearInterval(slideshowTimer);
  }
}

// Tạo thumbnails bằng createElement
function buildThumbnails() {
  thumbnails.innerHTML = "";
  images.forEach((img, i) => {
    const div = document.createElement("div");
    div.className = "thumb" + (i === 0 ? " active" : "");
    div.tabIndex = 0; // Có thể focus bằng Tab
    div.setAttribute("role", "listitem");
    div.setAttribute("aria-label", `Ảnh ${i + 1}: ${img.caption}`);

    const imgEl = document.createElement("img");
    imgEl.src = img.src;
    imgEl.alt = img.caption;

    div.appendChild(imgEl);

    // Click thumbnail
    div.addEventListener("click", () => showImage(i));
    // Enter khi focus thumbnail
    div.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showImage(i);
      }
    });

    thumbnails.appendChild(div);
  });
}

// ===================================================
// 5. MODAL ẢNH LỚN
// ===================================================
function openImageModal() {
  modalImg.src = images[currentIndex].src;
  modalImg.alt = images[currentIndex].caption;
  imageModal.classList.remove("hidden");
  imgModalClose.focus(); // Quản lý focus: move focus vào modal
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  imageModal.classList.add("hidden");
  document.body.style.overflow = "";
  galleryFrame.focus(); // Trả focus về gallery frame
}

// Click vào ảnh lớn → mở modal
galleryFrame.addEventListener("click", openImageModal);
imgModalClose.addEventListener("click", closeImageModal);
document.querySelector("#imgModalOverlay").addEventListener("click", closeImageModal);

// ===================================================
// 6. COMMAND PALETTE
// ===================================================

// Danh sách commands
const commands = [
  { icon: "◀",  label: "Ảnh trước",              shortcut: "←",       action: prevImage },
  { icon: "▶",  label: "Ảnh tiếp theo",           shortcut: "→",       action: nextImage },
  { icon: "⏯",  label: "Play / Pause slideshow",  shortcut: "Space",   action: toggleSlideshow },
  { icon: "🔍",  label: "Xem ảnh lớn",            shortcut: "Enter",   action: openImageModal },
  { icon: "1️⃣",  label: "Nhảy đến ảnh 1",        shortcut: "1",       action: () => showImage(0) },
  { icon: "2️⃣",  label: "Nhảy đến ảnh 2",        shortcut: "2",       action: () => showImage(1) },
  { icon: "3️⃣",  label: "Nhảy đến ảnh 3",        shortcut: "3",       action: () => showImage(2) },
  { icon: "4️⃣",  label: "Nhảy đến ảnh 4",        shortcut: "4",       action: () => showImage(3) },
  { icon: "5️⃣",  label: "Nhảy đến ảnh 5",        shortcut: "5",       action: () => showImage(4) },
  { icon: "✕",   label: "Đóng modal / palette",   shortcut: "Esc",     action: closeCommandPalette },
];

function openCommandPalette() {
  commandPalette.classList.remove("hidden");
  cpInput.value = "";
  cpFocusIndex  = -1;
  renderCommandResults(commands);
  setTimeout(() => cpInput.focus(), 50); // Delay nhỏ để animation xong
}

function closeCommandPalette() {
  commandPalette.classList.add("hidden");
}

// Render danh sách commands vào palette
function renderCommandResults(list) {
  cpResults.innerHTML = "";
  if (list.length === 0) {
    const li = document.createElement("li");
    li.className = "cp-item";
    li.textContent = "Không tìm thấy lệnh nào...";
    li.style.color = "#94a3b8";
    cpResults.appendChild(li);
    return;
  }

  list.forEach((cmd, i) => {
    const li = document.createElement("li");
    li.className = "cp-item";
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", "false");

    const iconEl     = document.createElement("span");
    iconEl.className = "cp-item-icon";
    iconEl.textContent = cmd.icon;

    const labelEl    = document.createElement("span");
    labelEl.className = "cp-item-label";
    labelEl.textContent = cmd.label;

    const shortcutEl  = document.createElement("span");
    shortcutEl.className = "cp-item-shortcut";
    shortcutEl.textContent = cmd.shortcut;

    li.appendChild(iconEl);
    li.appendChild(labelEl);
    li.appendChild(shortcutEl);

    // Click để chạy command
    li.addEventListener("click", () => {
      cmd.action();
      closeCommandPalette();
    });

    cpResults.appendChild(li);
  });
}

// Tìm kiếm trong palette
cpInput.addEventListener("input", function() {
  const query = cpInput.value.toLowerCase();
  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query) ||
    cmd.shortcut.toLowerCase().includes(query)
  );
  cpFocusIndex = -1;
  renderCommandResults(filtered);
});

// Điều hướng bằng mũi tên trong palette
cpInput.addEventListener("keydown", function(e) {
  const items = cpResults.querySelectorAll(".cp-item");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    cpFocusIndex = Math.min(cpFocusIndex + 1, items.length - 1);
    updateCpFocus(items);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    cpFocusIndex = Math.max(cpFocusIndex - 1, 0);
    updateCpFocus(items);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (cpFocusIndex >= 0 && items[cpFocusIndex]) {
      items[cpFocusIndex].click();
    } else if (items[0]) {
      items[0].click(); // Nếu chưa chọn → chạy cái đầu tiên
    }
  }
});

function updateCpFocus(items) {
  items.forEach((item, i) => {
    item.classList.toggle("focused", i === cpFocusIndex);
  });
  if (items[cpFocusIndex]) {
    items[cpFocusIndex].scrollIntoView({ block: "nearest" });
  }
}

// Đóng khi click overlay
document.querySelector("#cpOverlay").addEventListener("click", closeCommandPalette);

// ===================================================
// 7. KEYBOARD SHORTCUTS (global)
// ===================================================
document.addEventListener("keydown", function(e) {
  const inInput = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";

  // Ctrl+K (hoặc Cmd+K trên Mac) → mở command palette
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    if (commandPalette.classList.contains("hidden")) {
      openCommandPalette();
    } else {
      closeCommandPalette();
    }
    return;
  }

  // Escape → đóng modal / palette
  if (e.key === "Escape") {
    if (!imageModal.classList.contains("hidden"))    { closeImageModal();     return; }
    if (!commandPalette.classList.contains("hidden")){ closeCommandPalette(); return; }
  }

  // Không xử lý shortcut nếu đang gõ trong input (trừ palette input đã handle riêng)
  if (inInput) return;

  // Phím ← → chuyển ảnh
  if (e.key === "ArrowLeft")  { e.preventDefault(); prevImage(); return; }
  if (e.key === "ArrowRight") { e.preventDefault(); nextImage(); return; }

  // Space → play/pause
  if (e.key === " ") { e.preventDefault(); toggleSlideshow(); return; }

  // Phím 1-9 → nhảy đến ảnh tương ứng
  const num = parseInt(e.key);
  if (num >= 1 && num <= images.length) {
    showImage(num - 1);
    return;
  }

  // Enter khi gallery frame đang focus → mở modal
  if (e.key === "Enter" && document.activeElement === galleryFrame) {
    openImageModal();
  }
});

// ===================================================
// 8. BUTTON EVENTS (cho người dùng click)
// ===================================================
prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);
playBtn.addEventListener("click", toggleSlideshow);

// ===================================================
// 9. KHỞI ĐỘNG
// ===================================================
buildThumbnails();
showImage(0);      // Hiện ảnh đầu tiên
galleryFrame.focus(); // Focus vào gallery để có thể dùng phím ngay
