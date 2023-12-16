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
                console.log(`Your token is ${result.token}`);
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
