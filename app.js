let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let selectedExpenseId = null; // ရွေးချယ်ထားသော ID ကို မှတ်ရန်

function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    selectedExpenseId = null; // Reset
    document.getElementById('floatingDeleteBtn').style.display = 'none';
    renderExpenses();
}

function addExpense() {
    const titleInput = document.getElementById('titleInput');
    const amountInput = document.getElementById('amountInput');
    const currencyInput = document.getElementById('currencyInput');

    let title = titleInput.value.trim();
    let amountStr = amountInput.value.trim().toLowerCase();
    let currency = currencyInput.value;

    if (title === "" || amountStr === "") {
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

    let today = new Date().toISOString().split('T')[0];

    expenses.push({
        id: Date.now(),
        title: title,
        amount: amount,
        currency: currency,
        date: today
    });

    titleInput.value = "";
    amountInput.value = "";
    saveToStorage();
}

// ဇယားထဲက တစ်ကြောင်းကို နှိပ်လျှင် Select ဖြစ်စေပြီး Delete ခလုတ် ပြသရန်
function selectRow(id, rowElement) {
    // အရင်ရွေးထားတဲ့ စာကြောင်းရှိရင် Highlight ဖြုတ်
    const allRows = document.querySelectorAll('#expenseList tr');
    allRows.forEach(r => r.classList.remove('selected-row'));

    // လက်ရှိနှိပ်လိုက်တဲ့ ID က အရင် ID နဲ့ အတူတူပဲဆိုရင် Deselect လုပ်
    if (selectedExpenseId === id) {
        selectedExpenseId = null;
        document.getElementById('floatingDeleteBtn').style.display = 'none';
    } else {
        selectedExpenseId = id;
        rowElement.classList.add('selected-row');
        document.getElementById('floatingDeleteBtn').style.display = 'block'; // ဖျက်ရန်ခလုတ်ပြမည်
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
        // စာကြောင်းကို နှိပ်လျှင် Select လုပ်ခိုင်းသည်
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

renderExpenses();
