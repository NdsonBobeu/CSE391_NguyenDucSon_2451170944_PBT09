const todoForm       = document.querySelector("#todoForm");
const todoInput      = document.querySelector("#todoInput");
const todoList       = document.querySelector("#todoList");
const itemsLeftEl    = document.querySelector("#itemsLeft");
const clearBtn       = document.querySelector("#clearCompleted");
const filterBtns     = document.querySelectorAll(".filter-btn");

// --- 2. STATE (dữ liệu) ---
// Mỗi todo có dạng: { id, text, completed }
let todos = [];
let currentFilter = "all"; // "all" | "active" | "completed"

// --- 3. ĐỌC / GHI LOCALSTORAGE ---
function loadFromStorage() {
  const saved = localStorage.getItem("todos");
  if (saved) {
    todos = JSON.parse(saved); // Chuyển chuỗi JSON → mảng JS
  }
}

function saveToStorage() {
  localStorage.setItem("todos", JSON.stringify(todos)); // Lưu mảng JS → chuỗi JSON
}

// --- 4. TẠO 1 PHẦN TỬ LI CHO TODO ---
// Dùng createElement thay vì innerHTML để tránh XSS
function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " completed" : "");
  li.dataset.id = todo.id; // Lưu id vào data-id để dùng trong event delegation

  // Checkbox toggle
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = todo.completed;

  // Text hiển thị
  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = todo.text; // textContent: an toàn, không parse HTML

  // Nút xóa
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "❌";
  deleteBtn.title = "Xóa";

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// --- 5. RENDER DANH SÁCH ---
function render() {
  todoList.innerHTML = ""; // Xóa list cũ

  // Lọc theo filter hiện tại
  const filtered = todos.filter(todo => {
    if (currentFilter === "active")    return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true; // "all"
  });

  if (filtered.length === 0) {
    // Hiện thông báo trống
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Không có việc nào 🎉";
    todoList.appendChild(empty);
  } else {
    // Tạo từng li và thêm vào list
    filtered.forEach(todo => {
      const li = createTodoElement(todo);
      todoList.appendChild(li);
    });
  }

  updateCounter();
  saveToStorage();
}

// --- 6. CẬP NHẬT SỐ ĐẾM ---
function updateCounter() {
  const activeCount = todos.filter(t => !t.completed).length;
  itemsLeftEl.textContent = `${activeCount} việc còn lại`;
}

// --- 7. THÊM TODO (submit form) ---
todoForm.addEventListener("submit", function(e) {
  e.preventDefault(); // Ngăn trang reload

  const text = todoInput.value.trim();
  if (!text) return; // Không thêm todo rỗng

  const newTodo = {
    id: Date.now(), // Dùng timestamp làm id duy nhất
    text: text,
    completed: false
  };

  todos.push(newTodo);
  todoInput.value = "";
  todoInput.focus();
  render();
});

// --- 8. EVENT DELEGATION trên #todoList ---
// Thay vì bind event cho từng li, chỉ cần 1 listener trên ul cha
todoList.addEventListener("click", function(e) {
  // Tìm li cha gần nhất chứa data-id
  const li = e.target.closest(".todo-item");
  if (!li) return; // Click vào vùng trống (empty-state)

  const id = Number(li.dataset.id);

  // Xóa todo khi click nút xóa
  if (e.target.classList.contains("delete-btn")) {
    todos = todos.filter(t => t.id !== id);
    render();
    return;
  }

  // Toggle completed khi click checkbox
  if (e.target.classList.contains("todo-checkbox")) {
    todos = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    render();
    return;
  }
});

// --- 9. DOUBLE-CLICK ĐỂ EDIT ---
todoList.addEventListener("dblclick", function(e) {
  const span = e.target.closest(".todo-text");
  if (!span) return;

  const li = span.closest(".todo-item");
  const id = Number(li.dataset.id);
  const todo = todos.find(t => t.id === id);

  // Thay span bằng input
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = todo.text;
  li.replaceChild(editInput, span);
  editInput.focus();
  editInput.select();

  // Hàm lưu sau khi edit
  function saveEdit() {
    const newText = editInput.value.trim();
    if (newText) {
      todos = todos.map(t =>
        t.id === id ? { ...t, text: newText } : t
      );
    }
    render(); // Re-render để khôi phục span
  }

  editInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter")  saveEdit();
    if (e.key === "Escape") render(); // Hủy edit
  });

  editInput.addEventListener("blur", saveEdit); // Click ra ngoài → lưu
});

// --- 10. CÁC NÚT FILTER ---
filterBtns.forEach(btn => {
  btn.addEventListener("click", function() {
    // Bỏ active của nút cũ
    filterBtns.forEach(b => b.classList.remove("active"));
    // Thêm active cho nút mới
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// --- 11. XÓA TẤT CẢ ĐÃ COMPLETED ---
clearBtn.addEventListener("click", function() {
  todos = todos.filter(t => !t.completed);
  render();
});

// --- 12. KHỞI ĐỘNG APP ---
loadFromStorage(); // Tải dữ liệu từ localStorage
render();          // Vẽ danh sách lần đầu
