async function bookSlot() {

    const name = document.getElementById("name").value;
    const sport = document.getElementById("sport").value;
    const slot = document.getElementById("slot").value;

    const message = document.getElementById("message");

    if (!name || !sport || !slot) {
        message.innerText = "⚠️ Please fill all fields";
        return;
    }

    try {
        const res = await fetch("http://localhost:8080/api/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                sport: sport,
                slot: slot
            })
        });

        const data = await res.text();
        message.innerText = data;

    } catch (err) {
        message.innerText = "❌ Backend not reachable";
    }
}

async function loadBookings() {

    const list = document.getElementById("list");
    list.innerHTML = "";

    try {
        const res = await fetch("http://localhost:8080/api/bookings");
        const data = await res.json();

        data.forEach(b => {
            const li = document.createElement("li");
            li.innerText = `${b.name} - ${b.sport} - ${b.slot}`;
            list.appendChild(li);
        });

    } catch (err) {
        document.getElementById("message").innerText = "Error loading bookings";
    }
}
