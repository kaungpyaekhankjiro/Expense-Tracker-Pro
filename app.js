let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let selectedExpenseId = null;
let isEditMode = false; // လက်ရှိ Edit လုပ်နေသလား မှတ်ရန်

function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    resetActionState();
    renderExpenses();
    setDefaultDate();
}

// ခလုတ်များနှင့် ပုံစံများကို ပုံမှန်အတိုင်း ပြန်ပြင်ပေးသည့် နေရာ
function resetActionState() {
    selectedExpenseId = null;
    isEditMode = false;
    document.getElementById('actionButtonGroup').style.style = 'none'; // ခလုတ်တွဲဖျောက်မည်
    
    // Form ကို မူလအခြေအနေ ပြန်ပြောင်းခြင်း
    document.getElementById('formTitle').innerText = "အချက်အလက်အသစ်ထည့်ရန်";
    const addBtn = document.getElementById('addBtn');
    addBtn.innerText = "➕ အသစ်ထည့်မည် (Add)";
    addBtn.classList.remove('edit-mode');
    
    document.getElementById('titleInput').value = "";
    document.getElementById('amountInput').value = "";
}

function setDefaultDate() {
    const dateInput = document.getElementById('dateInput');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
}

function toggleFilterInputs() {
    const filterType = document.getElementById('filterType').value;
    const dateArea = document.getElementById('filterDateArea');
    const monthArea = document.getElementById('filterMonthArea');

    if (filterType === 'date') {
        dateArea.style.display = 'block';
        monthArea.style.display = 'none';
        if (!document.getElementById('filterDate').value) {
            document.getElementById('filterDate').value = document.getElementById('dateInput').value;
        }
    } else if (filterType === 'month') {
        dateArea.style.display = 'none';
        monthArea.style.display = 'block';
        if (!document.getElementById('filterMonth').value) {
            const today = document.getElementById('dateInput').value;
            document.getElementById('filterMonth').value = today.substring(0, 7);
        }
    } else {
        dateArea.style.display = 'none';
        monthArea.style.display = 'none';
    }
    renderExpenses();
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

    if (isEditMode && selectedExpenseId !== null) {
        // ✏️ Edit Mode ဖြစ်ပါက ဒေတာအဟောင်းပေါ်တွင် အစားထိုးပြင်ဆင်ခြင်း
        expenses = expenses.map(exp => {
            if (exp.id === selectedExpenseId) {
                return { ...exp, title: title, amount: amount, currency: currency, date: selectedDate };
            }
            return exp;
        });
    } else {
        // ➕ ပုံမှန်ဆိုလျှင် အသစ်ထည့်ခြင်း
        expenses.push({
            id: Date.now(),
            title: title,
            amount: amount,
            currency: currency,
            date: selectedDate
        });
    }

    saveToStorage();
}

function selectRow(id, rowElement) {
    if (isEditMode) return; // Edit လုပ်နေစဉ် Row ရွေးချယ်မှု ပိတ်ထားမည်
    
    const allRows = document.querySelectorAll('#expenseList tr');
    allRows.forEach(r => r.classList.remove('selected-row'));

    const btnGroup = document.getElementById('actionButtonGroup');

    if (selectedExpenseId === id) {
        selectedExpenseId = null;
        btnGroup.style.display = 'none';
    } else {
        selectedExpenseId = id;
        rowElement.classList.add('selected-row');
        btnGroup.style.display = 'flex'; // Edit & Delete ခလုတ်နှစ်ခုလုံး ပြသမည်
    }
}

// ✏️ ပြင်ဆင်ရန် ခလုတ်နှိပ်လိုက်သောအခါ အချက်အလက်များကို Input Box ထဲ ပြန်ထည့်ပေးခြင်း
function editSelectedExpense() {
    if (!selectedExpenseId) return;
    
    const target = expenses.find(exp => exp.id === selectedExpenseId);
    if (!target) return;

    isEditMode = true;
    
    // အပေါ်က Input Box များထဲသို့ ဒေတာများ ပြန်လည်ဖြည့်သွင်းခြင်း
    document.getElementById('titleInput').value = target.title;
    document.getElementById('amountInput').value = target.amount;
    document.getElementById('currencyInput').value = target.currency;
    document.getElementById('dateInput').value = target.date;

    // UI အပြင်အဆင်အား Edit စာသားများအဖြစ် ပြောင်းလဲခြင်း
    document.getElementById('formTitle').innerText = "📝 အချက်အလက် ပြင်ဆင်ရန်";
    const addBtn = document.getElementById('addBtn');
    addBtn.innerText = "💾 ပြင်ဆင်ချက်များသိမ်းမည် (Update)";
    addBtn.classList.add('edit-mode');

    // ခလုတ်တွဲကို ယာယီဖျောက်ထားမည်
    document.getElementById('actionButtonGroup').style.display = 'none';
    
    // ဖုန်းမျက်နှာပြင်တွင် အပေါ်ဆုံးသို့ Screen ရွှေ့ပေးခြင်း
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

// သန့်ရှင်းစွာ ပိတ်နိုင်ရန် CSS Reset လုပ်ခြင်း
document.addEventListener('click', function(e) {
    // ဇယား သို့မဟုတ် floating ခလုတ်များအပြင်ဘက်ကို နှိပ်လျှင် ရွေးချယ်မှု ဖြုတ်ရန်
    if (!e.target.closest('table') && !e.target.closest('#actionButtonGroup') && !e.target.closest('.form-card') && selectedExpenseId && !isEditMode) {
        selectedExpenseId = null;
        document.getElementById('actionButtonGroup').style.display = 'none';
        const allRows = document.querySelectorAll('#expenseList tr');
        allRows.forEach(r => r.classList.remove('selected-row'));
    }
});

setDefaultDate();
renderExpenses();
