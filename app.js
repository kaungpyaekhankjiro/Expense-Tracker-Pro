// LocalStorage ထဲကနေ Data အဟောင်းတွေကို ဆွဲထုတ်ခြင်း၊ မရှိရင် Array အလွတ်ဆောက်ခြင်း
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
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

    // k / K ကို 000 ပြောင်းပေးတဲ့ စနစ်
    if (amountStr.endsWith('k')) {
        amountStr = amountStr.replace('k', '000');
    }

    let amount = parseFloat(amountStr);
    if (isNaN(amount)) {
        alert("ပမာဏနေရာမှာ ဂဏန်းပဲ ရိုက်ပါဗျာ။");
        return;
    }

    // ရက်စွဲရယူခြင်း
    // မိမိစက်၏ Timezone အမှန်အတိုင်း ရက်စွဲရယူခြင်း
    let localDate = new Date();
    let year = localDate.getFullYear();
    let month = String(localDate.getMonth() + 1).padStart(2, '0');
    let day = String(localDate.getDate()).padStart(2, '0');
    let today = `${year}-${month}-${day}`;

    // Data အသစ်ကို Array ထဲထည့်ခြင်း
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

function deleteExpense(id) {
    if (confirm("ဤအသုံးစရိတ်ကို ဖျက်ပစ်ရန် သေချာပါသလား?")) {
        expenses = expenses.filter(exp => exp.id !== id);
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
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${exp.date}</td>
            <td>${exp.title}</td>
            <td>${exp.amount.toLocaleString()} ${exp.currency}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${exp.id})">🗑️ ဖျက်မည်</button></td>
        `;
        list.appendChild(row);

        // Total တွက်ချက်ခြင်း
        totals[exp.currency] = (totals[exp.currency] || 0) + exp.amount;
    });

    // Total display ပြသခြင်း
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

// App စတက်လာလျှင် ဒေတာများကို တန်းပြရန်
renderExpenses();