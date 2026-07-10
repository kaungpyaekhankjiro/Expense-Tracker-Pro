let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let selectedExpenseId = null;

function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    selectedExpenseId = null;
    document.getElementById('floatingDeleteBtn').style.display = 'none';
    renderExpenses();
    setDefaultDate(); // စာရင်းသွင်းပြီးရင် ရက်စွဲကို ဒီနေ့ရက်စွဲအဖြစ် ပြန်ထားရန်
}

// 📅 ဖုန်းရဲ့ လက်ရှိ Local ရက်စွဲအတိုင်း (YYYY-MM-DD) ကွက်တိထွက်အောင် ပြင်ဆင်ထားသည့်အပိုင်း
function setDefaultDate() {
    const dateInput = document.getElementById('dateInput');
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    dateInput.value = `${year}-${month}-${day}`;
}

function addExpense() {
    const titleInput = document.getElementById('titleInput');
    const amountInput = document.getElementById('amountInput');
    const currencyInput = document.getElementById('currencyInput');
    const dateInput = document.getElementById('dateInput');

    let title = titleInput.value.trim();
    let amountStr = amountInput.value.trim().toLowerCase();
    let currency = currencyInput.value;
    let selectedDate = dateInput.value;

    if (title === "" || amountStr === "" || selectedDate === "") {
        alert("အချက်အလက် အကုန်ဖြည့်ပါဦးဗျာ။");
        return;
    }

    if (amountStr.endsWith('k')) {
        amountStr = amountStr.replace('k', '000');
    }

    let amount = parseFloat(amountStr);
    if (isNaN(amount)) {
        alert("ပမာဏနေရာမှာ ဂဏန်းပဲ ရိုက်ပါဗျာ။");
        return;
    }

    expenses.push({
        id: Date.now(),
        title: title,
        amount: amount,
        currency: currency,
        date: selectedDate
    });

    titleInput.value = "";
    amountInput.value = "";
    saveToStorage();
}

function selectRow(id, rowElement) {
    const allRows = document.querySelectorAll('#expenseList tr');
    allRows.forEach(r => r.classList.remove('selected-row'));

    if (selectedExpenseId === id) {
        selectedExpenseId = null;
        document.getElementById('floatingDeleteBtn').style.display = 'none';
    } else {
        selectedExpenseId = id;
        rowElement.classList.add('selected-row');
        document.getElementById('floatingDeleteBtn').style.display = 'block';
    }
}

function deleteSelectedExpense() {
    if (!selectedExpenseId) return;

    if (confirm("ရွေးချယ်ထားသော ဤအသုံးစရိတ်ကို ဖျက်ပစ်ရန် သေချာပါသလား?")) {
        expenses = expenses.filter(exp => exp.id !== selectedExpenseId);
        saveToStorage();
    }
}

function renderExpenses() {
    const list = document.getElementById('expenseList');
    const totalArea = document.getElementById('totalArea');
    list.innerHTML = "";
    totalArea.innerHTML = "";

    let totals = {};

    expenses.forEach((exp, index) => {
        let row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = function() { selectRow(exp.id, this); };
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${exp.date}</td>
            <td>${exp.title}</td>
            <td>${exp.amount.toLocaleString()} ${exp.currency}</td>
        `;
        list.appendChild(row);

        totals[exp.currency] = (totals[exp.currency] || 0) + exp.amount;
    });

    if (expenses.length === 0) {
        totalArea.innerHTML = `<div class="total-item" style="color: #64748b; text-align:center;">အသုံးစရိတ် မရှိသေးပါ</div>`;
    } else {
        for (let curr in totals) {
            let div = document.createElement('div');
            div.className = "total-item";
            div.innerHTML = `🔹 ${curr} စုစုပေါင်း = ${totals[curr].toLocaleString()} ${curr}`;
            totalArea.appendChild(div);
        }
    }
}

// App စတင်ချိန်တွင် Run ပေးမည့်အပိုင်း
setDefaultDate();
renderExpenses();
