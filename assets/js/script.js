// Grab elements
const planningTypeInputs = document.querySelectorAll('input[name="planningType"]');
const activitiesSection = document.getElementById('activitiesSection');
const agentSection = document.getElementById('agentSection');
const agentCardsContainer = document.getElementById('agentCards');
const bookAgentBtn = document.getElementById('bookAgentBtn');
const tripForm = document.getElementById('tripForm');
const confirmationCard = document.getElementById('confirmationCard');
const cancelBtn = document.getElementById('cancelBtn');

let selectedAgent = null;

// Sample agent data
const agents = [
  { name: "Rahul Sharma", rating: 4.8, experience: "5 Years", status: "Available", fee: "₹2500", contact: "9876543210" },
  { name: "Priya Verma", rating: 4.9, experience: "8 Years", status: "Busy", fee: "₹3500", contact: "9876543211" },
  { name: "Amit Singh", rating: 4.7, experience: "6 Years", status: "Available", fee: "₹3000", contact: "9876543212" }
];

// Toggle sections when planning type changes
planningTypeInputs.forEach(input => {
  input.addEventListener('change', () => {
    if (input.value === 'self') {
      // Show activities, hide agents
      activitiesSection.classList.remove('hidden');
      agentSection.classList.add('hidden');
    }
    if (input.value === 'agent') {
      // Show agents, hide activities
      activitiesSection.classList.add('hidden');
      agentSection.classList.remove('hidden');
      renderAgents();
    }
    // Reset state
    confirmationCard.classList.add('hidden');
    cancelBtn.classList.add('hidden');
    selectedAgent = null;
  });
});

// Render agent cards
function renderAgents() {
  agentCardsContainer.innerHTML = '';
  agents.forEach(agent => {
    const card = document.createElement('div');
    card.classList.add('agent-card');
    card.innerHTML = `
      <h4>${agent.name}</h4>
      <p>⭐ Rating: ${agent.rating}</p>
      <p>Experience: ${agent.experience}</p>
      <p>Status: ${agent.status}</p>
      <p>Fee: ${agent.fee}</p>
      <button class="btn ${agent.status === "Available" ? "available-btn" : "unavailable-btn"}"
        ${agent.status !== "Available" ? "disabled" : ""}>
        ${agent.status === "Available" ? "Select Agent" : "Not Available"}
      </button>
    `;
    const selectBtn = card.querySelector('button');
    selectBtn.addEventListener('click', () => {
      if (agent.status === "Available") {
        selectedAgent = agent;
        alert(`${agent.name} selected!`);
      }
    });
    agentCardsContainer.appendChild(card);
  });
}

// Book Agent for "Plan Yourself"
bookAgentBtn.addEventListener('click', () => {
  selectedAgent = agents.find(agent => agent.status === "Available");
  if (selectedAgent) {
    alert(`${selectedAgent.name} assigned as your agent!`);
  } else {
    alert("No agents available at the moment.");
  }
});

// Handle form submission
tripForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const destination = document.getElementById('destination').value.trim();
  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;
  const planningType = document.querySelector('input[name="planningType"]:checked')?.value;

  if (!destination || !fromDate || !toDate || !planningType) {
    alert("Please fill all required fields.");
    return;
  }

  let bookingData = { destination, fromDate, toDate, planningType, activities: [], agent: null };

  if (planningType === 'self') {
    const selectedActivities = Array.from(activitiesSection.querySelectorAll('input[type="checkbox"]:checked'))
      .map(cb => cb.value);

    if (!selectedAgent) {
      alert("Please assign an agent by clicking 'Book Agent'.");
      return;
    }

    bookingData.activities = selectedActivities;
    bookingData.agent = selectedAgent;

    confirmationCard.innerHTML = `
      <h3>Booking Confirmed!</h3>
      <p><strong>Destination:</strong> ${destination}</p>
      <p><strong>From:</strong> ${fromDate}</p>
      <p><strong>To:</strong> ${toDate}</p>
      <p><strong>Activities:</strong> ${selectedActivities.join(", ") || "None"}</p>
      <p><strong>Agent:</strong> ${selectedAgent.name}</p>
      <p><strong>Contact:</strong> ${selectedAgent.contact}</p>
      <p><strong>Fee:</strong> ${selectedAgent.fee}</p>
      <p class="success">✅ Your agent will contact you soon!</p>
    `;
  }

  if (planningType === 'agent') {
    if (!selectedAgent) {
      alert("Please select an agent.");
      return;
    }

    bookingData.agent = selectedAgent;

    confirmationCard.innerHTML = `
      <h3>Booking Confirmed!</h3>
      <p><strong>Destination:</strong> ${destination}</p>
      <p><strong>From:</strong> ${fromDate}</p>
      <p><strong>To:</strong> ${toDate}</p>
      <p><strong>Agent:</strong> ${selectedAgent.name}</p>
      <p><strong>Contact:</strong> ${selectedAgent.contact}</p>
      <p><strong>Fee:</strong> ${selectedAgent.fee}</p>
      <p class="success">✅ Your agent will contact you within 24 hours!</p>
    `;
  }

  localStorage.setItem("tripBooking", JSON.stringify(bookingData));
  confirmationCard.classList.remove('hidden');
  cancelBtn.classList.remove('hidden');
});

// Cancel itinerary
cancelBtn.addEventListener('click', () => {
  localStorage.removeItem("tripBooking");
  confirmationCard.classList.add('hidden');
  cancelBtn.classList.add('hidden');
  tripForm.reset();
  activitiesSection.classList.add('hidden');
  agentSection.classList.add('hidden');
  selectedAgent = null;
  alert("Your itinerary has been cancelled.");
});

// Load previous booking
window.addEventListener("DOMContentLoaded", () => {
  const savedBooking = localStorage.getItem("tripBooking");
  if (savedBooking) {
    const booking = JSON.parse(savedBooking);
    confirmationCard.innerHTML = `
      <h3>Previous Booking Found</h3>
      <p><strong>Destination:</strong> ${booking.destination}</p>
      <p><strong>From:</strong> ${booking.fromDate}</p>
      <p><strong>To:</strong> ${booking.toDate}</p>
      ${booking.activities.length ? `<p><strong>Activities:</strong> ${booking.activities.join(", ")}</p>` : ""}
      ${booking.agent ? `
        <p><strong>Agent:</strong> ${booking.agent.name}</p>
        <p><strong>Contact:</strong> ${booking.agent.contact}</p>
        <p><strong>Fee:</strong> ${booking.agent.fee}</p>
      ` : ""}
      <p class="success">ℹ️ This booking was loaded from local storage.</p>
    `;
    confirmationCard.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
  }
});
