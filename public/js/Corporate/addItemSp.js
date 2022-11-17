const itemsContainer = document.querySelector("#itemsContainer");
const button = document.querySelector("#addNewItem");
let count = itemsContainer.children.length + 1;

button.addEventListener("click", function (e) {
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
  
  const priceLabel = document.createElement("label");
  priceLabel.innerText = "Price:";
  

  const deleteLabel = document.createElement("label");
  deleteLabel.setAttribute("for", "");

  const nameDiv = document.createElement("div");
  nameDiv.append(nameLable);
  nameDiv.classList.add("col-8");
 
  
  const priceDiv = document.createElement("div");
  priceDiv.append(priceLabel);
  priceDiv.classList.add("col-3");
 

  const deleteDiv = document.createElement("div");
  deleteDiv.append(deleteLabel);
  deleteDiv.classList.add("col-1");



  
  const priceInput = document.createElement("input");
  priceInput.setAttribute("name", `${count}[price]`);
  priceInput.classList.add("form-control");
  priceInput.setAttribute("type", "number");
  priceInput.setAttribute("step", ".01")
  

  const idInput = document.createElement("input");
  idInput.setAttribute("name",`${count}[itemId]`)
  idInput.setAttribute("type","hidden")

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn");
  deleteButton.classList.add("btn-danger");
  deleteButton.setAttribute("type", "button");
  deleteButton.innerText = "DELETE";

  deleteButton.classList.add("deleteButton");
  nameDiv.append(searchScreen);
  
  priceDiv.append(priceInput);
 
  deleteDiv.append(deleteButton);

  div.append(nameDiv);
  
  div.append(priceDiv);
  
  div.append(deleteDiv);
  div.append(idInput);

  itemsContainer.append(div);
  count = count + 1;
});

function deleteButton() {
    itemsContainer.addEventListener("click", function(e){
        if(e.target.classList.contains("deleteButton")){
            
            e.path[2].remove()
        }
    })
}
deleteButton()
