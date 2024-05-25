async function getDoctors(service) {
    try {
        const res = await fetch('/appointments', {
            method: "POST",
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
        const res = await fetch('/appointments', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ doctor })
        });

        if (res.ok) {
            const result = await res.json();
            const serviceDropdown = document.getElementById('serviceBox');
            doctorDropdown.innerHTML = '<option value="" disabled selected>Select the doctor</option>';

            result.forEach(service => {
                const option = document.createElement('option');

                option.value = `${service}`;
                option.text = `${service}`;

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
    await getDoctors(null);
    await getServices(null);

    // checking for doctors and services
    doctorBox.addEventListener('change', async function() {
        if (doctorBox.value) {
            await getServices(doctorBox.value);
        }
    });

    serviceBox.addEventListener('change', async function() {
        if (serviceBox.value) {
            await getDoctors(serviceBox.value);
        }
    });

})

document.getElementById('getAnAppointment').onclick = async function() {
    var need = false;
    try {
        const res = await fetch('/doctors', {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
        })

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
        need = true;
        console.log('An error occurred while retrieving the doctors ', err);
    }

    if (need) {
        alert('no')
    }
}
