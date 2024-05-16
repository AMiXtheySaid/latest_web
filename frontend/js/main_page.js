var isLoggedIn;
var username;

document.addEventListener('DOMContentLoaded', async function() {
    var token = getCookie('myToken');
    const loginProfile = document.getElementById('loginProfile');
    const expandedLoginProfile = document.getElementById('expandedLoginProfile');
    
    if (token !== null) {
        try {
        const res = await fetch('/home', {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({token})
        })

        if (res.ok) {
            const result = await res.json();

            if (result.success) {
                isLoggedIn = true;
                username = result.data;
            } else {
                isLoggedIn = false;
                deleteCookie(token);
                window.location.replace('/forbidden');            
            }
        } else {
            console.error('An error occurred during redirecting: ', err);
        }
        } catch (err) {
            console.error('An error occured during redirecting: ', err);
        }
    }
    
    // what does the button display
    if (!isLoggedIn) {
        loginProfile.textContent = 'Login';
        expandedLoginProfile.style.display = 'none';
    } else {
        loginProfile.textContent = username;
        expandedLoginProfile.style.display = 'block';
    }

    loginProfile.onclick = function() {
        if (!isLoggedIn) {
            window.location.replace('/login');
        } else {
            if (expandedLoginProfile.style.display === 'none') {
                expandedLoginProfile.style.display = 'block';
            } else {
                expandedLoginProfile.style.display = 'none';
            }
        }
    }

    //on load properties
    expandedLoginProfile.style.display = 'none';
})

document.getElementById('contact').onclick = async function() {
    window.location.replace('/contact');
}

document.getElementById('aboutUs').onclick = async function() {
    window.location.replace('/about-us');
}

document.getElementById('logOut').onclick = function() {
    deleteCookie('myToken');
    window.location.replace('/home');
}

document.getElementById('changePassword').onclick = function() {
    window.location.replace('/change-password');
}

document.getElementById('deleteAccount').onclick = function() {
    window.location.replace('/delete-account');
}
