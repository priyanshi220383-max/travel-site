// ===== Agent Data =====
var agents = [
  { name: "Rahul Sharma", rating: "4.8 ★", exp: "5 Years", fee: "₹2,500", contact: "+91 98765 43210", avail: true },
  { name: "Priya Verma",  rating: "4.9 ★", exp: "8 Years", fee: "₹3,500", contact: "+91 98765 43211", avail: false },
  { name: "Amit Singh",   rating: "4.7 ★", exp: "6 Years", fee: "₹3,000", contact: "+91 98765 43212", avail: true },
  { name: "Sneha Iyer",   rating: "4.6 ★", exp: "4 Years", fee: "₹2,200", contact: "+91 98765 43213", avail: true },
  { name: "Karan Mehta",  rating: "4.9 ★", exp: "10 Years",fee: "₹4,000", contact: "+91 98765 43214", avail: false }
];

// ===== Selected Agent Variable =====
var selectedAgent = null;

// ===== Get Elements =====
var activitiesSection = document.getElementById("activitiesSection");
var agentSection      = document.getElementById("agentSection");
var agentCards        = document.getElementById("agentCards");
var tripForm          = document.getElementById("tripForm");
var confirmationCard  = document.getElementById("confirmationCard");
var cancelBtn         = document.getElementById("cancelBtn");

// ===== Radio Button Change =====
var radios = document.querySelectorAll('input[name="planType"]');

radios.forEach(function(radio) {
  radio.addEventListener("change", function() {

    // Hide both sections first
    activitiesSection.classList.add("hidden");
    agentSection.classList.add("hidden");

    // Reset confirmation
    confirmationCard.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    selectedAgent = null;

    // Show the right section
    if (this.value === "self") {
      activitiesSection.classList.remove("hidden");
    }

    if (this.value === "agent") {
      agentSection.classList.remove("hidden");
      showAgentCards();
    }

  });
});

// ===== Show Agent Cards Function =====
function showAgentCards() {
  agentCards.innerHTML = "";

  for (var i = 0; i < agents.length; i++) {
    var ag = agents[i];

    var card = document.createElement("div");
    card.className = "agent-card" + (ag.avail ? "" : " busy");

    card.innerHTML =
      "<span class='badge " + (ag.avail ? "badge-available" : "badge-busy") + "'>" +
        (ag.avail ? "AVAILABLE" : "BUSY") +
      "</span>" +
      "<h4>" + ag.name + "</h4>" +
      "<p>" + ag.rating + "</p>" +
      "<p>" + ag.exp + " experience</p>" +
      "<p class='fee'>" + ag.fee + "</p>";

    // Only allow click if agent is available
    if (ag.avail) {
      card.addEventListener("click", (function(agent, cardEl) {
        return function() {
          // Remove selected from all cards
          var allCards = document.querySelectorAll(".agent-card");
          allCards.forEach(function(c) { c.classList.remove("selected"); });

          // Select this card
          cardEl.classList.add("selected");
          selectedAgent = agent;
        };
      })(ag, card));
    }

    agentCards.appendChild(card);
  }
}

// ===== Form Submit =====
tripForm.addEventListener("submit", function(e) {
  e.preventDefault();

  // Get form values
  var destination = document.getElementById("destination").value.trim();
  var email       = document.getElementById("email").value.trim();
  var fromDate    = document.getElementById("fromDate").value;
  var toDate      = document.getElementById("toDate").value;
  var planType    = document.querySelector('input[name="planType"]:checked');

  // Simple validation
  if (destination === "") {
    alert("Please enter a destination.");
    return;
  }
  if (email === "") {
    alert("Please enter your email.");
    return;
  }
  if (fromDate === "") {
    alert("Please select a from date.");
    return;
  }
  if (toDate === "") {
    alert("Please select a to date.");
    return;
  }
  if (planType === null) {
    alert("Please select a planning type.");
    return;
  }

  // If agent plan — must select agent
  if (planType.value === "agent" && selectedAgent === null) {
    alert("Please select an agent.");
    return;
  }

  // If self plan — auto assign first available agent
  if (planType.value === "self") {
    for (var i = 0; i < agents.length; i++) {
      if (agents[i].avail) {
        selectedAgent = agents[i];
        break;
      }
    }
  }

  // Get selected activities
  var checkboxes = document.querySelectorAll("#activitiesSection input[type='checkbox']:checked");
  var activities = [];
  checkboxes.forEach(function(cb) {
    activities.push(cb.value);
  });

  // Build confirmation card HTML
  var activitiesText = activities.length > 0 ? activities.join(", ") : "None selected";

  confirmationCard.innerHTML =
    "<h3>✅ Booking Confirmed!</h3>" +

    "<p>Destination: <span>" + destination + "</span></p>" +
    "<p>Email: <span>" + email + "</span></p>" +
    "<p>From: <span>" + fromDate + "</span></p>" +
    "<p>To: <span>" + toDate + "</span></p>" +
    "<p>Plan Type: <span>" + (planType.value === "self" ? "Plan Yourself" : "Through Agent") + "</span></p>" +

    (planType.value === "self" ?
      "<p>Activities: <span>" + activitiesText + "</span></p>" : "") +

    "<hr style='border-color:rgba(255,255,255,0.15); margin:12px 0'>" +

    "<p>Agent Name: <span>" + selectedAgent.name + "</span></p>" +
    "<p>Contact: <span>" + selectedAgent.contact + "</span></p>" +
    "<p>Fee: <span>" + selectedAgent.fee + "</span></p>" +

    "<div class='alert-msg'>📞 " + selectedAgent.name + " will call you within 24 hours to finalise your itinerary.</div>";

  // Show confirmation and cancel button
  confirmationCard.classList.remove("hidden");
  cancelBtn.classList.remove("hidden");

  // Scroll down to show it
  confirmationCard.scrollIntoView({ behavior: "smooth" });

  // Save to localStorage
  localStorage.setItem("tripBooking", JSON.stringify({
    destination: destination,
    email: email,
    fromDate: fromDate,
    toDate: toDate,
    activities: activities,
    agent: selectedAgent
  }));

});

// ===== Cancel Button =====
cancelBtn.addEventListener("click", function() {
  // Clear localStorage
  localStorage.removeItem("tripBooking");

  // Hide confirmation and cancel button
  confirmationCard.classList.add("hidden");
  cancelBtn.classList.add("hidden");

  // Reset the form
  tripForm.reset();

  // Hide activity and agent sections
  activitiesSection.classList.add("hidden");
  agentSection.classList.add("hidden");

  // Reset selected agent
  selectedAgent = null;

  alert("Your itinerary has been cancelled.");
});

// ===== Load Previous Booking on Page Load =====
window.addEventListener("DOMContentLoaded", function() {
  var saved = localStorage.getItem("tripBooking");

  if (saved) {
    var b = JSON.parse(saved);

    confirmationCard.innerHTML =
      "<h3>🔖 Previous Booking Found</h3>" +
      "<p>Destination: <span>" + b.destination + "</span></p>" +
      "<p>Email: <span>" + b.email + "</span></p>" +
      "<p>From: <span>" + b.fromDate + "</span></p>" +
      "<p>To: <span>" + b.toDate + "</span></p>" +
      (b.activities.length > 0 ? "<p>Activities: <span>" + b.activities.join(", ") + "</span></p>" : "") +
      (b.agent ? "<p>Agent: <span>" + b.agent.name + " — " + b.agent.contact + "</span></p>" : "") +
      "<div class='alert-msg'>ℹ️ This booking was loaded from your last session.</div>";

    confirmationCard.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
  }
});