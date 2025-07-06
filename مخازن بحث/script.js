const form = document.getElementById("addForm");
const message = document.getElementById("message");
const tableBody = document.querySelector("#itemsTable tbody");
const searchInput = document.getElementById("searchInput");
const datalist = document.getElementById("nameSuggestions");

let items = JSON.parse(localStorage.getItem("lgInventory") || "[]");

function updateNameSuggestions() {
  datalist.innerHTML = "";
  const names = [...new Set(items.map(item => item.name))];
  names.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    datalist.appendChild(option);
  });
}

function renderSearchResults(data) {
  tableBody.innerHTML = "";
  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3">لا توجد نتائج للبحث</td></tr>`;
    return;
  }
  data.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.part}</td>
      <td>${item.location || '-'}</td>
    `;
    tableBody.appendChild(tr);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = form.itemName.value.trim();
  const part = form.partNumber.value.trim();
  const location = form.location.value.trim();

  if (!name || !part) {
    alert("الرجاء ملء اسم القطعة ورقم البارت");
    return;
  }

  items.push({ name, part, location });
  localStorage.setItem("lgInventory", JSON.stringify(items));
  updateNameSuggestions();

  // بعد الإضافة نظّف الجدول والبحث (ما نعرض كامل القطع)
  tableBody.innerHTML = "";
  form.reset();
  showMessage("تمت إضافة القطعة بنجاح");
});

function showMessage(text) {
  message.textContent = text;
  message.style.opacity = "1";
  setTimeout(() => {
    message.style.opacity = "0";
  }, 2000);
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    // اذا البحث فاضي، ما نظهر أي شيء
    tableBody.innerHTML = "";
    return;
  }

  const filtered = items.filter(item => item.name.toLowerCase().includes(query));
  renderSearchResults(filtered);
});

// تهيئة اقتراحات الأسماء فقط عند تحميل الصفحة
updateNameSuggestions();
tableBody.innerHTML = "";
