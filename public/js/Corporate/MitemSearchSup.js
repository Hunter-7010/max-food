//Contains navbar and search scripts for every screen
//Should have been named as navbar.js
function totalF() {
  let totalElements = document.getElementsByClassName("totalA");
  let sum = 0;
  for (let i = 0; i < totalElements.length; i++) {
    sum = sum + parseFloat(totalElements[i].value);
  }
  let TotalAmount = document.querySelector("#totalAmount");
  TotalAmount.innerText = sum.toFixed(2) + " PLN";
  const totalAmountAll = document.querySelector("#totalAmountAll");
  totalAmountAll.value = sum.toFixed(2);
}
totalF();

function autocompleteEventListenerC() {
  let clientName = document.querySelector("#clientName");

  clientName.addEventListener("input", (event) => {
    axios
      .post(`https://maxfood.up.railway.app/axiosautocomplete2`, {
        val: event.target.value,
      })
      .then((res) => {
        useArrayAddAutoCompleteC(res);
      });
  });
}
autocompleteEventListenerC();

function autocompleteCodeC(id, autocomplete) {
  let li = document.createElement("li");
  li.innerText = autocomplete;
  li.setAttribute("id", id);

  return li;
}

function addAutocompleteSingleC(autocomplete) {
  let autocompleteBox = document.getElementsByClassName("autocompleteBox")[0];

  let id = makeidC(6);
  let code = autocompleteCodeC(id, autocomplete);
  autocompleteBox.appendChild(code);
  let selected = document.getElementById(id);

  selected.addEventListener("click", (e) => {
    let name = document.querySelector("#clientName");
    name.value = e.target.innerText.slice(
      0,
      e.target.innerText.indexOf("[") - 1
    );
    let address = e.path[4].children[1].lastElementChild;
    address.value = e.target.innerText.slice(
      e.target.innerText.indexOf("[") + 1,
      e.target.innerText.indexOf("]")
    );
    let customerId = document.querySelector("#customerId");

    customerId.value = e.target.innerText.slice(
      e.target.innerText.indexOf("{") + 1,
      e.target.innerText.indexOf("}")
    );
    let autocompletebox = e.path[1];
    autocompletebox.innerHTML = "";
  });
}
function makeidC(length) {
  let result = "";
  let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function useArrayAddAutoCompleteC(array) {
  let arrayData = array.data;

  let autocompleteBox = document.getElementsByClassName("autocompleteBox")[0];
  autocompleteBox.innerHTML = "";

  for (let i = 0; i < arrayData.length; i++) {
    const title =
      arrayData[i].name +
      " [" +
      arrayData[i].address +
      "]" +
      " {" +
      arrayData[i]._id +
      "}";
    addAutocompleteSingleC(title);
  }
}

////////////////////////////////////////////////////////////////////////
function autocompleteEventListener() {
  document
    .getElementById("itemsContainer")
    .addEventListener("input", (event) => {
      // Step 2
      if (event.target.classList.contains("searchInput")) {
        if (event.target) {
          // Step 3

          axios
            .post(`https://maxfood.up.railway.app/axiosautocomplete`, {
              val: event.target.value,
            })
            .then((res) => {
              useArrayAddAutoComplete(res);
            });
        }
      }
    });
}
autocompleteEventListener();

function autocompleteCode(id, autocomplete) {
  let li = document.createElement("li");
  li.innerText = autocomplete;
  li.setAttribute("id", id);

  return li;
}

function addAutocompleteSingle(autocomplete) {
  document
    .getElementById("itemsContainer")
    .addEventListener("input", (event) => {
      if (event.target.classList.contains("searchInput")) {
        let autocompleteBox = event.path[2].lastElementChild;
        let id = makeid(6);
        let code = autocompleteCode(id, autocomplete);
        autocompleteBox.appendChild(code);
        let selected = document.getElementById(id);

        selected.addEventListener("click", (e) => {
          let Name =
            e.path[4].children[0].lastElementChild.children[0].children[0];
          let NameVal = e.target.innerText.slice(
            0,
            e.target.innerText.indexOf("_")
          );
          Name.value = "";
          Name.value = `${NameVal}`;

          let price = e.path[4].children[3].lastElementChild;
          let Value = e.target.innerText.slice(
            e.target.innerText.indexOf("=") + 1,
            e.target.innerText.indexOf("[")
          );
          price.value = "";
          price.value = `${Value}`;

          let quantity = e.path[4].children[1].lastElementChild;

          let amount = e.path[4].children[2].lastElementChild;
          let amountVal = e.target.innerText.slice(
            e.target.innerText.indexOf("<") + 1,
            e.target.innerText.indexOf(">")
          );
          amount.value = parseFloat(amountVal);
          amount.value = "";
          amount.value = `${amountVal}`;

          let total = e.path[4].children[4].lastElementChild;
          total.value = "";
          total.value = quantity.value * Value;
          if (amount.value) {
            total.value = quantity.value * amount.value * Value;
          }

          let idValue = e.target.innerText.slice(
            e.target.innerText.indexOf("{") + 1,
            e.target.innerText.indexOf("}")
          );
          let id = e.path[4].children[6];
          id.value = "";
          id.value = idValue;

          let totalElements = document.getElementsByClassName("totalA");
          let sum = 0;
          for (let i = 0; i < totalElements.length; i++) {
            if (typeof parseFloat(totalElements[i].value) == "number") {
              sum = sum + parseFloat(totalElements[i].value);
            }
          }
          const totalAmountAll = document.querySelector("#totalAmountAll");
          totalAmountAll.value = sum.toFixed(2);
          let TotalAmount = document.querySelector("#totalAmount");
          TotalAmount.innerText = sum + " PLN";

          let autocompleteBox = e.path[1];
          autocompleteBox.innerHTML = "";
        });
      }
    });
}

function makeid(length) {
  let result = "";
  let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function useArrayAddAutoComplete(array) {
  let arrayData = array.data;

  document
    .getElementById("itemsContainer")
    .addEventListener("input", (event) => {
      if (event.target.classList.contains("searchInput")) {
        let autocompleteBox = event.path[2].lastElementChild;
        autocompleteBox.innerHTML = "";
      }
    });

  for (let i = 0; i < arrayData.length; i++) {
    const title =
      arrayData[i].itemName +
      `_zl=${arrayData[i].price}` +
      `[${arrayData[i].quantity}]` +
      `{${arrayData[i]._id}}` +
      `<${arrayData[i].amount}>`;
    addAutocompleteSingle(title);
  }
}

function totalPrice() {
  document
    .getElementById("itemsContainer")
    .addEventListener("input", (event) => {
      if (event.target.classList.contains("totalA")) {
        let totalElements = document.getElementsByClassName("totalA");
        let sum = 0;
        for (let i = 0; i < totalElements.length; i++) {
          if (typeof parseFloat(totalElements[i].value) == "number") {
            sum = sum + parseFloat(totalElements[i].value);
          }
        }
        let TotalAmount = document.querySelector("#totalAmount");
        TotalAmount.innerText = sum.toFixed(2) + " PLN";
        const totalAmountAll = document.querySelector("#totalAmountAll");
        totalAmountAll.value = sum.toFixed(2);
      } else if (event.target.attributes.type.value === "number") {
        let quantityE = event.path[2].children[1].lastElementChild;
        let priceE = event.path[2].children[3].lastElementChild;
        let amount = event.path[2].children[2].lastElementChild;
        let totalE = event.path[2].children[4].lastElementChild;

        totalE.value = quantityE.value * priceE.value;
        if (amount.value) {
          totalE.value = quantityE.value * amount.value * priceE.value;
        }

        let totalElements = document.getElementsByClassName("totalA");
        let sum = 0;
        for (let i = 0; i < totalElements.length; i++) {
          if (typeof parseFloat(totalElements[i].value) == "number") {
            sum = sum + parseFloat(totalElements[i].value);
          }
        }
        let TotalAmount = document.querySelector("#totalAmount");
        TotalAmount.innerText = sum.toFixed(2) + " PLN";
        const totalAmountAll = document.querySelector("#totalAmountAll");
        totalAmountAll.value = sum.toFixed(2);
      }
    });
}
totalPrice();
