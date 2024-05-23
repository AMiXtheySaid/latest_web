document.addEventListener('DOMContentLoaded', async function() {
    try {
        const res = await fetch('/doctors', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({choice})
        });
    } catch {
        
    }
})