document.addEventListener('DOMContentLoaded', async function() {
    let username = document.getElementById('loginProfile').value;
    let token = getCookie('myToken');
    let isLoggedIn = false;
    let res, result;
    const loginProfile = document.getElementById('loginProfile');
    const dropdownContent = document.querySelector('.dropdownContent');
    
    if (token !== null) {
        try {
            res = await fetch('/home-validate-token', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if (res.ok) {
                result = await res.json();

                if (result.success) {
                    username = result.data;
                    isLoggedIn = true;
                } else {
                    isLoggedIn = false;
                    deleteCookie('myToken');
                    window.location.replace('/forbidden');            
                }
            } else {
                console.error('An error occurred during redirecting: ', res.statusText);
            }
        } catch (err) {
            deleteCookie('myToken');
            console.error('An error occurred during redirecting: ', err);
        }
    } 

    if (isLoggedIn) {
        loginProfile.innerText = username;
        loginProfile.addEventListener('mouseenter', function() {
            dropdownContent.style.display = 'block';
        });

        loginProfile.addEventListener('mouseleave', function() {
            dropdownContent.style.display = 'none';
        });

        dropdownContent.addEventListener('mouseenter', function() {
            dropdownContent.style.display = 'block';
        });

        dropdownContent.addEventListener('mouseleave', function() {
            dropdownContent.style.display = 'none';
        });

    } else {
        loginProfile.innerText = 'Login';
        loginProfile.onclick = function() {
            if (!isLoggedIn) {
                window.location.replace('/login');
            }
        };
    }
})

document.getElementById('contact').onclick = function() {
    window.location.replace('/contact');
}

document.getElementById('aboutUs').onclick = function() {
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

document.getElementById('makeAnAppointment').onclick = function() {
    window.location.replace('/appointments');
}

document.getElementById('homeBtn').onclick = function() {
    window.location.replace('/home');
}

