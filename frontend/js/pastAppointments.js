document.addEventListener('DOMContentLoaded', async function() {
    const token = getCookie('myToken');
    try {
        const res = await fetch('/get-past-appointments', {
            method: "GET",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : token
            }
        });

        if (res.ok) {
            const pastAppointments = await res.json();

            pastAppointments.data.forEach(appointment => {
                const appointmentDiv = document.createElement('div');
                const appointmentInfo = document.createElement('div');
                const appointmentDate = document.createElement('p');
                const appointmentId = document.createElement('p');

                const formattedDate = new Date(appointment.date).toLocaleDateString();
                appointmentDate.textContent = `Date: ${formattedDate}`;
                appointmentId.textContent = `Appointment ID: ${appointment.id}`;

                appointmentDiv.classList.add('appointment-box');
                appointmentInfo.classList.add('appointment-info');

                const appointmentDateObj = new Date(appointment.date);
                const currentDate = new Date();

                if (appointmentDateObj < currentDate) {
                    appointmentDiv.style.backgroundColor = 'red';
                } else {
                    appointmentDiv.style.backgroundColor = 'green';
                }

                appointmentInfo.appendChild(appointmentDate);
                appointmentInfo.appendChild(appointmentId);
                appointmentDiv.appendChild(appointmentInfo);

                document.getElementById('pastAppointmentsContainer').appendChild(appointmentDiv);
            });
        } else {
            console.error("Failed to retrieve past appointments");
        }
    } catch (err) {
        console.error("Error retrieving past appointments:", err);
    }
});
