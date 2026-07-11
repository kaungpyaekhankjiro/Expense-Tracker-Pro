let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let selectedExpenseId = null;
let isEditMode = false;

function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    resetActionState();
    renderExpenses();
    setDefaultDate();
}

function resetActionState() {
    selectedExpenseId = null;
    isEditMode = false;
    document.getElementById('actionButtonGroup').style.display = 'none';
    
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

    const validPattern = /^[0-9]+(\.[0-9]+)?k?$/;
    if (!validPattern.test(amountStr)) {
        alert("⚠️ ကုန်ကျငွေနေရာတွင် ဂဏန်းများ သို့မဟုတ် အဆုံး၌ 'k' တစ်လုံးတည်းသာ ရိုက်ထည့်ခွင့်ရှိပါတယ်ဗျာ။");
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
        expenses = expenses.map(exp => {
            if (exp.id === selectedExpenseId) {
                return { ...exp, title: title, amount: amount, currency: currency, date: selectedDate };
            }
            return exp;
        });
    } else {
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
    if (isEditMode) return;
    
    const allRows = document.querySelectorAll('#expenseList tr');
    allRows.forEach(r => r.classList.remove('selected-row'));

    const btnGroup = document.getElementById('actionButtonGroup');

    if (selectedExpenseId === id) {
        selectedExpenseId = null;
        btnGroup.style.display = 'none';
    } else {
        selectedExpenseId = id;
        rowElement.classList.add('selected-row');
        btnGroup.style.display = 'flex';
    }
}

function editSelectedExpense() {
    if (!selectedExpenseId) return;
    
    const target = expenses.find(exp => exp.id === selectedExpenseId);
    if (!target) return;

    isEditMode = true;
    
    document.getElementById('titleInput').value = target.title;
    document.getElementById('amountInput').value = target.amount;
    document.getElementById('currencyInput').value = target.currency;
    document.getElementById('dateInput').value = target.date;

    document.getElementById('formTitle').innerText = "📝 အချက်အလက် ပြင်ဆင်ရန်";
    const addBtn = document.getElementById('addBtn');
    addBtn.innerText = "💾 ပြင်ဆင်ချက်များသိမ်းမည် (Update)";
    addBtn.classList.add('edit-mode');

    document.getElementById('actionButtonGroup').style.display = 'none';
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
    let dailyTotals = {}; // တစ်ရက်ချင်းစီ၏ စုစုပေါင်းကုန်ကျငွေ (Limit စစ်ရန်)
    let displayExpenses = [];

    // ၁။ ပြသမည့် ဒေတာများကို Filter အရင်လုပ်ပြီး တစ်ရက်ချင်းစီအတွက် စုစုပေါင်းတွက်ချက်ခြင်း
    expenses.forEach((exp) => {
        if (filterType === 'date' && exp.date !== filterDate) return;
        if (filterType === 'month' && exp.date.substring(0, 7) !== filterMonth) return;

        displayExpenses.push(exp);

        // Ks ဖြစ်လျှင် တစ်ရက်ချင်းစီအတွက် စုစုပေါင်းပေါင်းထားမည်
        if (exp.currency === 'Ks') {
            dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + exp.amount;
        }
    });

    // ၂။ တစ်လအတွင်း (သို့မဟုတ် လက်ရှိမြင်ရသောစာရင်းထဲတွင်) အသုံးအများဆုံးနေ့နှင့် အနည်းဆုံးနေ့ကို ရှာဖွေခြင်း
    let maxDay = null, minDay = null;
    let maxAmount = -1, minAmount = Infinity;

    for (let day in dailyTotals) {
        if (dailyTotals[day] > maxAmount) {
            maxAmount = dailyTotals[day];
            maxDay = day;
        }
        if (dailyTotals[day] < minAmount) {
            minAmount = dailyTotals[day];
            minDay = day;
        }
    }

    // ၃။ ဇယားဆွဲခြင်း
    let displayIndex = 1;
    displayExpenses.forEach((exp) => {
        let row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = function() { selectRow(exp.id, this); };
        
        // 🚨 ၅ သိန်းကျော်ပါက တပ်ဆင်မည့် Class
        let limitClass = (exp.currency === 'Ks' && dailyTotals[exp.date] > 500000) ? 'limit-exceeded' : '';
        
        // 🔴🟢 တစ်လအတွင်း အနည်း/အများ နေ့ဖြစ်ပါက တပ်ဆင်မည့် Class
        let highlightClass = '';
        if (exp.date === maxDay && dailyTotals[exp.date] > 0) highlightClass = 'max-day-highlight';
        else if (exp.date === minDay && dailyTotals[exp.date] > 0 && Object.keys(dailyTotals).length > 1) highlightClass = 'min-day-highlight';

        row.innerHTML = `
            <td class="${highlightClass}">${displayIndex++}</td>
            <td class="${limitClass} ${highlightClass}">${exp.date}</td>
            <td>${exp.title}</td>
            <td class="${limitClass}">${exp.amount.toLocaleString()} ${exp.currency}</td>
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

document.addEventListener('click', function(e) {
    if (!e.target.closest('table') && !e.target.closest('#actionButtonGroup') && !e.target.closest('.form-card') && selectedExpenseId && !isEditMode) {
        selectedExpenseId = null;
        document.getElementById('actionButtonGroup').style.display = 'none';
        const allRows = document.querySelectorAll('#expenseList tr');
        allRows.forEach(r => r.classList.remove('selected-row'));
    }
});

setDefaultDate();
renderExpenses();
