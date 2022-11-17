//Contains navbar and search scripts for every screen
//Should have been named as navbar.js
let choice = "Any";

function autocompleteEventListener() {
  let searchBox = document.querySelector(".searchInput");

  searchBox.addEventListener("input", fetchAutocomplete);
}
autocompleteEventListener();

function autocompleteCode(id, autocomplete) {
  let li = document.createElement("li");
  li.innerText = autocomplete;
  li.setAttribute("id", id);

  return li;
}

function addAutocompleteSingle(autocomplete) {
  let autocompleteBox = document.getElementsByClassName("autocompleteBox")[0];

  let id = makeid(6);
  let code = autocompleteCode(id, autocomplete);
  autocompleteBox.appendChild(code);
  let selected = document.getElementById(id);
  selected.addEventListener("click", (e) => {
    const sId = e.target.innerText.slice(
      e.target.innerText.indexOf("{") + 1,
      e.target.innerText.indexOf("}")
    );
    const month = document.querySelector("#month");
    const emonth = document.querySelector("#emonth");
    window.location.href = `https://maxfood.up.railway.app/expenses?val=${sId}&month=${month.value}&pmonth=${emonth.value}`;
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

function fetchAutocomplete() {
  let inputBox = document.querySelector(".searchInput");
  let inputVal = inputBox.value;

  axios
    .post(`https://maxfood.up.railway.app/axiosautocomplete2`, {
      val: inputVal,
    })
    .then((res) => {
      useArrayAddAutoComplete(res);
    });
}

function useArrayAddAutoComplete(array) {
  let arrayData = array.data;

  let autocompleteBox = document.getElementsByClassName("autocompleteBox")[0];
  autocompleteBox.innerHTML = "";

  for (let i = 0; i < arrayData.length; i++) {
    const title = arrayData[i].name + " {" + arrayData[i]._id + "}";
    addAutocompleteSingle(title);
  }
}
