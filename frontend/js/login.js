// $('.message a').click(function(){
//     $('form').animate({height: 'toggle', opacity: 'toggle'}, "slow");
// });

document.getElementById("goLoginBtn").onclick = async function () {
    //const data = document.querySelectorAll() -> asta ii aray cu toate datele
    const username = document.querySelector('#log_usernameBox').value;
    const password = document.querySelector('#log_passwordBox').value;
    await fetch('http://localhost:2999/login', {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({username, password})
    })
};
