document.getElementById('deleteAccountBtn').onclick = async function() {
    var password = document.querySelector('#passwordField').value;
    const token = getCookie('myToken');

    try {
        const res = await fetch('delete-account', {
            method: "DELETE",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({token, password})
        })

        if (res.ok) {
            const result = await res.json();

            if (result.success) {
                deleteCookie('myToken');
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
}

document.getElementById('goBackBtn').onclick = function() {
    window.location.replace('/home');
}