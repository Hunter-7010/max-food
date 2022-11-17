let specialPriceArray;
function autocompleteEventListenerC() {
  let clientName = document.querySelector("#clientName");

  clientName.addEventListener("input", (event) => {
    axios
      .post(`https://maxfood.up.railway.app/axiosautocomplete1`, {
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

    let customerId = document.querySelector("#customerId");

    customerId.value = e.target.innerText.slice(
      e.target.innerText.indexOf("{") + 1,
      e.target.innerText.indexOf("}")
    );

    axios
      .post(`https://maxfood.up.railway.app/clients/axios`, {
        val: customerId.value,
      })
      .then((res) => {
        specialPriceArray = res.data[0];
        const balanceInp = document.querySelector("#balance");
        balanceInp.value = specialPriceArray.balance;
      });

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
