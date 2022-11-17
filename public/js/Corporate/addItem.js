
const itemsContainer = document.querySelector("#itemsContainer");
const button = document.querySelector("#addNewItem");
let count = itemsContainer.children.length + 1;

button.addEventListener("click", function (e) { // adding item to orders
  const div = document.createElement("div");
  div.classList.add("row");
  div.classList.add("my-2");
  div.classList.add("mx-1");

  //Search box
  const searchScreen = document.createElement("div");
  searchScreen.classList.add("searchScreen");

  const searchInputBox = document.createElement("div");
  searchInputBox.classList.add("searchInputBox");

  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.classList.add("searchInput");
  searchInput.classList.add("form-control");
  searchInput.setAttribute("name", `${count}[name]`);

  const searchRealButton = document.createElement("div");
  searchRealButton.classList.add("searchRealButton");

  const fakeBar = document.createElement("div");
  fakeBar.classList.add("fakeBar");

  const autocompletebox = document.createElement("ul");
  autocompletebox.classList.add("autocompleteBox");

  searchInputBox.append(searchInput);
  searchInputBox.append(searchRealButton);
  searchInputBox.append(fakeBar);

  searchScreen.append(searchInputBox);
  searchScreen.append(autocompletebox);

  ////////////////////////////////////
  const nameLable = document.createElement("label");
  nameLable.innerText = "Name:";
  const quantityLabel = document.createElement("label");
  quantityLabel.innerText = "Quantity:";
  const amountLabel = document.createElement("label");
  amountLabel.innerText = "Amount:";
  const priceLabel = document.createElement("label");
  priceLabel.innerText = "Price:";
  const totalLabel = document.createElement("label");
  totalLabel.innerText = "Total:";

  const deleteLabel = document.createElement("label");
  deleteLabel.setAttribute("for", "");

  const nameDiv = document.createElement("div");
  nameDiv.append(nameLable);
  nameDiv.classList.add("col-4");
  const quantityDiv = document.createElement("div");
  quantityDiv.append(quantityLabel);
  quantityDiv.classList.add("col-2");
  const amountDiv = document.createElement("div");
  amountDiv.append(amountLabel);
  amountDiv.classList.add("col-1");
  const priceDiv = document.createElement("div");
  priceDiv.append(priceLabel);
  priceDiv.classList.add("col-2");
  const totalDiv = document.createElement("div");
  totalDiv.append(totalLabel);
  totalDiv.classList.add("col-2");

  const deleteDiv = document.createElement("div");
  deleteDiv.append(deleteLabel);
  deleteDiv.classList.add("col-1");

  // const nameInput = document.createElement("input");
  // nameInput.classList.add("form-control")
  // nameInput.setAttribute("name",`${count}[name]`)
  const quantityInput = document.createElement("input");
  quantityInput.classList.add("form-control");
  quantityInput.setAttribute("name", `${count}[quantity]`); // this is how we configure it to server to send data
  quantityInput.setAttribute("value", 1);
  quantityInput.setAttribute("type", "number");
  const amountInput = document.createElement("input");
  amountInput.setAttribute("name", `${count}[amount]`);
  amountInput.classList.add("form-control");
  amountInput.setAttribute("type", "number");
  amountInput.setAttribute("readOnly","")
  const priceInput = document.createElement("input");
  priceInput.setAttribute("name", `${count}[price]`);
  priceInput.classList.add("form-control");
  priceInput.setAttribute("type", "number");
  priceInput.setAttribute("step", ".01");
  const totalInput = document.createElement("input");
  totalInput.setAttribute("name", `${count}[total]`);
  totalInput.setAttribute("value", 1);
  totalInput.classList.add("totalA");
  totalInput.classList.add("form-control");
  totalInput.setAttribute("step", ".01");
  

  const idInput = document.createElement("input");
  idInput.setAttribute("name",`${count}[id]`)
  idInput.setAttribute("type","hidden")

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn");
  deleteButton.classList.add("btn-danger");
  deleteButton.setAttribute("type", "button");
  deleteButton.innerText = "DELETE";

  deleteButton.classList.add("deleteButton");
  nameDiv.append(searchScreen);
  quantityDiv.append(quantityInput);
  amountDiv.append(amountInput);
  priceDiv.append(priceInput);
  totalDiv.append(totalInput);
  deleteDiv.append(deleteButton);

  div.append(nameDiv);
  div.append(quantityDiv);
  div.append(amountDiv);
  div.append(priceDiv);
  div.append(totalDiv);
  div.append(deleteDiv);
  div.append(idInput);

  itemsContainer.append(div);
  count = count + 1;

});

function deleteButton() {
    itemsContainer.addEventListener("click", function(e){
        if(e.target.classList.contains("deleteButton")){
            
            e.path[2].remove()
            let totalElements = document.getElementsByClassName("totalA");
          let sum = 0;
          for (let i = 0; i < totalElements.length; i++) {
              sum = sum + parseFloat(totalElements[i].value);
          }
          let TotalAmount = document.querySelector("#totalAmount");
          TotalAmount.innerText = sum + " PLN";
          const totalAmountAll = document.querySelector("#totalAmountAll")
          totalAmountAll.value = sum
        }
    })
}
deleteButton()
