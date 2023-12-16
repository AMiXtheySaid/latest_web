// $('.message a').click(function(){
//     $('form').animate({height: 'toggle', opacity: 'toggle'}, "slow");
// });

document.getElementById("loginBtn").onclick = async function () {
    const username = document.querySelector('#log_usernameBox').value;
    const password = document.querySelector('#log_passwordBox').value;

    try {
        const res = await fetch('http://localhost:2999/login', {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({username, password})
        })

        if (res.ok) {
            const result = await res.json();
            if (result.success) {
                console.log(`Your token is: ${result.token}`);
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
        document.getElementById('errorMessage').textContent('An error occured during login');
    }

};
