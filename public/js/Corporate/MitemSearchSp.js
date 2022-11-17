//Contains navbar and search scripts for every screen
//Should have been named as navbar.js
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

function addAutocompleteSingle(autocomplete, data) {
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

          let price = e.path[4].children[1].lastElementChild;
          let Value = e.target.innerText.slice(
            e.target.innerText.indexOf("=") + 1,
            e.target.innerText.indexOf("[")
          );
          price.value = "";
          price.value = `${Value}`;

          let idValue = e.target.innerText.slice(
            e.target.innerText.indexOf("{") + 1,
            e.target.innerText.indexOf("}")
          );
          let id = e.path[4].children[3];
          id.value = "";
          id.value = idValue;

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
      `{${arrayData[i]._id}}`;
    addAutocompleteSingle(title);
  }
}
