function getCookie(name) {
    var cookies = document.cookie.split('; ');

    for (var cookie of cookies) {
        var [cookieName, cookieValue] = cookie.split('=');

        if (cookieName === name) {
            return cookieValue;
        }
    }

    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('changePasswordForm').style.display = 'none';
})

document.getElementById('goToMain').onclick = function() {
    window.location.replace('/home');
}

document.getElementById('changePasswordBtn').onclick = async function() {
    const oldPassword = document.querySelector('#oldPassword').value;
    const newPassword = document.querySelector('#newPassword').value;
    const repeatNewPassword = document.querySelector('#repeatNewPassword').value;

    try {
        const res = await fetch ('/change-password', {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({oldPassword, newPassword, repeatNewPassword})
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
        console.error('An error occured during password change: ', err);
        document.getElementById('errorMessage').textContent = 'An error occured during password change';
    }
}
 