async function getDoctors(service) {
    try {
        const res = await fetch('/doctors', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ service })
        });

        if (res.ok) {
            const result = await res.json();
            const doctorDropdown = document.getElementById('doctorBox');
            doctorDropdown.innerHTML = '<option value="" disabled selected>Select the doctor</option>';

            result.forEach(doctor => {
                const option = document.createElement('option');

                option.value = `${doctor}`;
                option.text = `${doctor}`;

                doctorDropdown.appendChild(option);
            })
        } else {
            console.error('An error occurred while retrieving the doctors');
        }
    } catch (err) {
        console.error('An error occurred while retrieving the doctors ', err);
    }
}

async function getServices(doctor) {
    try {
        const res = await fetch('/services', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ doctor })
        });

        if (res.ok) {
            const result = await res.json();
            const serviceBox = document.getElementById('doctorBox');
            serviceBox.innerHTML = '<option value="" disabled selected>Select a service</option>';

            result.forEach(doctor => {
                const option = document.createElement('option');

                option.value = `${doctor}`;
                option.text = `${doctor}`;

                doctorDropdown.appendChild(option);
            })
        } else {
            console.error('An error occurred while retrieving the doctors');
        }
    } catch (err) {
        console.error('An error occurred while retrieving the doctors ', err);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const doctorBox = document.getElementById('doctorBox');
    const serviceBox = document.getElementById('serviceBox');

    // on load
    try {
        const res = await fetch('/appointments-data', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
    
        if (res.ok) {
            const result = await res.json();
            doctorBox.innerHTML = '<option value="" disabled selected>Select a doctor</option>';
            serviceBox.innerHTML = '<option value="" disabled selected>Select a problem</option>';

            let option;
            result.returnedDoctors.forEach(doctor => {
                option = document.createElement('option');

                option.value = `${doctor.name}`;
                option.text = `${doctor.name}`;

                doctorBox.appendChild(option);
            });

            result.returnedServices.forEach(service => {
                option = document.createElement('option');
                
                option.value = `${service.name}`;
                option.text = `${service.name}`;

                serviceBox.appendChild(option);
            });
        } else {
            console.error("An error occured retrieving data");
        }
    } catch (err) {
        console.error("An error occured retrieving data: ", err);
    }
    
})

document.getElementById('getAnAppointment').onclick = async function() {
    const doctorBox = document.getElementById('doctorBox').value;
    const serviceBox = document.getElementById('serviceBox').value;
    const dateBox = document.getElementById('dateBox').value;
    const token = getCookie('myToken');

    try {
        const res = await fetch('/get-an-appointment', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : token,
                'Doctor' : doctorBox,
                'Service' : serviceBox,
                'Thedate' : dateBox,
            },
        });

        if (res.ok) {
            const result = await res.json();

            if (result.success) {
                window.location.replace('/home');
            } else {
                getServices(doctorBox);                
            }
        } else {
            console.error("An error occured during the doctor availability check up: ", err);
        }
    } catch (err) {
        console.error("An error occured during the doctor availability check up: ", err);
        window.location.replace('/appointments');
    }
}
