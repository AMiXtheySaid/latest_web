document.addEventListener('DOMContentLoaded', async function() {
    const servicesContainer = document.getElementById('servicesContainer');
    let username = document.getElementById('loginProfile').value;
    let token = getCookie('myToken');
    let isLoggedIn = false;
    let res, result;
    const loginProfile = document.getElementById('loginProfile');
    const dropdownContent = document.querySelector('.dropdownContent');

    try {
        res = await fetch('/get-services-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (res.ok) {
            const services = await res.json();

            services.data.forEach(service => {
                const serviceDiv = document.createElement('div');
                const serviceImage = document.createElement('img');
                const serviceInfo = document.createElement('div');
                const serviceName = document.createElement('h2');
                const serviceDuration = document.createElement('p');
                const servicePrice = document.createElement('p');
                const specializedDoctors = document.createElement('p');
                const doctorList = document.createElement('ul');

                serviceImage.src = `../pictures/${service.url}`;
                serviceName.textContent = service.name;
                serviceDuration.textContent = `Duration: ${service.duration}`;
                servicePrice.textContent = `Price: $${service.price}`;

                serviceDiv.classList.add('service-box');
                serviceImage.classList.add('service-image');
                serviceInfo.classList.add('service-info');
                doctorList.classList.add('doctor-list');

                const doctorArray = service.doctors.split(', ');
                specializedDoctors.textContent = 'Specialized Doctors: ';

                doctorArray.forEach(doctor => {
                    const doctorItem = document.createElement('li');
                    doctorItem.textContent = doctor;
                    doctorList.appendChild(doctorItem);
                });
                    
                serviceInfo.appendChild(serviceName);
                serviceInfo.appendChild(serviceDuration);
                serviceInfo.appendChild(servicePrice);
                serviceInfo.appendChild(specializedDoctors);
                serviceInfo.appendChild(doctorList);

                serviceDiv.appendChild(serviceImage);
                serviceDiv.appendChild(serviceInfo);

                servicesContainer.appendChild(serviceDiv);
            });
        } else {
            console.error("There was an error retrieving the services: ");
        }
    } catch (err) {
        console.error("There was an error retrieving the services: ", err);
        window.location.replace('/home');
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
