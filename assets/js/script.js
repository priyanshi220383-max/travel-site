// ===== Agent Data =====
var agents = [
  { name: "Rahul Sharma", rating: "4.8 ★", exp: "5 Years",  fee: "₹2,500", contact: "+91 98765 43210", avail: true  },
  { name: "Priya Verma",  rating: "4.9 ★", exp: "8 Years",  fee: "₹3,500", contact: "+91 98765 43211", avail: false },
  { name: "Amit Singh",   rating: "4.7 ★", exp: "6 Years",  fee: "₹3,000", contact: "+91 98765 43212", avail: true  },
  { name: "Sneha Iyer",   rating: "4.6 ★", exp: "4 Years",  fee: "₹2,200", contact: "+91 98765 43213", avail: true  },
  { name: "Karan Mehta",  rating: "4.9 ★", exp: "10 Years", fee: "₹4,000", contact: "+91 98765 43214", avail: false },
  { name: "Aditya Rawat", rating: "5.0 ★", exp: "10 Years", fee: "₹3,800", contact: "+91 98765 43215", avail: true  }
  // Note: Aditya Rawat's contact number was a duplicate of Karan Mehta's in the original file — fixed above.
];

// ===== Selected Agent Variable =====
var selectedAgent = null;

// ===== Get Elements =====
var agentCards        = document.getElementById("agentCards");
var tripForm          = document.getElementById("tripForm");
var confirmationCard  = document.getElementById("confirmationCard");
var cancelBtn         = document.getElementById("cancelBtn");
var fromDateInput     = document.getElementById("fromDate");
var toDateInput       = document.getElementById("toDate");

// ===== Restrict To Date based on From Date =====
fromDateInput.addEventListener("change", function() {
  toDateInput.min = this.value;
  // If a to-date was already picked and is now before the from-date, clear it
  if (toDateInput.value && toDateInput.value < this.value) {
    toDateInput.value = "";
  }
});

// ===== Show Agent Cards =====
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

    if (ag.avail) {
      card.addEventListener("click", (function(agent, cardEl) {
        return function() {
          document.querySelectorAll(".agent-card").forEach(function(c) {
            c.classList.remove("selected");
          });
          cardEl.classList.add("selected");
          selectedAgent = agent;
        };
      })(ag, card));
    }

    agentCards.appendChild(card);
  }
}

// Show agent cards immediately since agent booking is now the only flow
showAgentCards();

// ===== Form Submit =====
tripForm.addEventListener("submit", function(e) {
  e.preventDefault();

  var destination = document.getElementById("destination").value.trim();
  var email       = document.getElementById("email").value.trim();
  var fromDate    = fromDateInput.value;
  var toDate      = toDateInput.value;

  if (!destination) { alert("Please enter a destination."); return; }
  if (!email)        { alert("Please enter your email."); return; }
  if (!fromDate)     { alert("Please select a from date."); return; }
  if (!toDate)       { alert("Please select a to date."); return; }
  if (!selectedAgent) { alert("Please select an agent."); return; }

  confirmationCard.innerHTML =
    "<h3>✅ Booking Confirmed!</h3>" +
    "<p>Destination: <span>" + destination + "</span></p>" +
    "<p>Email: <span>" + email + "</span></p>" +
    "<p>From: <span>" + fromDate + "</span></p>" +
    "<p>To: <span>" + toDate + "</span></p>" +
    "<hr style='border-color:rgba(255,255,255,0.15); margin:12px 0'>" +
    "<p>Agent Name: <span>" + selectedAgent.name + "</span></p>" +
    "<p>Contact: <span>" + selectedAgent.contact + "</span></p>" +
    "<p>Fee: <span>" + selectedAgent.fee + "</span></p>" +
    "<div class='alert-msg'>📞 " + selectedAgent.name + " will call you within 24 hours to finalise your itinerary.</div>";

  confirmationCard.classList.remove("hidden");
  cancelBtn.classList.remove("hidden");
  confirmationCard.scrollIntoView({ behavior: "smooth" });

  var bookingData = {
    destination: destination,
    email: email,
    fromDate: fromDate,
    toDate: toDate,
    agent: selectedAgent,
    bookingTime: new Date().toLocaleString(),
    status: "Pending"
  };

  console.log("===== NEW TRIP BOOKING =====");
  console.log(bookingData);

  localStorage.setItem("tripBooking", JSON.stringify(bookingData));

  // Send booking data to backend
  // Note: this only works if your backend server is running locally on port 5000.
  // If it isn't running, the .catch() below will log a connection error — that's expected.
  fetch("http://localhost:5000/api/trip-booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bookingData)
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error("Server responded with status " + response.status);
    }
    return response.json();
  })
  .then(function(data) {
    console.log("Response from Backend:");
    console.log(data);
  })
  .catch(function(error) {
    console.error("Error connecting to backend:", error);
  });
});

// ===== Cancel Button =====
cancelBtn.addEventListener("click", function() {
  localStorage.removeItem("tripBooking");
  confirmationCard.classList.add("hidden");
  cancelBtn.classList.add("hidden");
  tripForm.reset();
  toDateInput.min = "";
  selectedAgent = null;
  document.querySelectorAll(".agent-card").forEach(function(c) {
    c.classList.remove("selected");
  });
  alert("Your itinerary has been cancelled.");
});

// ===== Load Previous Booking =====
window.addEventListener("DOMContentLoaded", function() {
  var saved = localStorage.getItem("tripBooking");
  if (saved) {
    var b = JSON.parse(saved);
    confirmationCard.innerHTML =
      `<h3>🔖 Previous Booking Found</h3><p>Destination: <span>${b.destination}</span></p><p>Email: <span>${b.email}</span></p><p>From: <span>${b.fromDate}</span></p><p>To: <span>${b.toDate}</span></p>${b.agent ? "<p>Agent: <span>" + b.agent.name + " — " + b.agent.contact + "</span></p>" : ""}<div class='alert-msg'>ℹ️ This booking was loaded from your last session.</div>`;
    confirmationCard.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
  }
});

// ===== Package Modal Data =====
var packages = {
  nainital: {
    title: "Nainital Lake Tour",
    price: "Starting From ₹6,999",
    image: "https://pix10.agoda.net/hotelImages/10885034/-1/473d903cb9d4bf6529563bddc471bee3.jpg?ce=0&s=414x232",
    description: "Explore the beautiful lake city of Nainital with boating, scenic viewpoints, shopping and relaxing mountain experiences.",
    features: [["3 Days","Weekend Escape"],["Hotel","3★ Stay"],["Meals","Breakfast Included"],["Lake Tour","Top Attractions"]],
    includes: ["Boating at Naini Lake","Visit Snow View Point","Explore Mall Road","Hotel Accommodation","Breakfast Included"]
  },
  mussoorie: {
    title: "Mussoorie Hill Escape",
    price: "Starting From ₹7,999",
    image: "https://images.onthegotours.com/atv1-ce6c88da-8005-4b13-980e-6a21d140edb5.jpg",
    description: "Experience the Queen of Hills with waterfalls, viewpoints, cafés and beautiful Himalayan scenery.",
    features: [["4 Days","Hill Getaway"],["Hotel","4★ Stay"],["Meals","Breakfast & Dinner"],["Sightseeing","Major Attractions"]],
    includes: ["Kempty Falls Visit","Lal Tibba","Gun Hill Ropeway","Mall Road Walk","Hotel Stay"]
  },
  rishikesh: {
    title: "Rishikesh Adventure Tour",
    price: "Starting From ₹5,999",
    image: "https://content3.jdmagicbox.com/comp/rishikesh/s3/9999px135.x135.190314080552.j1s3/catalogue/rishikesh-adventures-hub-munikireti-rishikesh-river-rafting-organisers-pb2wxv35s9.jpg",
    description: "Adventure-packed tour featuring rafting, bungee jumping, Ganga Aarti and riverside experiences.",
    features: [["3 Days","Adventure Trip"],["Hotel","3★ Stay"],["Meals","Included"],["Rafting","Adventure Sports"]],
    includes: ["River Rafting","Ganga Aarti","Laxman Jhula","Adventure Activities","Hotel Stay"]
  },
  auli: {
    title: "Auli Snow Adventure",
    price: "Starting From ₹12,999",
    image: "https://s3.india.com/wp-content/uploads/2024/08/Auli-Uttarakhand_-Your-Next-Adventure-Awaits-In-The-Garhwal-Himalayas.jpg",
    description: "Enjoy snow-covered mountains, skiing adventures and breathtaking Himalayan views.",
    features: [["5 Days","Snow Adventure"],["Resort","Mountain Stay"],["Meals","Included"],["Skiing","Premium Experience"]],
    includes: ["Skiing Session","Ropeway Ride","Snow Activities","Hotel Stay","Local Sightseeing"]
  },
  "jim-corbett": {
    title: "Jim Corbett Safari",
    price: "Starting From ₹8,499",
    image: "https://corbettgov.org/assets/images/jungle-safari-in-jim-corbett-national-park-1200x900.webp",
    description: "Wildlife adventure featuring jungle safari, nature trails and tiger reserve exploration.",
    features: [["3 Days","Wildlife Tour"],["Resort","Jungle Stay"],["Meals","Included"],["Safari","Guided Tour"]],
    includes: ["Jungle Safari","Nature Walk","Wildlife Spotting","Resort Stay","Breakfast Included"]
  },
  chopta: {
    title: "Chopta Tungnath Trek",
    price: "Starting From ₹7,499",
    image: "https://choptatourpackage.com/wp-content/uploads/2025/10/DALL%C2%B7E-2024-10-03-16.57.38-A-serene-night-sky-over-Chopta-with-bright-stars-scattered-across-the-sky-unobstructed-by-city-lights.-The-landscape-below-features-lush-green-meado.webp",
    description: "Trek through beautiful meadows and visit Tungnath, the world's highest Shiva temple.",
    features: [["4 Days","Trekking Tour"],["Camp","Mountain Stay"],["Meals","Included"],["Trek","Guided"]],
    includes: ["Tungnath Trek","Chandrashila Visit","Campsite Stay","Guide Support","Meals Included"]
  },
  kedarnath: {
    title: "Kedarnath Yatra Package",
    price: "Starting From ₹10,999",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2H9FMfsE8zhzO8sVXoXINfimWw_Bv0JGCvQ&s",
    description: "Spiritual journey to the sacred Kedarnath Temple amidst majestic Himalayan landscapes.",
    features: [["5 Days","Pilgrimage"],["Hotel","Stay Included"],["Meals","Included"],["Temple","VIP Darshan"]],
    includes: ["Kedarnath Darshan","Accommodation","Transfers","Meals","Travel Assistance"]
  },
  badrinath: {
    title: "Badrinath Spiritual Tour",
    price: "Starting From ₹10,499",
    image: "https://imgcld.yatra.com/ytimages/image/upload/v1438772700/Badrinath_48.jpg",
    description: "Visit one of India's holiest pilgrimage destinations surrounded by stunning Himalayan beauty.",
    features: [["5 Days","Spiritual Tour"],["Hotel","Stay Included"],["Meals","Included"],["Darshan","Temple Visit"]],
    includes: ["Badrinath Darshan","Mana Village Visit","Accommodation","Meals","Sightseeing"]
  }
};

// ===== Modal Open =====
function openModal(packageName) {
  var p = packages[packageName];
  if (!p) return;

  document.getElementById("modalImg").src = p.image;
  document.getElementById("modalTitle").innerText = p.title;
  document.getElementById("modalPrice").innerText = p.price;
  document.getElementById("modalDescription").innerText = p.description;

  var featureHTML = "";
  p.features.forEach(function(item) {
    featureHTML += "<div class='feature-box'><h4>" + item[0] + "</h4><p>" + item[1] + "</p></div>";
  });
  document.getElementById("modalFeatures").innerHTML = featureHTML;

  var includesHTML = "";
  p.includes.forEach(function(item) {
    includesHTML += "<li>" + item + "</li>";
  });
  document.getElementById("modalIncludes").innerHTML = includesHTML;

  document.getElementById("packageModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

// ===== Modal Close =====
function closeModal() {
  document.getElementById("packageModal").style.display = "none";
  document.body.style.overflow = "";
}

// Close on backdrop click
window.onclick = function(event) {
  var modal = document.getElementById("packageModal");
  if (event.target === modal) { closeModal(); }
};

// Close on Escape key
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") { closeModal(); }
});