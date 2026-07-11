let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let selectedExpenseId = null;
let isEditMode = false;
let currentLang = localStorage.getItem('appLang') || 'mm';

const translations = {
    mm: {
        appTitle: "💰 နေ့စဉ်အသုံးစရိတ် မှတ်တမ်း",
        formTitle: "အချက်အလက်အသစ်ထည့်ရန်",
        editFormTitle: "📝 အချက်အလက် ပြင်ဆင်ရန်",
        labelTitle: "အသုံးပြုသည့် အကြောင်းအရာ:",
        placeholderTitle: "ဥပမာ - စျေးဝယ်ခြင်း",
        labelDate: "ရက်စွဲရွေးချယ်ရန်:",
        labelAmount: "ကုန်ကျငွေ ပမာဏ:",
        placeholderAmount: "ဥပမာ - 100k သို့မဟုတ် 50000",
        addBtn: "➕ အသစ်ထည့်မည် (Add)",
        updateBtn: "💾 ပြင်ဆင်ချက်များသိမ်းမည် (Update)",
        filterTitle: "📊 စာရင်းများ ပြန်လည်ကြည့်ရှုရန် (History)",
        labelFilterMode: "ကြည့်ရှုမည့် ပုံစံ:",
        optAll: "စာရင်းအားလုံးကြည့်မည်",
        optDate: "ရက်စွဲအလိုက်ကြည့်မည်",
        optMonth: "လအလိုက် (လချုပ်) ကြည့်မည်",
        labelFilterDate: "ရက်စွဲရွေးရန်:",
        labelFilterMonth: "လရွေးရန်:",
        thIndex: "အမှတ်စဉ်",
        thDate: "ရက်စွဲ",
        thTitle: "အကြောင်းအရာ",
        thAmount: "ကုန်ကျငွေ",
        totalHeader: "📊 စုစုပေါင်းကုန်ကျငွေစာရင်းများ -",
        floatingEditBtn: "✏️ ပြင်ဆင်ရန် (Edit)",
        floatingDeleteBtn: "🗑️ ဖျက်ရန် (Delete)",
        noData: "ပြသစရာ စာရင်းမရှိသေးပါ",
        noTotal: "အသုံးစရိတ် မရှိသေးပါ",
        totalSuffix: "စုစုပေါင်း",
        alertEmpty: "အချက်အလက် အကုန်ဖြည့်ပါဦးဗျာ။",
        alertInvalidAmount: "⚠️ ကုန်ကျငွေနေရာတွင် ဂဏန်းများ သို့မဟုတ် အဆုံး၌ 'k' တစ်လုံးတည်းသာ ရိုက်ထည့်ခွင့်ရှိပါတယ်ဗျာ။",
        alertNan: "ပမာဏနေရာမှာ ဂဏန်းပဲ ရိုက်ပါဗျာ။",
        confirmDelete: "ရွေးချယ်ထားသော ဤအသုံးစရိတ်ကို ဖျက်ပစ်ရန် သေချာပါသလား?"
    },
    en: {
        appTitle: "💰 Daily Expense Tracker",
        formTitle: "Add New Record",
        editFormTitle: "📝 Edit Record",
        labelTitle: "Expense Description:",
        placeholderTitle: "e.g., Shopping, Cafe",
        labelDate: "Select Date:",
        labelAmount: "Amount Spent:",
        placeholderAmount: "e.g., 100k or 50000",
        addBtn: "➕ Add Expense",
        updateBtn: "💾 Update Changes",
        filterTitle: "📊 View History",
        labelFilterMode: "Filter Mode:",
        optAll: "Show All Records",
        optDate: "Filter by Date",
        optMonth: "Filter by Month",
        labelFilterDate: "Select Date:",
        labelFilterMonth: "Select Month:",
        thIndex: "No.",
        thDate: "Date",
        thTitle: "Description",
        thAmount: "Amount",
        totalHeader: "📊 Total Expense Summary -",
        floatingEditBtn: "✏️ Edit",
        floatingDeleteBtn: "🗑️ Delete",
        noData: "No records found",
        noTotal: "No expenses recorded yet",
        totalSuffix: "Total",
        alertEmpty: "Please fill in all information.",
        alertInvalidAmount: "⚠️ Please enter numbers only or a single 'k' at the end.",
        alertNan: "Please enter a valid numeric value.",
        confirmDelete: "Are you sure you want to delete this expense?"
    },
    th: {
        appTitle: "💰 บันทึกรายจ่ายประจำวัน",
        formTitle: "เพิ่มรายการใหม่",
        editFormTitle: "📝 แก้ไขรายการ",
        labelTitle: "รายละเอียดค่าใช้จ่าย:",
        placeholderTitle: "เช่น ช้อปปิ้ง, ซื้อของ",
        labelDate: "เลือกวันที่:",
        labelAmount: "จำนวนเงิน:",
        placeholderAmount: "เช่น 100k หรือ 50000",
        addBtn: "➕ เพิ่มรายการ",
        updateBtn: "💾 บันทึกการแก้ไข",
        filterTitle: "📊 ดูประวัติย้อนหลัง",
        labelFilterMode: "รูปแบบการดู:",
        optAll: "ดูรายการทั้งหมด",
        optDate: "ดูตามวันที่",
        optMonth: "ดูตามรายเดือน",
        labelFilterDate: "เลือกวันที่:",
        labelFilterMonth: "เลือกเดือน:",
        thIndex: "ลำดับ",
        thDate: "วันที่",
        thTitle: "รายการ",
        thAmount: "จำนวนเงิน",
        totalHeader: "📊 สรุปยอดรวมค่าใช้จ่าย -",
        floatingEditBtn: "✏️ แก้ไข",
        floatingDeleteBtn: "🗑️ ลบรายการ",
        noData: "ไม่มีข้อมูลแสดง",
        noTotal: "ยังไม่มีบันทึกค่าใช้จ่าย",
        totalSuffix: "รวมทั้งหมด",
        alertEmpty: "กรุณากรอกข้อมูลให้ครบถ้วน",
        alertInvalidAmount: "⚠️ กรุณาใส่เฉพาะตัวเลขหรือตัวอักษร 'k' ตัวเดียวที่ท้ายเท่านั้น",
        alertNan: "กรุณาใส่ตัวเลขที่ถูกต้อง",
        confirmDelete: "คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
    }
};

function updateLanguageUI() {
    const lang = currentLang;
    const t = translations[lang];

    // Cache ကြောင့် ID တစ်ခုခု ချို့ယွင်းနေပါက ကုဒ်ရပ်မသွားစေရန် အကာအကွယ်ပေးထားခြင်း
    if(document.getElementById('appTitle')) document.getElementById('appTitle').innerHTML = t.appTitle;
    if(document.getElementById('formTitle')) document.getElementById('formTitle').innerText = isEditMode ? t.editFormTitle : t.formTitle;
    if(document.getElementById('labelTitle')) document.getElementById('labelTitle').innerText = t.labelTitle;
    if(document.getElementById('titleInput')) document.getElementById('titleInput').placeholder = t.placeholderTitle;
    if(document.getElementById('labelDate')) document.getElementById('labelDate').innerText = t.labelDate;
    if(document.getElementById('labelAmount')) document.getElementById('labelAmount').innerText = t.labelAmount;
    if(document.getElementById('amountInput')) document.getElementById('amountInput').placeholder = t.placeholderAmount;
    
    const addBtn = document.getElementById('addBtn');
    if(addBtn) addBtn.innerText = isEditMode ? t.updateBtn : t.addBtn;

    if(document.getElementById('filterTitle')) document.getElementById('filterTitle').innerText = t.filterTitle;
    if(document.getElementById('labelFilterMode')) document.getElementById('labelFilterMode').innerText = t.labelFilterMode;
    if(document.getElementById('optAll')) document.getElementById('optAll').innerText = t.optAll;
    if(document.getElementById('optDate')) document.getElementById('optDate').innerText = t.optDate;
    if(document.getElementById('optMonth')) document.getElementById('optMonth').innerText = t.optMonth;
    if(document.getElementById('labelFilterDate')) document.getElementById('labelFilterDate').innerText = t.labelFilterDate;
    if(document.getElementById('labelFilterMonth')) document.getElementById('labelFilterMonth').innerText = t.labelFilterMonth;

    if(document.getElementById('thIndex')) document.getElementById('thIndex').innerText = t.thIndex;
    if(document.getElementById('thDate')) document.getElementById('thDate').innerText = t.thDate;
    if(document.getElementById('thTitle')) document.getElementById('thTitle').innerText = t.thTitle;
    if(document.getElementById('thAmount')) document.getElementById('thAmount').innerText = t.thAmount;
    if(document.getElementById('totalHeader')) document.getElementById('totalHeader').innerText = t.totalHeader;

    if(document.getElementById('floatingEditBtn')) document.getElementById('floatingEditBtn').innerText = t.floatingEditBtn;
    if(document.getElementById('floatingDeleteBtn')) document.getElementById('floatingDeleteBtn').innerText = t.floatingDeleteBtn;
    
    if(document.getElementById('langSelect')) document.getElementById('langSelect').value = lang;
}

function changeLanguage() {
    currentLang = document.getElementById('langSelect').value;
    localStorage.setItem('appLang', currentLang);
    updateLanguageUI();
    renderExpenses();
}

function saveToStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    resetActionState();
    renderExpenses();
    setDefaultDate();
}

function resetActionState() {
    selectedExpenseId = null;
    isEditMode = false;
    if(document.getElementById('actionButtonGroup')) document.getElementById('actionButtonGroup').style.display = 'none';
    
    if(document.getElementById('titleInput')) document.getElementById('titleInput').value = "";
    if(document.getElementById('amountInput')) document.getElementById('amountInput').value = "";
    updateLanguageUI();
}

function setDefaultDate() {
    const dateInput = document.getElementById('dateInput');
    if(!dateInput) return;
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
    const t = translations[currentLang];
    const titleInput = document.getElementById('titleInput');
    const amountInput = document.getElementById('amountInput');
    const currencyInput = document.getElementById('currencyInput');
    const dateInput = document.getElementById('dateInput');

    let title = titleInput.value.trim();
    let amountStr = amountInput.value.trim().toLowerCase();
    let currency = currencyInput.value;
    let selectedDate = dateInput.value;

    if (title === "" || amountStr === "" || selectedDate === "") {
        alert(t.alertEmpty);
        return;
    }

    const validPattern = /^[0-9]+(\.[0-9]+)?k?$/;
    if (!validPattern.test(amountStr)) {
        alert(t.alertInvalidAmount);
        return;
    }

    if (amountStr.endsWith('k')) {
        amountStr = amountStr.replace('k', '000');
    }

    let amount = parseFloat(amountStr);
    if (isNaN(amount)) {
        alert(t.alertNan);
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
        if(btnGroup) btnGroup.style.display = 'none';
    } else {
        selectedExpenseId = id;
        rowElement.classList.add('selected-row');
        if(btnGroup) btnGroup.style.display = 'flex';
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

    updateLanguageUI();
    if(document.getElementById('actionButtonGroup')) document.getElementById('actionButtonGroup').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteSelectedExpense() {
    const t = translations[currentLang];
    if (!selectedExpenseId) return;

    if (confirm(t.confirmDelete)) {
        expenses = expenses.filter(exp => exp.id !== selectedExpenseId);
        saveToStorage();
    }
}

function renderExpenses() {
    const t = translations[currentLang];
    const list = document.getElementById('expenseList');
    const totalArea = document.getElementById('totalArea');
    if(!list || !totalArea) return;
    
    list.innerHTML = "";
    totalArea.innerHTML = "";

    const filterType = document.getElementById('filterType').value;
    const filterDate = document.getElementById('filterDate').value;
    const filterMonth = document.getElementById('filterMonth').value;

    let totals = {};
    let dailyTotals = {}; 
    let displayExpenses = [];

    expenses.forEach((exp) => {
        if (filterType === 'date' && exp.date !== filterDate) return;
        if (filterType === 'month' && exp.date.substring(0, 7) !== filterMonth) return;

        displayExpenses.push(exp);

        if (exp.currency === 'Ks') {
            dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + exp.amount;
        }
    });

    let maxDay = null, minDay = null;
    let maxAmount = -1, minAmount = Infinity;
    const uniqueDaysCount = Object.keys(dailyTotals).length;

    if (uniqueDaysCount > 1) {
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
    }

    let displayIndex = 1;
    displayExpenses.forEach((exp) => {
        let row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = function() { selectRow(exp.id, this); };
        
        let dateHighlightClass = '';
        if (uniqueDaysCount > 1) {
            if (exp.date === maxDay) dateHighlightClass = 'max-day-date';
            else if (exp.date === minDay) dateHighlightClass = 'min-day-date';
        }

        row.innerHTML = `
            <td>${displayIndex++}</td>
            <td class="${dateHighlightClass}">${exp.date}</td>
            <td>${exp.title}</td>
            <td>${exp.amount.toLocaleString()} ${exp.currency}</td>
        `;
        list.appendChild(row);

        totals[exp.currency] = (totals[exp.currency] || 0) + exp.amount;
    });

    if (displayIndex === 1) {
        list.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#64748b; padding:20px;">${t.noData}</td></tr>`;
        totalArea.innerHTML = `<div class="total-item" style="color: #64748b; text-align:center;">${t.noTotal}</div>`;
    } else {
        for (let curr in totals) {
            let div = document.createElement('div');
            div.className = "total-item";
            
            let colorClass = '';
            if (curr === 'Ks') {
                colorClass = (totals[curr] > 500000) ? 'total-danger' : 'total-success';
            }
            
            div.innerHTML = `<span class="${colorClass}">🔹 ${curr} ${t.totalSuffix} = ${totals[curr].toLocaleString()} ${curr}</span>`;
            totalArea.appendChild(div);
        }
    }
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('table') && !e.target.closest('#actionButtonGroup') && !e.target.closest('.form-card') && selectedExpenseId && !isEditMode) {
        selectedExpenseId = null;
        if(document.getElementById('actionButtonGroup')) document.getElementById('actionButtonGroup').style.display = 'none';
        const allRows = document.querySelectorAll('#expenseList tr');
        allRows.forEach(r => r.classList.remove('selected-row'));
    }
});

// HTML Structure တွေ အကုန်လုံး အပြည့်အဝ Load ဖြစ်ပြီးမှ သေချာပေါက် Run ရန် ညွှန်ကြားခြင်း (Cache Error ကာကွယ်ရန်)
window.addEventListener('DOMContentLoaded', () => {
    setDefaultDate();
    updateLanguageUI();
    renderExpenses();
});
// ==========================================
// 🔄 PWA AUTO-UPDATE SYSTEM ("Update This" Feature)
// ==========================================

// ဆရာကြီး ကုဒ်အသစ်တင်တိုင်း ဤနံပါတ်ကို ၁ တိုးပေးပါ (ဥပမာ - 1.0.1, 1.0.2)
const APP_VERSION = "1.0.1"; 

function checkAppUpdate() {
    const savedVersion = localStorage.getItem('appVersion');
    
    // ဗားရှင်းအသစ် ဖြစ်နေပါက Update ခလုတ်တွဲ ပေါ်လာစေရန် ခိုင်းခြင်း
    if (savedVersion && savedVersion !== APP_VERSION) {
        showUpdateNotification();
    }
    
    // လက်ရှိဗားရှင်းကို မှတ်သားထားခြင်း
    localStorage.setItem('appVersion', APP_VERSION);
}

function showUpdateNotification() {
    // မျက်နှာပြင် အပေါ်ဆုံးတွင် Update Banner လေး တစ်ခါတည်း ဆောက်ပြီး ပြသခြင်း
    const updateBanner = document.createElement('div');
    updateBanner.id = "updateBanner";
    
    // ဘာသာစကားအလိုက် စာသားပြောင်းလဲခြင်း
    const msg = currentLang === 'en' ? "🔄 New update available!" : currentLang === 'th' ? "🔄 มีเวอร์ชันใหม่พร้อมใช้งาน!" : "🔄 ဗားရှင်းအသစ် ရရှိနိုင်ပါပြီ!";
    const btnText = currentLang === 'en' ? "Update This" : currentLang === 'th' ? "อัปเดตตอนนี้" : "ယခုဗားရှင်းမြှင့်မည် (Update This)";

    updateBanner.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; background: #f59e0b; color: white; text-align: center; padding: 12px; font-weight: bold; font-size: 14px; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; justify-content: center; align-items: center; gap: 15px;">
            <span>${msg}</span>
            <button onclick="applyAppUpdate()" style="width: auto; margin: 0; padding: 6px 15px; font-size: 12px; background: white; color: #b45309; border-radius: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-weight: bold;">${btnText}</button>
        </div>
    `;
    document.body.appendChild(updateBanner);
}

function applyAppUpdate() {
    // Cache များကို ရာနှုန်းပြည့် ရှင်းလင်းပြီး App အား Hard Reload လုပ်ပစ်ခြင်း
    if ('caches' in window) {
        caches.keys().then(names => {
            for (let name of names) caches.delete(name);
        });
    }
    // Website အား အသစ်ပြန်ဖွင့်ခြင်း
    window.location.reload(true);
}

// Dom Loaded တွင် Update ရှိမရှိ စစ်ဆေးခိုင်းခြင်း
window.addEventListener('DOMContentLoaded', () => {
    checkAppUpdate();
});
