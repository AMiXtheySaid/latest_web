async function getDoctors(service) {
    try {
        const res = await fetch('/doctors', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ service })
        });

        if (res.ok) {
            const result = await res.json();
            const doctorDropdown = document.getElementById('doctorBox');

            result.forEach(person => {
                const option = document.createElement('option');

                option.value = `${person.surname} ${person.name}`;
                option.text = `${person.surname} ${person.name}`;

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
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ doctor })
        });

        if (res.ok) {
            const result = await res.json();
            const serviceDropdown = document.getElementById('serviceBox');

            result.forEach(service => {
                const option = document.createElement('option');

                option.value = `${service.name}`;
                option.text = `${service.name}`;

                serviceDropdown.appendChild(option);
            })
        } else {
            console.error('An error occurred while retrieving the services');
        }
    } catch (err) {
        console.error('An error occurred while retrieving the services ', err);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const doctorBox = document.getElementById('doctorBox');
    const serviceBox = document.getElementById('serviceBox');

    // on load
    doctorBox.value = 'Select a doctor';
    serviceBox.value = 'Select a service';

    // checking for doctors and services
    if (doctorBox.value === 'Select a doctor' && serviceBox.value === 'Select a service') {
        getDoctors(null);
        getServices(null);
    } else if (doctorBox.value !== 'Select a doctor') {
        getServices(doctorBox.value);
    } else if (serviceBox.value !== 'Select a service') {
        getServices(serviceBox.value);
    }
})

document.getElementById('getAppointment').onclick = async function() {

}
