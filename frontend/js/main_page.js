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
    let token = getCookie('myToken');
    const loginProfile = document.getElementById('loginProfile');
    const expandedLoginProfile = document.getElementById('expandedLoginProfile');

    let isLoggedIn
    if (token !== null) {
        isLoggedIn = 1;
    } else {
        isLoggedIn = 0;
    }

    // continua
    if (isLoggedIn === 0) {
        loginProfile.textContent = 'Login';
        expandedLoginProfile.style.display = 'none';
    } else {
        loginProfile.textContent = 'Profile';
        expandedLoginProfile.style.display = 'block';
    }

    loginProfile.onclick = function() {
        if (isLoggedIn === 0) {
            window.location.replace('/login');
        } else {
            if (expandedLoginProfile.style.display === 'none') {
                expandedLoginProfile.style.display = 'block';
            } else {
                expandedLoginProfile.style.display = 'none';
            }
        }
    }

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
