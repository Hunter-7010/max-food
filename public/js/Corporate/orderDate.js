function dateQuery() {
  const date = document.querySelector("#date");
  const selectR = document.querySelector("#select");
  const btn = document.querySelector("#dateSubmit");
  btn.addEventListener("click", function (e) {
    window.location.href = `https://maxfood.up.railway.app/orders/routes?val=${date.value}&s=${selectR.value}`;
  });
}
dateQuery();

const printRoute = document.querySelector("#printRoute");
printRoute.addEventListener("click", function () {
  const print = document.querySelector("#route").innerHTML;
  const original = document.body.innerHTML;

  document.body.innerHTML = print;
  window.print();
  document.body.innerHTML = original;
});
