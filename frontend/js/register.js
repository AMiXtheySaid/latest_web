async function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
}

document.getElementById("registerBtn").onclick = async function () {
    const username = document.querySelector('#reg_usernameBox').value;
    const password = document.querySelector('#reg_passwordBox').value;
    const email = document.querySelector('#reg_emailBox').value;

    try {
        const res = await fetch('http://localhost:2999/register', {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({username, password, email})
        })

        if (res.ok) {
            const result = await res.json();
            if (result.success) {
                // here
                setCookie('myToken', result.token, 14);
                window.location.replace('/home');
            } else {
                document.getElementById('errorMessage').textContent = result.message;
            }
        } else {
            const errResult = await res.json();
            document.getElementById('errorMessage').textContent = errResult.message;
        }
    } catch (err) {
        console.error('An error occured during redirecting: ', err);
        document.getElementById('errorMessage').textContent = errMessage;
    }
        
};
document.getElementById('gotoLogin').onclick = async function () {
    window.location.replace('/login');
}

document.getElementById('gotoMain').onclick = async function () {
    window.location.replace('/home');
}
