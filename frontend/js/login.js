// $('.message a').click(function(){
//     $('form').animate({height: 'toggle', opacity: 'toggle'}, "slow");
// });

function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
}

document.getElementById("loginBtn").onclick = async function() {
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

document.getElementById('goToRegister').onclick = function() {
    window.location.replace('/register');
}

document.getElementById('goToMain').onclick = function() {
    window.location.replace('/home');
}

document.getElementById('forgotPasswordBtn').onclick = async function() {
    const email = document.querySelector('#emailBox').value;

    try {
        const res = await fetch('/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        })

        if (res.ok) {
            const result = await res.json();

            if (result.success) {
                // vezi aici
                window.location.replace('/change-password');
            } else {
                document.getElementById('errorMessage').textContent = result.message;
            }
        } else {
            const errResponse = await res.json();
            document.getElementById('errorMessage').textContent = errResponse.message;
        }
    } catch (err) {
        console.error('An error occured during email validation: ', err);
        document.getElementById('errorMessage').textContent = 'An error occured during email validation';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const goToForgotPasswword = document.getElementById('goToForgotPassword');
    const goToLogin = document.getElementById('goToLogin')
    const loginForm = document.getElementById('login-form');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    loginForm.style.left = '50%';
    forgotPasswordForm.style.left = '-100%';

    goToForgotPasswword.addEventListener('click', function() {
        loginForm.style.transition = 'left .5s ease';
        loginForm.style.left = '-100%';
        forgotPasswordForm.style.transition = 'left .5s ease';
        forgotPasswordForm.style.left = '50%';
    })

    goToLogin.addEventListener('click', function() {
        loginForm.style.transition = 'left .5s ease';
        loginForm.style.left = '50%';
        forgotPasswordForm.style.transition = 'left .5s ease';
        forgotPasswordForm.style.left = '-100%';
    })
})
