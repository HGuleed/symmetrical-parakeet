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

function uploadExpense() {
  const transaction = db.transaction.objectStore(["new_expense"], "readwrite");
  const expenseObjectStore = transaction.objectStore("new_expense");
  const getAll = expenseObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/expense", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["new_expense"], "readwrite");
          const expenseObjectStore = transaction.objectStore("new_expense");

          expenseObjectStore.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", uploadPizza);
