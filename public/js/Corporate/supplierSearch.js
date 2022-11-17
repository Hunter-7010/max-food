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
  selected.addEventListener("click", () => {
    window.location.href = createUrlSearchQuery(autocomplete);
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
    const title = arrayData[i].name;
    addAutocompleteSingle(title);
  }
}

function carrySearch() {
  //SELECTING CONDTION

  let searchButton = document.querySelector(".searchRealButton");
  let searchInput = document.querySelector(".searchInput");

  searchButton.addEventListener("click", doSearch);

  searchInput.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
      doSearch();
    }
  });

  function doSearch() {
    let val = searchInput.value;
    if (val == "") {
      return;
    }
    window.location.href = createUrlSearchQuery(val);
  }
}
carrySearch();

function createUrlSearchQuery(searchValToPut) {
  let url = `https://maxfood.up.railway.app/suppliers?val=${searchValToPut}`;
  return url;
}

function searchBoxDesignManager() {
  let searchli = document.getElementsByClassName("searchli")[0];
  let searchScreen = document.querySelector(".searchScreen");

  let opened = false;
  let openedQ = false;

  searchli.addEventListener("click", () => {
    if (opened == false) {
      opened = true;
      searchScreen.style.transform = "translateY(0)";
      searchli.innerText = "Close";
    } else {
      closeQueryBox();
      openedQ = false;
      opened = false;
      searchScreen.style.transform = "translateY(-100%)";
      searchli.innerText = "Search";
    }
  });
}
searchBoxDesignManager();
