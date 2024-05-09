document.addEventListener('DOMContentLoaded', async function() {
    var token = getCookie('myToken');
    const loginProfile = document.getElementById('loginProfile');
    const expandedLoginProfile = document.getElementById('expandedLoginProfile');
    var isLoggedIn;

    // verifici ca tokenu sa fie ce trebe
    
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
            } else {
                isLoggedIn = false;
                deleteCookie(token);
                window.location.replace('/forbidden');            
            }
        } else {
            console.error('An error occured during redirecting: ', err);
        }
        } catch (err) {
            console.error('An error occured during redirecting: ', err);
        }
    }
    
    if (!isLoggedIn) {
        loginProfile.textContent = 'Login';
        expandedLoginProfile.style.display = 'none';
    } else {
        loginProfile.textContent = 'Profile';
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

document.getElementById('logOut').onclick = async function() {
    deleteCookie('myToken');
    window.location.replace('/home');
}

document.getElementById('changePassword').onclick = function() {
    window.location.replace('/change-password');
}
