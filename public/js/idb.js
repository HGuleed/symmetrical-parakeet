let db;

const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore("newExpense", { autoIncrement: true });
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
  const transaction = db.transaction(["newExpense"], "readwrite");

  const expenseObjectStore = transaction.objectStore("newExpense");

  expenseObjectStore.add(record);
}

function uploadExpense() {
  //   debugger;
  console.log(db.transaction);
  const transaction = db.transaction(["newExpense"], "readwrite");
  const expenseObjectStore = transaction.objectStore("newExpense");
  const getAll = expenseObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
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

          const transaction = db.transaction(["newExpense"], "readwrite");
          const expenseObjectStore = transaction.objectStore("newExpense");

          expenseObjectStore.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", uploadExpense);
