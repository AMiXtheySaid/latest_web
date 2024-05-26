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
    
}
