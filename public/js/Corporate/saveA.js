const savebtn = document.querySelector('#saveButton');
let c=0
savebtn.addEventListener('click',function(e) {
    c=c+1
    const span = document.createElement('span');
    span.classList.add('spinner-border')
    span.classList.add('spinner-border-sm')
    span.setAttribute('role', 'status')
    span.setAttribute('aria-hidden','true')
    savebtn.setAttribute('readonly','')
    savebtn.innerText =""
    savebtn.append(span)
    savebtn.append("Saving...")
    if(c!=1){
        savebtn.disabled = true
    }
})

