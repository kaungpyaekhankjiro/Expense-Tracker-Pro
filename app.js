let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let selectedExpenseId = null;

function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    selectedExpenseId = null;
    document.getElementById('floatingDeleteBtn').style.display = 'none';
    renderExpenses();
    setDefaultDate();
}

function setDefaultDate() {
    const dateInput = document.getElementById('dateInput');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
}

// 🔎 History Filter အမျိုးအစားအလိုက် Input အကွက်များကို ပေါ်စေ/ဖျောက်စေခြင်း
function toggleFilterInputs() {
    const filterType = document.getElementById('filterType').value;
    const dateArea = document.getElementById('filterDateArea');
    const monthArea = document.getElementById('filterMonthArea');

    if (filterType === 'date') {
        dateArea.style.display = 'block';
        monthArea.style.display = 'none';
        // ရက်စွဲကွက်လပ်ထဲတွင် ဒီနေ့ရက်စွဲကို Default ထည့်ပေးခြင်း
        if (!document.getElementById('filterDate').value) {
            document.getElementById('filterDate').value = document.getElementById('dateInput').value;
        }
    } else if (filterType === 'month') {
        dateArea.style.display = 'none';
        monthArea.style.display = 'block';
        // လရွေးချယ်မှုကွက်လပ်ထဲတွင် ယခုလကို Default ထည့်ပေးခြင်း (YYYY-MM)
        if (!document.getElementById('filterMonth').value) {
            const today = document.getElementById('dateInput').value;
            document.getElementById('filterMonth').value = today.substring(0, 7);
        }
    } else {
        dateArea.style.display = 'none';
        monthArea.style.display = 'none';
    }
    renderExpenses(); // Filter ပြောင်းလိုက်တိုင်း ဇယားကို ပြန်ဆွဲရန်
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

    const filterType = document.getElementById('filterType').value;
    const filterDate = document.getElementById('filterDate').value;
    const filterMonth = document.getElementById('filterMonth').value;

    let totals = {};
    let displayIndex = 1;

    expenses.forEach((exp) => {
        // 📊 History Filter စစ်ထုတ်သည့် Logic အပိုင်း
        if (filterType === 'date' && exp.date !== filterDate) return;
        if (filterType === 'month' && exp.date.substring(0, 7) !== filterMonth) return;

        let row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = function() { selectRow(exp.id, this); };
        
        row.innerHTML = `
            <td>${displayIndex++}</td>
            <td>${exp.date}</td>
            <td>${exp.title}</td>
            <td>${exp.amount.toLocaleString()} ${exp.currency}</td>
        `;
        list.appendChild(row);

        totals[exp.currency] = (totals[exp.currency] || 0) + exp.amount;
    });

    if (displayIndex === 1) {
        list.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#64748b; padding:20px;">ပြသစရာ စာရင်းမရှိသေးပါ</td></tr>`;
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

// App စတင်ချိန်တွင် Run မည့်အပိုင်း
setDefaultDate();
renderExpenses();
