// ===================================================
// B3 — Form Validator (Real-time)
// Validate: Tên, Email, Password Strength,
//           Confirm Password, Phone auto-format
// ===================================================

// --- LẤY CÁC PHẦN TỬ ---
const form          = document.querySelector("#registerForm");
const submitBtn     = document.querySelector("#submitBtn");
const successModal  = document.querySelector("#successModal");
const userInfoEl    = document.querySelector("#userInfo");
const modalCloseBtn = document.querySelector("#modalCloseBtn");

const inputName     = document.querySelector("#inputName");
const inputEmail    = document.querySelector("#inputEmail");
const inputPassword = document.querySelector("#inputPassword");
const inputConfirm  = document.querySelector("#inputConfirm");
const inputPhone    = document.querySelector("#inputPhone");

const strengthFill  = document.querySelector("#strengthFill");
const strengthLabel = document.querySelector("#strengthLabel");

// --- OBJECT LƯU TRẠNG THÁI VALID ---
// Mỗi field là true nếu đã hợp lệ
const validity = {
  name:     false,
  email:    false,
  password: false,
  confirm:  false,
  phone:    false
};

// ===================================================
// HÀM HELPER
// ===================================================

// Hiện trạng thái hợp lệ cho 1 field
function setFieldState(fieldId, isValid, errorMsg) {
  const field    = document.querySelector(`#field-${fieldId}`);
  const errEl    = field.querySelector(".error-msg");
  const iconEl   = field.querySelector(".icon");

  if (isValid) {
    field.classList.add("valid");
    field.classList.remove("invalid");
    iconEl.textContent  = "✅";
    errEl.textContent   = "";
  } else {
    field.classList.add("invalid");
    field.classList.remove("valid");
    iconEl.textContent  = "❌";
    errEl.textContent   = errorMsg;
  }
}

// Xóa trạng thái (khi field đang rỗng lần đầu)
function clearFieldState(fieldId) {
  const field  = document.querySelector(`#field-${fieldId}`);
  const errEl  = field.querySelector(".error-msg");
  const iconEl = field.querySelector(".icon");
  field.classList.remove("valid", "invalid");
  iconEl.textContent = "";
  errEl.textContent  = "";
}

// Cập nhật nút Submit
function updateSubmitBtn() {
  const allValid = Object.values(validity).every(v => v === true);
  submitBtn.disabled = !allValid;
}

// ===================================================
// VALIDATE TỪNG FIELD
// ===================================================

// 1. TÊN: 2 - 50 ký tự
inputName.addEventListener("input", function() {
  const val = inputName.value.trim();
  if (val === "") { clearFieldState("name"); validity.name = false; }
  else if (val.length < 2)  { setFieldState("name", false, "Tên phải có ít nhất 2 ký tự"); validity.name = false; }
  else if (val.length > 50) { setFieldState("name", false, "Tên không được quá 50 ký tự"); validity.name = false; }
  else                       { setFieldState("name", true, ""); validity.name = true; }
  updateSubmitBtn();
});

// 2. EMAIL: dùng Regex
inputEmail.addEventListener("input", function() {
  const val = inputEmail.value.trim();
  // Regex email cơ bản: có @ và dấu chấm sau @
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (val === "") { clearFieldState("email"); validity.email = false; }
  else if (!emailRegex.test(val)) { setFieldState("email", false, "Email không hợp lệ (vd: abc@gmail.com)"); validity.email = false; }
  else                             { setFieldState("email", true, ""); validity.email = true; }
  updateSubmitBtn();
});

// 3. PASSWORD: Strength meter
function checkPasswordStrength(password) {
  // Kiểm tra từng tiêu chí
  const hasMinLength = password.length >= 8;
  const hasLower     = /[a-z]/.test(password);
  const hasUpper     = /[A-Z]/.test(password);
  const hasNumber    = /[0-9]/.test(password);
  const hasSpecial   = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasMinLength) return "weak";
  if (hasMinLength && (hasLower || hasUpper) && hasNumber) {
    if (hasUpper && hasLower && hasNumber && hasSpecial) return "strong";
    return "medium";
  }
  return "weak";
}

inputPassword.addEventListener("input", function() {
  const val = inputPassword.value;

  if (val === "") {
    clearFieldState("password");
    strengthFill.className = "strength-fill";
    strengthLabel.className = "strength-label";
    strengthLabel.textContent = "";
    validity.password = false;
    // Re-validate confirm nếu đang điền
    if (inputConfirm.value) validateConfirm();
    updateSubmitBtn();
    return;
  }

  const level = checkPasswordStrength(val);

  // Cập nhật thanh strength
  strengthFill.className = `strength-fill ${level}`;
  strengthLabel.className = `strength-label ${level}`;

  if (level === "weak") {
    strengthLabel.textContent = "Yếu — cần thêm ít nhất 8 ký tự";
    setFieldState("password", false, "Mật khẩu quá yếu");
    validity.password = false;
  } else if (level === "medium") {
    strengthLabel.textContent = "Trung bình — thêm chữ hoa, ký tự đặc biệt";
    setFieldState("password", true, ""); // medium vẫn cho pass
    validity.password = true;
  } else {
    strengthLabel.textContent = "Mạnh — mật khẩu tốt! 💪";
    setFieldState("password", true, "");
    validity.password = true;
  }

  // Re-validate confirm khi password thay đổi
  if (inputConfirm.value) validateConfirm();
  updateSubmitBtn();
});

// 4. CONFIRM PASSWORD
function validateConfirm() {
  const val = inputConfirm.value;
  if (val === "") { clearFieldState("confirm"); validity.confirm = false; }
  else if (val !== inputPassword.value) { setFieldState("confirm", false, "Mật khẩu xác nhận không khớp"); validity.confirm = false; }
  else                                   { setFieldState("confirm", true, ""); validity.confirm = true; }
}

inputConfirm.addEventListener("input", function() {
  validateConfirm();
  updateSubmitBtn();
});

// 5. PHONE: Tự format thành 0901-234-567
inputPhone.addEventListener("input", function() {
  // Lấy chỉ số, bỏ tất cả ký tự không phải số
  let digits = inputPhone.value.replace(/\D/g, "");

  // Giới hạn 10 số
  if (digits.length > 10) digits = digits.slice(0, 10);

  // Format: 0901-234-567
  let formatted = digits;
  if (digits.length > 7)      formatted = digits.slice(0,4) + "-" + digits.slice(4,7) + "-" + digits.slice(7);
  else if (digits.length > 4) formatted = digits.slice(0,4) + "-" + digits.slice(4);

  // Gán lại value đã format (giữ con trỏ)
  inputPhone.value = formatted;

  // Validate: phải đủ 10 số
  const isValid = digits.length === 10 && /^0[0-9]{9}$/.test(digits);
  if (digits === "") { clearFieldState("phone"); validity.phone = false; }
  else if (!isValid)  { setFieldState("phone", false, "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0"); validity.phone = false; }
  else                { setFieldState("phone", true, ""); validity.phone = true; }

  updateSubmitBtn();
});

// ===================================================
// SUBMIT FORM
// ===================================================
form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Lấy số điện thoại không có dấu gạch
  const phoneDisplay = inputPhone.value;

  // Điền thông tin vào modal
  userInfoEl.innerHTML = "";

  const rows = [
    ["Họ và tên",  inputName.value.trim()],
    ["Email",      inputEmail.value.trim()],
    ["Điện thoại", phoneDisplay]
  ];

  rows.forEach(([label, value]) => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    userInfoEl.appendChild(p);
  });

  // Hiện modal
  successModal.classList.remove("hidden");
});

// Đóng modal
modalCloseBtn.addEventListener("click", function() {
  successModal.classList.add("hidden");
});

document.querySelector(".modal-overlay").addEventListener("click", function() {
  successModal.classList.add("hidden");
});
