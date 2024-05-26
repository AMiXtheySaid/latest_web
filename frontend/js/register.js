document.getElementById("registerBtn").onclick = async function () {
    const username = document.querySelector('#reg_usernameBox').value;
    const password = document.querySelector('#reg_passwordBox').value;
    const email = document.querySelector('#reg_emailBox').value;
    const phone = document.querySelector('#reg_phoneBox').value;

    var successfullyRegistered = false;
    try {
        const res = await fetch('/register-btn', {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ username, password, email, phone })
        })

        if (res.ok) {
            const result = await res.json();

            if (result.success) {
                successfullyRegistered = true;                
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

    // auto login
    if (successfullyRegistered) {
        try {
            const res = await fetch('/login-info', {
                method: "GET",
                headers: {
                    'Content-Type' : 'application/json',
                    'Username' : username,
                    'Password' : password
                },
            });
    
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
    }
        
};

document.getElementById('gotoLogin').onclick = async function () {
    window.location.replace('/login');
}

document.getElementById('gotoMain').onclick = async function () {
    window.location.replace('/home');
}
