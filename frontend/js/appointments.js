document.addEventListener('DOMContentLoaded', async function() {

})

document.getElementById('getDoctors').onclick = async function() {
    const selectedService = document.getElementById('serviceBox').value;
    
    if (selectedService !== null) {
        try {
            const res = await fetch('/doctors', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({selectedService})
            });

            if (res.ok) {
                const result = await res.json();

                const doctorBox = document.getElementById('doctorBox');

                response.array.forEach(element => {
                    const optionElement = document.createElement('option');

                    optionElement.value = element.name;
                    optionElement.textContent = element.name;

                    doctorBox.appendChild(optionElement);
                });
            } else {
                console.error('An error occured during displaying the services');
            }
        } catch (err) {
            console.error('An error occured during displaying the sevices: ' + err);
        }
    } else {
        const errorText = document.getElementById('errorText');

        errorText.textContent = 'Please select a service in order to check the specialized doctors';
    }
    
}

document.getElementById('getServices').onclick = async function() {
    const selectedDoctor = document.getElementById('doctorBox').value;
    
    if (selectedDoctor !== null) {
        try {
            const res = await fetch('/services', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({selectedDoctor})
            });

            if (res.ok) {
                const result = await res.json();

                const serviceBox = document.getElementById('doctorBox');

                response.array.forEach(element => {
                    const optionElement = document.createElement('option');

                    optionElement.value = element.name;
                    optionElement.textContent = element.name;

                    serviceBox.appendChild(optionElement);
                });
            } else {
                console.error('An error occured during displaying the services');
            }
        } catch (err) {
            console.error('An error occured during displaying the sevices: ' + err);
        }
    } else {
        const errorText = document.getElementById('errorText');

        errorText.textContent = 'Please select a doctor to see their services';
    }
    
}

document.getElementById('getAppointment').onclick = async function() {

}
