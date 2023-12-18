// $('.message a').click(function(){
//     $('form').animate({height: 'toggle', opacity: 'toggle'}, "slow");
// });

async function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
}

document.getElementById("loginBtn").onclick = async function () {
    const username = document.querySelector('#log_usernameBox').value;
    const password = document.querySelector('#log_passwordBox').value;

    try {
        const res = await fetch('/login', {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({username, password})
        })

        if (res.ok) {
            const result = await res.json();
            if (result.success) {
                setCookie('myToken', result.token, 14);
                window.location.replace('/home');
            } else {
                document.getElementById('errorMessage').textContent = result.message;
            }
        } else {
            const errResponse = await res.json();
            document.getElementById('errorMessage').textContent = errResponse.message;
        }
        
    } catch (err) {
        console.error('An error occured during login: ', err);
        document.getElementById('errorMessage').textContent = 'An error occured during login';
    }

};

document.getElementById('gotoRegister').onclick = async function () {
    window.location.replace('/register');
}

document.getElementById('gotoMain').onclick = async function () {
    window.location.replace('/home');
}

document.getElementById('logOut').onclick = async function() {
    var token = localStorage.getItem()
    const res = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(token)
    })
}
