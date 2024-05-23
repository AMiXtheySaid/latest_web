document.getElementById('goToMain').onclick = function() {
    window.location.replace('/home');
}

document.getElementById('changePasswordBtn').onclick = async function() {
    const oldPassword = document.querySelector('#oldPassword').value;
    const newPassword = document.querySelector('#newPassword').value;
    const repeatNewPassword = document.querySelector('#repeatNewPassword').value;
    const token = getCookie("myToken");

    try {
        const res = await fetch ('/change-password', {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ token, oldPassword, newPassword, repeatNewPassword })
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
        console.error('An error occured during Password change: ', err);
        document.getElementById('errorMessage').textContent = 'An error occured during password change';
    }
}
 