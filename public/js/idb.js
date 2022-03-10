let db;

const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore("new_expense", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadExpense();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["new_expense"], "readwrite");

  const expenseObjectStore = transaction.objectStore("new_expense");

  expenseObjectStore.add(record);
}
