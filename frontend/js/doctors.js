document.addEventListener('DOMContentLoaded', async function() {
    const doctorsContainer = document.getElementById('doctorsContainer');
    let username = document.getElementById('loginProfile').value;
    let token = getCookie('myToken');
    let isLoggedIn = false;
    let res, result;
    const loginProfile = document.getElementById('loginProfile');
    const dropdownContent = document.querySelector('.dropdownContent');

    try {
        res = await fetch('/get-doctors-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (res.ok) {
            const doctors = await res.json();

            doctors.data.forEach(doctor => {
                const doctorDiv = document.createElement('div');
                const doctorImage = document.createElement('img');
                const doctorInfo = document.createElement('div');
                const doctorName = document.createElement('h2');
                const doctorSpecialization = document.createElement('p');
                const doctorExperience = document.createElement('p');
                const doctorDescription = document.createElement('p');

                doctorImage.src = `../pictures/${doctor.url}`;
                doctorName.textContent = doctor.name;
                doctorSpecialization.textContent = `Specialization: ${doctor.specialization}`;
                doctorExperience.textContent = `Experience: ${doctor.experience} years`;
                doctorDescription.textContent = doctor.description ? doctor.description : '-';

                doctorDiv.classList.add('doctor-box');
                doctorImage.classList.add('doctor-image');
                doctorInfo.classList.add('doctor-info');

                doctorInfo.appendChild(doctorName);
                doctorInfo.appendChild(doctorSpecialization);
                doctorInfo.appendChild(doctorExperience);
                doctorInfo.appendChild(doctorDescription);

                doctorDiv.appendChild(doctorImage);
                doctorDiv.appendChild(doctorInfo);

                doctorsContainer.appendChild(doctorDiv);
            });
        } else {
            console.error("There was an error retrieving the doctors: ");
        }
    } catch (err) {
        console.error("There was an error retrieving the doctors: ", err);
        //window.location.replace('/home');
    }

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
            console.error('An error occurred during redirecting: ', err.message);
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
});

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
