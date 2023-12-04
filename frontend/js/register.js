document.getElementById("registerBtn").onclick = async function () {
    const username = document.querySelector('#reg_usernameBox').value;
    const password = document.querySelector('#reg_passwordBox').value;
    const email = document.querySelector('#reg_emailBox').value;

    await fetch('http://localhost:2999/register', {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({username, password, email})
    })
};
