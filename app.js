let mixChart = null;
let dashboardIncomeChart = null;
let opportunityMap = null;
let userLocationMarker = null;
let opportunityMarkers = [];
let lastNearbyPlaces = [];

const STEP_ORDER = [
  "stepIntro",
  "stepActivity",
  "stepMoney",
  "stepResults",
  "stepFocus",
  "stepPlan"
];

const STEP_NAMES = {
  stepIntro: "Start",
  stepActivity: "Your activity",
  stepMoney: "Your money",
  stepResults: "Your snapshot",
  stepFocus: "What to do next",
  stepPlan: "Your 30-day plan"
};

let currentStep = "stepIntro";
let pdfPageImages = [];
let pdfFilename = "";

// ---------------------------
// KEY NORMALIZATION
// ---------------------------
function normalizeKey(key) {
  return String(key || "")
    .toUpperCase()
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, "-")
    .replace(/[^A-Z0-9-]/g, "")
    .trim();
}

function looksLikeLemonLicenseKey(key) {
  const k = normalizeKey(key);
  const uuidHyphen = /^[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/;
  const uuidNoHyphen = /^[A-Z0-9]{32}$/;
  return uuidHyphen.test(k) || uuidNoHyphen.test(k);
}

function getStoredKey() {
  return normalizeKey(localStorage.getItem(STORAGE_KEY));
}

function storeKey(key) {
  localStorage.setItem(STORAGE_KEY, normalizeKey(key));
}

function clearStoredKey() {
  localStorage.removeItem(STORAGE_KEY);
}

// ---------------------------
// HELPERS
// ---------------------------
function formatGBP(value) {
  const rounded = Math.round(value);
  return "£" + rounded.toLocaleString("en-GB");
}

function clampNumber(n) {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function formatDate() {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("en-GB", { month: "long" });
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatDateTimeForSave(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function readInputs() {
  return {
    streams: clampNumber(Number(document.getElementById("streams").value)),
    shows: clampNumber(Number(document.getElementById("shows").value)),
    netPerShow: clampNumber(Number(document.getElementById("netPerShow").value)),
    dayRate: clampNumber(Number(document.getElementById("dayRate").value)),
    freelanceDays: clampNumber(Number(document.getElementById("freelanceDays").value)),
    target: clampNumber(Number(document.getElementById("target").value))
  };
}

function setInputs(values) {
  document.getElementById("streams").value = values.streams ?? 0;
  document.getElementById("shows").value = values.shows ?? 0;
  document.getElementById("netPerShow").value = values.netPerShow ?? 0;
  document.getElementById("dayRate").value = values.dayRate ?? 0;
  document.getElementById("freelanceDays").value = values.freelanceDays ?? 0;
  document.getElementById("target").value = values.target ?? 0;
  computeAndRender();
}

function getProfileLabel(code) {
  const labels = {
    FREELANCE: "Freelance-led",
    LIVE: "Live-led",
    STREAMING: "Audience-building",
    BALANCED: "Mixed income"
  };
  return labels[code] || "Mixed income";
}

function getInsightText(code) {
  const insightText = {
    FREELANCE:
      "Right now, freelance work is doing most of the heavy lifting for you. That gives you stability, which is useful — but it also means your income is tightly linked to your time and energy. The interesting part now is not just doing more freelance. It’s doing it more deliberately.",
    LIVE:
      "Live shows are currently your strongest source of income. That’s a good sign, but it also means your month can swing depending on bookings, costs, and whether the right gigs actually land. The real question now is whether each show is worth what it takes out of you.",
    STREAMING:
      "Streaming isn’t contributing much financially yet, which is normal. At this stage it’s often more useful as visibility, proof of movement, and something that supports the rest of your career. The key question is whether it’s opening doors — or just soaking up time.",
    BALANCED:
      "Your money is coming from a few different places, which gives you flexibility. The downside is that it can be easy to stay busy without creating much momentum. Nothing is fully broken — but nothing is really pulling away either."
  };

  return insightText[code];
}

function calculateState(input = readInputs()) {
  const streamingTypical = input.streams * assumptions.streamingPayout.typical;
  const liveTypical = input.shows * input.netPerShow;
  const freelanceTypical = input.dayRate * input.freelanceDays;

  const streamingLow = input.streams * assumptions.streamingPayout.low;
  const streamingHigh = input.streams * assumptions.streamingPayout.high;

  const totals = {
    low: streamingLow + liveTypical + freelanceTypical,
    typical: streamingTypical + liveTypical + freelanceTypical,
    high: streamingHigh + liveTypical + freelanceTypical
  };

  let percentages = { streaming: 0, live: 0, freelance: 0 };

  if (totals.typical > 0) {
    percentages.streaming = streamingTypical / totals.typical;
    percentages.live = liveTypical / totals.typical;
    percentages.freelance = freelanceTypical / totals.typical;
  }

  const freelanceDominant = percentages.freelance >= 0.6;
  const liveDominant = percentages.live >= 0.5;
  const streamingMarginal = percentages.streaming <= 0.15;

  let profileCode = "BALANCED";
  if (freelanceDominant) profileCode = "FREELANCE";
  else if (liveDominant) profileCode = "LIVE";
  else if (streamingMarginal) profileCode = "STREAMING";

  return {
    input,
    streamingTypical,
    liveTypical,
    freelanceTypical,
    totals,
    percentages,
    profileCode
  };
}

// ---------------------------
// STEP FLOW
// ---------------------------
function showStep(stepId) {
  currentStep = stepId;

  document.querySelectorAll(".stepPanel").forEach((step) => {
    step.classList.toggle("activeStep", step.id === stepId);
  });

  const progressWrap = document.querySelector(".progressWrap");

  if (stepId === "dashboardView") {
    if (progressWrap) progressWrap.style.display = "none";
  } else {
    if (progressWrap) progressWrap.style.display = "block";

    const stepIndex = STEP_ORDER.indexOf(stepId);
    const progressPercent = ((stepIndex + 1) / STEP_ORDER.length) * 100;

    document.getElementById("progressStepLabel").innerText =
      `Step ${stepIndex + 1} of ${STEP_ORDER.length}`;
    document.getElementById("progressStepName").innerText =
      STEP_NAMES[stepId] || "";
    document.getElementById("progressFill").style.width = `${progressPercent}%`;
  }

  if (stepId === "stepFocus") {
    setTimeout(() => {
      initOpportunityMap();
      renderMapIntroState();
      if (opportunityMap) opportunityMap.invalidateSize();
    }, 120);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------------------------
// CHART
// ---------------------------
function initOrUpdatePie(streamingPct, livePct, freelancePct) {
  const canvas = document.getElementById("mixChart");
  const ctx = canvas.getContext("2d");

  const css = getComputedStyle(document.documentElement);
  const cStreaming = css.getPropertyValue("--c-streaming").trim();
  const cLive = css.getPropertyValue("--c-live").trim();
  const cFreelance = css.getPropertyValue("--c-freelance").trim();

  const data = [
    Math.max(0, streamingPct),
    Math.max(0, livePct),
    Math.max(0, freelancePct)
  ];

  const allZero = data.every((v) => v === 0);
  const chartData = allZero ? [1] : data;
  const chartLabels = allZero ? ["No data"] : ["Streaming", "Live", "Freelance"];
  const chartColors = allZero
    ? ["rgba(20,20,20,0.10)"]
    : [cStreaming, cLive, cFreelance];

  if (!mixChart) {
    mixChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          backgroundColor: chartColors,
          borderColor: "rgba(255,255,255,0.95)",
          borderWidth: 2
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                if (allZero) return "Enter values to see allocation";
                return `${context.label}: ${(context.raw * 100).toFixed(0)}%`;
              }
            }
          }
        }
      }
    });
  } else {
    mixChart.data.labels = chartLabels;
    mixChart.data.datasets[0].data = chartData;
    mixChart.data.datasets[0].backgroundColor = chartColors;
    mixChart.update();
  }
}

// ---------------------------
// MAP + LOCATION
// ---------------------------
function initOpportunityMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  if (opportunityMap) return;

  opportunityMap = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([51.5074, -0.1278], 11);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 20
  }).addTo(opportunityMap);
}

function renderMapIntroState() {
  const list = document.getElementById("placesList");
  if (!list || list.dataset.hasResults === "true") return;

  list.innerHTML = `
    <div class="searchPrompt">
      <span class="promptLabel">London map</span>
      <div class="promptText">
        Enter a London postcode to see 5 nearby places that could help you create your next useful opportunity.
      </div>
    </div>
  `;
}

function createUserIcon() {
  return L.divIcon({
    className: "lumenMapMarker",
    html: `<div class="userMapDot"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

function createPlaceIcon() {
  return L.divIcon({
    className: "lumenMapMarker",
    html: `<div class="placeMapDot"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function clearOpportunityMarkers() {
  if (!opportunityMap) return;

  if (userLocationMarker) {
    opportunityMap.removeLayer(userLocationMarker);
    userLocationMarker = null;
  }

  opportunityMarkers.forEach((item) => opportunityMap.removeLayer(item.marker));
  opportunityMarkers = [];
}

function getPlaceStage(place) {
  const aspirationalNames = [
    "Eventim Apollo",
    "O2 Shepherd's Bush Empire",
    "KOKO Camden",
    "Roundhouse",
    "O2 Forum Kentish Town",
    "Royal Albert Hall",
    "Metropolis Studios",
    "Abbey Road Studios",
    "Ronnie Scott's",
    "Barbican Centre",
    "Southbank Centre",
    "Queen Elizabeth Hall"
  ];

  if (aspirationalNames.includes(place.name)) {
    return "Aspirational";
  }

  const type = String(place.type || "").toLowerCase();

  if (
    type.includes("large") ||
    type.includes("major") ||
    type.includes("iconic") ||
    type.includes("high-end")
  ) {
    return "Aspirational";
  }

  if (
    type.includes("grassroots") ||
    type.includes("community") ||
    type.includes("pub") ||
    type.includes("bar") ||
    type.includes("rehearsal") ||
    type.includes("workspace") ||
    type.includes("casual")
  ) {
    return "Realistic next step";
  }

  return "Useful reference point";
}

function getPlaceFitReason(place, profileCode) {
  const stage = getPlaceStage(place);

  if (profileCode === "LIVE") {
    if (stage === "Aspirational") {
      return "Useful as a long-term reference, but probably not the first room to target right now.";
    }

    return "Useful because your profile is live-led: this kind of place can help with stage time, promoters, local audiences or repeat bookings.";
  }

  if (profileCode === "FREELANCE") {
    if (place.type.toLowerCase().includes("studio")) {
      return "Useful because your income is freelance-led: studios and music hubs can lead to repeat work, referrals or useful production contacts.";
    }

    return "Useful because your income is freelance-led: this kind of space can help you find clients, collaborators or better-paid creative work.";
  }

  if (profileCode === "STREAMING") {
    return "Useful because your profile is audience-building: this kind of place can connect your releases to real listeners, communities or live moments.";
  }

  return "Useful because your income is mixed: this kind of place can help you choose one direction to explore more seriously.";
}

function getPlaceAction(place, profileCode) {
  const name = place.name;
  const type = String(place.type || "").toLowerCase();
  const stage = place.stage || getPlaceStage(place);

  if (stage === "Aspirational") {
    return `Do not treat ${name} as the next target. Use it as a reference: look at who plays there, who supports, and what the step before this might be.`;
  }

  if (profileCode === "LIVE") {
    if (type.includes("grassroots") || type.includes("community")) {
      return `Check whether ${name} has regular nights, open bills, or local promoters you could realistically approach.`;
    }

    if (type.includes("pub") || type.includes("bar")) {
      return `See if ${name} runs smaller live nights where a simple, well-written message could actually land.`;
    }

    if (type.includes("rehearsal") || type.includes("studio")) {
      return `Use ${name} to tighten the show itself: rehearse one part of the set that would make your next gig feel more serious.`;
    }

    return `Look at recent line-ups at ${name} and find one act slightly ahead of you. Their route is probably more useful than the venue name itself.`;
  }

  if (profileCode === "FREELANCE") {
    if (type.includes("studio") || type.includes("music hub")) {
      return `Look at who works out of ${name}. One useful engineer, producer, writer or manager is more valuable than a cold pitch to the venue.`;
    }

    if (type.includes("workspace") || type.includes("creative")) {
      return `Treat ${name} as a networking environment. Find one person or company connected to it that could realistically need your skills.`;
    }

    if (type.includes("bar") || type.includes("venue")) {
      return `Use ${name} as a soft connection point: events, regular nights, or people around the space may be more useful than the venue itself.`;
    }

    return `Research ${name} for five minutes and write down one realistic route to paid work connected to it.`;
  }

  if (profileCode === "STREAMING") {
    if (type.includes("listening") || type.includes("jazz") || type.includes("culture")) {
      return `Use ${name} as a taste check: would your music make sense in a room like this, and what audience would actually care?`;
    }

    if (type.includes("community") || type.includes("arts")) {
      return `Think about one small real-world moment around ${name}: a listening session, collaboration, screening, or support slot.`;
    }

    if (type.includes("club") || type.includes("dj")) {
      return `If your music fits this world, look at one DJ, night or curator connected to ${name} instead of just posting online.`;
    }

    return `Use ${name} to imagine where the release could live outside Spotify: people, rooms, scenes, or collaborators.`;
  }

  if (type.includes("studio") || type.includes("workspace")) {
    return `Ask whether ${name} supports the work side of your career: clients, collaborators, routine, or better creative output.`;
  }

  if (type.includes("venue") || type.includes("bar") || type.includes("grassroots")) {
    return `Ask whether ${name} supports the live side of your career: audience, stage time, content, or useful contacts.`;
  }

  return `Use ${name} as a clue. Decide whether it points you towards live, freelance, or audience-building this week.`;
}

function getTopNearbyPlaces(profileCode, userLat, userLng) {
  if (typeof PLACES === "undefined") return [];

  const allPlaces = PLACES[profileCode] || PLACES.BALANCED || [];

  const scoredPlaces = allPlaces
    .map((place) => {
      const stage = getPlaceStage(place);

      return {
  ...place,
  stage,
  fitReason: getPlaceFitReason(place, profileCode),
  action: getPlaceAction(place, profileCode),
  distanceKm: getDistanceKm(userLat, userLng, place.lat, place.lng)
};
    })
    .sort((a, b) => {
      if (a.stage === "Aspirational" && b.stage !== "Aspirational") return 1;
      if (a.stage !== "Aspirational" && b.stage === "Aspirational") return -1;
      return a.distanceKm - b.distanceKm;
    });

  const realisticPlaces = scoredPlaces.filter((place) => place.stage !== "Aspirational");
  const fallbackPlaces = scoredPlaces.filter((place) => place.stage === "Aspirational");

  return [...realisticPlaces, ...fallbackPlaces].slice(0, 5);
}

function renderOpportunityPlaces(places) {
  const list = document.getElementById("placesList");
  if (!list) return;

  list.dataset.hasResults = "true";

  if (!places.length) {
    list.innerHTML = `
      <div class="searchPrompt">
        <span class="promptLabel">No places found yet</span>
        <div class="promptText">
          Try another postcode, or expand the places dataset for this profile.
        </div>
      </div>
    `;
    return;
  }

  list.innerHTML = places
    .map((place, index) => {
      const mapsUrl =
        place.mapsUrl ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " London")}`;

      return `
  <div class="searchPrompt placeResultCard" data-place-index="${index}">
    <span class="promptLabel">${place.stage} · ${place.type} · ${place.distanceKm.toFixed(1)} km away</span>
    <div class="promptText">
  <strong>${place.name}</strong><br>
  ${place.fitReason}
  <br><br>
  <span class="placeWhy">${place.why || ""}</span>
  <br><br>
  <span class="placeAction"><strong>Try this:</strong> ${place.action}</span>
</div>
    <div class="placeActions">
      <a href="${mapsUrl}" target="_blank" rel="noreferrer">Open in Maps</a>
    </div>
  </div>
`;
    })
    .join("");

  document.querySelectorAll(".placeResultCard").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const index = Number(card.dataset.placeIndex);
      const item = opportunityMarkers[index];
      if (item) item.marker.openPopup();
    });

    card.addEventListener("mouseleave", () => {
      const index = Number(card.dataset.placeIndex);
      const item = opportunityMarkers[index];
      if (item) item.marker.closePopup();
    });
  });
}

async function geocodePostcode(postcode) {
  const query = encodeURIComponent(`${postcode}, London, UK`);
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=gb&q=${query}`,
    {
      headers: {
        "Accept-Language": "en-GB"
      }
    }
  );

  if (!response.ok) throw new Error("Geocoding failed");

  const data = await response.json();

  if (!data.length) return null;

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    label: data[0].display_name
  };
}

async function findPlacesNearUser() {
  const input = document.getElementById("postcodeInput");
  const list = document.getElementById("placesList");

  if (!input) return;

const postcode = input.value.trim();

await logUserEvent("postcode_searched", {
  postcode
});
  if (!postcode) {
    if (list) {
      list.innerHTML = `
        <div class="searchPrompt">
          <span class="promptLabel">Postcode needed</span>
          <div class="promptText">Enter a London postcode first.</div>
        </div>
      `;
    }
    return;
  }

  initOpportunityMap();

  if (list) {
    list.innerHTML = `
      <div class="searchPrompt">
        <span class="promptLabel">Finding places</span>
        <div class="promptText">Looking for useful places near ${postcode.toUpperCase()}…</div>
      </div>
    `;
  }

  try {
    const location = await geocodePostcode(postcode);

await logUserEvent("postcode_searched", {
  postcode: postcode.toUpperCase()
});

    if (!location) {
      if (list) {
        list.innerHTML = `
          <div class="searchPrompt">
            <span class="promptLabel">Postcode not found</span>
            <div class="promptText">Try another London postcode.</div>
          </div>
        `;
      }
      return;
    }

    const state = calculateState();
    const places = getTopNearbyPlaces(state.profileCode, location.lat, location.lng);
    lastNearbyPlaces = places;

    clearOpportunityMarkers();

    userLocationMarker = L.marker([location.lat, location.lng], {
      icon: createUserIcon()
    })
      .addTo(opportunityMap)
      .bindPopup(`<strong>You are here</strong><br>${postcode.toUpperCase()}`);

    userLocationMarker.on("mouseover", () => {
      userLocationMarker.openPopup();
    });

    userLocationMarker.on("mouseout", () => {
      userLocationMarker.closePopup();
    });

    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: createPlaceIcon()
      })
        .addTo(opportunityMap)
        .bindPopup(`
          <strong>${place.name}</strong><br>
          ${place.type}
        `);

      marker.on("mouseover", () => {
        marker.openPopup();
      });

      marker.on("mouseout", () => {
        marker.closePopup();
      });

      opportunityMarkers.push({ marker, place });
    });

    const boundsItems = [
      [location.lat, location.lng],
      ...places.map((place) => [place.lat, place.lng])
    ];

    opportunityMap.fitBounds(L.latLngBounds(boundsItems), {
      padding: [36, 36],
      maxZoom: 13
    });

    setTimeout(() => {
      opportunityMap.invalidateSize();
    }, 100);

    renderOpportunityPlaces(places);
    renderThisWeekActions(state.profileCode, places);
  } catch (error) {
    console.error(error);
    if (list) {
      list.innerHTML = `
        <div class="searchPrompt">
          <span class="promptLabel">Something went wrong</span>
          <div class="promptText">The map could not look up that postcode. Try again.</div>
        </div>
      `;
    }
  }
}

// ---------------------------
// ACTION COPY
// ---------------------------
function renderThisWeekActions(code, places = []) {
  const container = document.getElementById("thisWeekActions");
  if (!container) return;

  const placeNames = places.slice(0, 3).map((p) => p.name);

  let actions = [];

  if (code === "FREELANCE") {
    actions = [
      {
        title: "Reach out locally",
        body: `Message 2 places like ${placeNames[0] || "nearby studios"} or ${placeNames[1] || "creative spaces"} for freelance work.`
      },
      {
        title: "Change your environment",
        body: `Spend a few hours somewhere like ${placeNames[2] || "a local creative venue"} and use the space to start one useful conversation.`
      },
      {
        title: "Quote slightly higher",
        body: "Pick one new enquiry this week and test a slightly stronger rate rather than taking on more work."
      }
    ];
  } else if (code === "LIVE") {
    actions = [
      {
        title: "Target real rooms",
        body: `Look into playing at places like ${placeNames[0] || "nearby venues"} or ${placeNames[1] || "small gig spaces"} this month.`
      },
      {
        title: "Build a follow-up habit",
        body: "After your next show, message one promoter or venue while the night is still fresh."
      },
      {
        title: "Choose better gigs",
        body: "Only say yes to shows that make sense financially, strategically, or genuinely help your audience grow."
      }
    ];
  } else if (code === "STREAMING") {
    actions = [
      {
        title: "Connect releases to places",
        body: `Think about how your next release could link to a real space like ${placeNames[0] || "a local scene"} or a small live moment.`
      },
      {
        title: "Finish one thing",
        body: "Push one track or release task over the line this week instead of keeping five ideas open."
      },
      {
        title: "Find real listeners",
        body: "Share your work somewhere people actually listen — a community, room, event or small creative circle."
      }
    ];
  } else {
    actions = [
      {
        title: "Pick one direction",
        body: `Use the map as a starting point: explore places like ${placeNames[0] || "nearby venues"} and choose one lane to push this week.`
      },
      {
        title: "Keep the rest steady",
        body: "Let the other parts of your work continue, but don’t try to grow every income stream at once."
      },
      {
        title: "Review what moved",
        body: "At the end of the week, ask what actually created movement rather than what simply kept you busy."
      }
    ];
  }

  container.innerHTML = actions
    .map((action) => {
      return `
        <div class="actionCard flipActionCard" tabindex="0">
          <div class="flipActionInner">
            <div class="flipActionFace flipActionFront">
              <div class="actionTitle">${action.title}</div>
            </div>
            <div class="flipActionFace flipActionBack">
              <p>${action.body}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// ---------------------------
// SEARCH PROMPTS + PLAN
// ---------------------------
function getSearchPrompts(code) {
  const prompts = {
    FREELANCE: [
      {
        label: "Direction",
        text: "Look for places where repeat work can happen — studios, content agencies, post-production teams, small labels, production companies."
      }
    ],
    LIVE: [
      {
        label: "Direction",
        text: "Start with smaller venues, recurring nights, and promoters who book emerging acts regularly — not just the most impressive names."
      }
    ],
    STREAMING: [
      {
        label: "Direction",
        text: "Look for places where a release creates movement elsewhere — communities, blogs, tastemakers, collaborators, or live opportunities."
      }
    ],
    BALANCED: [
      {
        label: "Direction",
        text: "Pick one category and go deeper there for now. Broad discovery feels productive, but focused discovery usually gets results."
      }
    ]
  };

  return prompts[code] || prompts.BALANCED;
}

function renderSearchPrompts(code) {
  const container = document.getElementById("searchPrompts");
  if (!container) return;

  const prompts = getSearchPrompts(code);

  container.innerHTML = prompts
    .map((prompt) => {
      return `
        <div class="searchPrompt">
          <span class="promptLabel">${prompt.label}</span>
          <div class="promptText">${prompt.text}</div>
        </div>
      `;
    })
    .join("");
}


// ---------------------------
// RECOMMENDATIONS
// ---------------------------
function recommendationHTMLFor(code) {
  const commonNote = `<p><strong>Heads up</strong> — this is directional on purpose. It’s here to help you make a better next move, not pretend your career fits inside a spreadsheet.</p>`;

  const FREELANCE = `
    <h3>Profile — Freelance-led</h3>
    <p><strong>What this means</strong> — right now, most of your income comes from freelance work. That’s not a bad thing. Early on, it’s often the fastest way to get paid. The trade-off is that your time becomes the ceiling, so the smartest gains usually come from how you freelance, not just how much of it you do.</p>
    <p class="recTitle">Recommendation 1 — Nudge your rates up carefully</p>
    <p>Small pricing changes can do more for you than cramming in more work.</p>
    <ul><li>Look back at the smoothest jobs you’ve done recently.</li><li>For new clients, test a higher rate first.</li><li>You don’t need to change everything overnight.</li></ul>
    <p class="recTitle">Recommendation 2 — Cut one low-value day</p>
    <p>Some work pays you twice. Some only drains you.</p>
    <ul><li>Identify the work that pays badly, drags, or doesn’t help your positioning.</li><li>Try replacing just one low-value day this month.</li><li>Use that space for better work or your own music.</li></ul>
    <p class="recTitle">Recommendation 3 — Use freelance as fuel</p>
    <p>Freelance does not have to be the final shape of your career.</p>
    <ul><li>Set aside a small amount of freelance income intentionally.</li><li>Use it to fund something that helps your longer-term direction.</li><li>Treat it like fuel, not just survival.</li></ul>
    ${commonNote}
  `;

  const LIVE = `
    <h3>Profile — Live-show-led</h3>
    <p><strong>What this means</strong> — live shows are doing most of the heavy lifting right now. That can move fast, but it can also swing around a lot from month to month. The game here is not just playing more — it’s making each show count more.</p>
    <p class="recTitle">Recommendation 1 — Make each show worth more</p>
    <p>One better show is often more useful than two messy ones.</p>
    <ul><li>Break down what you actually keep from each gig.</li><li>Look for one lever to improve: fee, merch, travel, or guarantees.</li><li>Track net profit, not just the headline fee.</li></ul>
    <p class="recTitle">Recommendation 2 — Don’t let the gig end at load-out</p>
    <p>The best value in a show is not always the show itself.</p>
    <ul><li>Use gigs to build repeat relationships with promoters and venues.</li><li>Follow up while the night is still fresh.</li><li>Think pipeline, not one-off win.</li></ul>
    <p class="recTitle">Recommendation 3 — Be selective</p>
    <p>Busy and useful are not the same thing.</p>
    <ul><li>Define what a worthwhile show looks like for you.</li><li>Say no to gigs that lose money or energy for no reason.</li><li>Protect your calendar like it matters — because it does.</li></ul>
    ${commonNote}
  `;

  const STREAMING = `
    <h3>Profile — Streaming-marginal</h3>
    <p><strong>What this means</strong> — streaming isn’t doing much financially yet, which is normal. At this stage it’s usually more useful as momentum, visibility, and proof that you’re active than as real income.</p>
    <p class="recTitle">Recommendation 1 — Stop expecting streaming to carry everything</p>
    <p>It usually doesn’t, at least not early.</p>
    <ul><li>Treat streaming as long-term career support.</li><li>Judge your progress by consistency, not whether this month’s royalties felt meaningful.</li><li>Let it support other parts of your career too.</li></ul>
    <p class="recTitle">Recommendation 2 — Keep the release rhythm realistic</p>
    <p>Finished work beats ambitious unfinished work.</p>
    <ul><li>Set a release pace you can actually maintain.</li><li>Keep projects small enough to ship.</li><li>Let consistency beat perfection.</li></ul>
    <p class="recTitle">Recommendation 3 — Give the release a job</p>
    <p>Don’t let it just sit there.</p>
    <ul><li>Ask what each release is meant to unlock.</li><li>Connect it to shows, freelance visibility, collaborators, or pitching.</li><li>Think ecosystem, not isolated uploads.</li></ul>
    ${commonNote}
  `;

  const BALANCED = `
    <h3>Profile — Balanced mix</h3>
    <p><strong>What this means</strong> — your income is spread across a few things, which lowers risk. The catch is that it can become very easy to stay busy without building much momentum in any one direction.</p>
    <p class="recTitle">Recommendation 1 — Pick one thing to push properly</p>
    <p>You don’t need a permanent decision. You need a temporary one.</p>
    <ul><li>Choose the stream that feels most promising right now.</li><li>Give it a real block of focus for the next month or two.</li><li>Keep the others on maintenance mode.</li></ul>
    <p class="recTitle">Recommendation 2 — Protect the baseline</p>
    <p>Balance is useful — until it turns into drift.</p>
    <ul><li>Set minimums for the streams you do not want to neglect.</li><li>Keep experiments from swallowing the whole month.</li><li>Try to stay intentional rather than reactive.</li></ul>
    <p class="recTitle">Recommendation 3 — Review outcomes, not guilt</p>
    <p>Being busy does not automatically mean you’re moving.</p>
    <ul><li>Look at what paid, what dragged, and what felt worth repeating.</li><li>Adjust next month based on signal, not emotion.</li><li>Small repeated decisions beat random pivots.</li></ul>
    ${commonNote}
  `;

  if (code === "FREELANCE") return FREELANCE;
  if (code === "LIVE") return LIVE;
  if (code === "STREAMING") return STREAMING;
  return BALANCED;
}

function localStrategyHTMLFor(code, places = []) {
  const topPlace = places[0]?.name || "the first place on your map";
  const secondPlace = places[1]?.name || "another nearby place";

  if (code === "FREELANCE") {
    return `
      <h3>Use the map to find better work, not just more work</h3>
      <p>Your profile is freelance-led, so the goal is not to fill every gap in your calendar. It is to find places where repeat work, referrals or better-fit clients could come from.</p>
      <p class="recTitle">Start with this</p>
      <ul>
        <li>Look at ${topPlace} and ${secondPlace} as possible connection points, not guaranteed clients.</li>
        <li>Choose one place to research properly before reaching out.</li>
        <li>Focus your message on what you can help with, not just what you do.</li>
      </ul>
    `;
  }

  if (code === "LIVE") {
    return `
      <h3>Use the map to find realistic rooms</h3>
      <p>Your profile is live-led, so the goal is to find places where shows could create repeat momentum — not just impressive names that are hard to access right now.</p>
      <p class="recTitle">Start with this</p>
      <ul>
        <li>Prioritise realistic next-step rooms like ${topPlace} before chasing bigger stages.</li>
        <li>Look for regular nights, emerging artist slots or promoters connected to these spaces.</li>
        <li>After every useful show or conversation, follow up while the contact is still warm.</li>
      </ul>
    `;
  }

  if (code === "STREAMING") {
    return `
      <h3>Use the map to connect releases to real people</h3>
      <p>Your profile is audience-building. Streaming may not be driving income yet, so the map is here to help you turn releases into real-world movement.</p>
      <p class="recTitle">Start with this</p>
      <ul>
        <li>Look at ${topPlace} and ${secondPlace} as possible communities, not just venues.</li>
        <li>Ask where your music could be heard by real people: small events, listening spaces, collaborators or local scenes.</li>
        <li>Give your next release a job beyond “being uploaded”.</li>
      </ul>
    `;
  }

  return `
    <h3>Use the map to choose one direction</h3>
    <p>Your income is mixed, which gives you options. The danger is trying to push everything at once. Use the places above to choose one lane for the next few weeks.</p>
    <p class="recTitle">Start with this</p>
    <ul>
      <li>Look at ${topPlace} and ask: does this support live, freelance, or audience-building?</li>
      <li>Pick the direction that feels most useful right now.</li>
      <li>Keep the rest steady, but do not try to grow every stream at the same time.</li>
    </ul>
  `;
}

// ---------------------------
// MAIN RENDER
// ---------------------------
function computeAndRender() {
  const state = calculateState();
  const {
    input,
    streamingTypical,
    liveTypical,
    freelanceTypical,
    totals,
    percentages,
    profileCode
  } = state;

  document.getElementById("incomeRange").innerText =
    `${formatGBP(totals.low)} - ${formatGBP(totals.high)}`;
  document.getElementById("incomeTypical").innerText =
    `Typical: ~${formatGBP(totals.typical)}`;

  document.getElementById("legendStreaming").innerText =
    `${(percentages.streaming * 100).toFixed(0)}%`;
  document.getElementById("legendLive").innerText =
    `${(percentages.live * 100).toFixed(0)}%`;
  document.getElementById("legendFreelance").innerText =
    `${(percentages.freelance * 100).toFixed(0)}%`;

  document.getElementById("allocation").innerText =
    `Streaming ${(percentages.streaming * 100).toFixed(0)}% • Live ${(percentages.live * 100).toFixed(0)}% • Freelance ${(percentages.freelance * 100).toFixed(0)}%`;

  document.getElementById("profileBadge").innerText = getProfileLabel(profileCode);
  document.getElementById("insight").innerText = getInsightText(profileCode);

  document.getElementById("legendRowStreaming").setAttribute("data-tooltip", `Streaming income (typical): ${formatGBP(streamingTypical)}`);
  document.getElementById("legendRowLive").setAttribute("data-tooltip", `Live income (typical): ${formatGBP(liveTypical)}`);
  document.getElementById("legendRowFreelance").setAttribute("data-tooltip", `Freelance income (typical): ${formatGBP(freelanceTypical)}`);

  initOrUpdatePie(percentages.streaming, percentages.live, percentages.freelance);

  if (lastNearbyPlaces.length) {
  renderThisWeekActions(profileCode, lastNearbyPlaces);
}
  renderSearchPrompts(profileCode);

  const recommendationEl = document.getElementById("recommendation");
const recommendationBlock = document.getElementById("recommendationBlock");
const pdfDownloadBtn = document.getElementById("downloadPdfBtn");

if (recommendationBlock) {
  recommendationBlock.style.display = lastNearbyPlaces.length ? "block" : "none";
}

if (recommendationEl && lastNearbyPlaces.length) {
  recommendationEl.innerHTML = localStrategyHTMLFor(profileCode, lastNearbyPlaces);
}

if (pdfDownloadBtn) {
  pdfDownloadBtn.style.display = "inline-flex";
}

  const goalBlock = document.getElementById("goalBlock");
  const goalText = document.getElementById("goalText");

  if (input.target > 0) {
    goalBlock.style.display = "block";

    const gap = input.target - totals.typical;

if (gap > 0) {
  goalText.innerText =
    `You are approximately ${formatGBP(gap)} below your monthly target. Saving this snapshot lets you compare whether that gap is closing next time.`;
} else if (gap < 0) {
  goalText.innerText =
    `You are approximately ${formatGBP(Math.abs(gap))} above your monthly target. Saving this snapshot helps you see whether that level is repeatable.`;
} else {
  goalText.innerText = "You are exactly on your monthly target.";
}
  } else {
    goalBlock.style.display = "none";
  }
}

// ---------------------------
// LOCAL SAVE
// ---------------------------
async function saveCurrentSnapshot() {
  const user = await getCurrentUser();

  if (!user) {
    openAuthModal("signup");
    const status = document.getElementById("authStatus");
    const intro = document.getElementById("authIntro");
    const title = document.getElementById("authTitle");

    if (title) title.innerText = "Save your snapshot";
    if (intro) {
      intro.innerText =
        "Create an account or log in to save this snapshot and open your dashboard.";
    }
    if (status) {
      status.innerText =
        "Already have an account? Use your existing email and password below.";
    }

    return;
  }

  const state = calculateState();

  const { error } = await supabaseClient
    .from("snapshots")
    .insert([
      {
        user_id: user.id,
        inputs_json: state.input,
        results_json: state,
        profile_code: state.profileCode,
        postcode: document.getElementById("postcodeInput")?.value || null
      }
    ]);

  if (error) {
  console.error(error);
  alert("Error saving snapshot.");
} else {
  await logUserEvent("snapshot_saved", {
  profile_code: state.profileCode,
  income: state.totals.typical,
  has_target: state.input.target > 0
});

  document.getElementById("saveStatus").innerText =
  "Saved. Opening your dashboard… you’ll be able to track your progress there.";

setTimeout(async () => {
  await renderDashboard();
}, 500);
  }
}

async function getLatestSnapshotFromSupabase() {
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabaseClient
    .from("snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Fetch latest snapshot error:", error);
    return null;
  }

  return data;
}
async function getUserSnapshotsFromSupabase(limit = 10) {
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabaseClient
    .from("snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Fetch snapshots error:", error);
    return [];
  }

  return data || [];
}
async function updateReturnCard() {
  const card = document.getElementById("returnCard");

  if (!card) return;

  const saved = await getLatestSnapshotFromSupabase();

  if (!saved) {
    card.style.display = "none";
    return;
  }

  card.style.display = "block";

  document.getElementById("lastSavedDate").innerText =
    `Saved ${formatDateTimeForSave(saved.created_at)}`;

  document.getElementById("lastSavedIncome").innerText =
    `~${formatGBP(saved.results_json?.totals?.typical || 0)}`;

  document.getElementById("lastSavedProfile").innerText =
    getProfileLabel(saved.profile_code || "BALANCED");
}
function getSnapshotTypicalIncome(snapshot) {
  return snapshot?.results_json?.totals?.typical || 0;
}

function getFocusArea(profileCode) {
  if (profileCode === "LIVE") return "the quality of your shows";
  if (profileCode === "FREELANCE") return "the value of your work";
  if (profileCode === "STREAMING") return "real audience connection";
  return "one clear direction instead of everything at once";
}

function getIncomeExplanation(latest, previous) {
  if (!previous) return "This is your starting point. The next snapshot will start showing what has changed.";

  const latestData = latest.results_json || {};
  const previousData = previous.results_json || {};

  const liveDiff = (latestData.liveTypical || 0) - (previousData.liveTypical || 0);
  const freelanceDiff = (latestData.freelanceTypical || 0) - (previousData.freelanceTypical || 0);
  const streamingDiff = (latestData.streamingTypical || 0) - (previousData.streamingTypical || 0);

  const biggest = [
    { label: "live", value: liveDiff },
    { label: "freelance", value: freelanceDiff },
    { label: "streaming", value: streamingDiff }
  ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))[0];

  if (!biggest || biggest.value === 0) {
    return "Your income stayed fairly steady. The useful question now is what actually felt worth repeating.";
  }

  if (biggest.value > 0) {
    return `Most of the positive movement came from ${biggest.label}. That is probably worth paying attention to.`;
  }

  return `Most of the drop came from ${biggest.label}. That does not mean panic — it just shows where the movement happened.`;
}

const SMART_MISSION_BANK = [
  // LIVE
  {
    id: "live_warm_follow_up",
    profiles: ["LIVE"],
    category: "relationships",
    difficulty: "easy",
    text: "Message one promoter or venue you’ve already crossed paths with.",
    why: "Warm contacts usually beat random outreach. You’re not starting from zero."
  },
  {
    id: "live_real_profit",
    profiles: ["LIVE"],
    category: "money",
    difficulty: "easy",
    text: "Look at your last gig and write down what you actually kept after costs.",
    why: "The fee is not the full story. The real number tells you whether the gig was worth it."
  },
  {
    id: "live_realistic_room",
    profiles: ["LIVE"],
    category: "local",
    difficulty: "easy",
    text: "Shortlist three realistic rooms from your map, not fantasy stages.",
    why: "Momentum usually starts with rooms you can actually reach."
  },
  {
    id: "live_better_deal",
    profiles: ["LIVE"],
    category: "pricing",
    difficulty: "medium",
    text: "For your next booking, ask for one better term: fee, travel, food, timing, or support slot.",
    why: "You do not always need more gigs. Sometimes you need slightly better gigs."
  },
  {
    id: "live_tighten_set",
    profiles: ["LIVE"],
    category: "creative",
    difficulty: "medium",
    text: "Tighten one part of your live set that always feels a bit messy.",
    why: "Small live improvements can change how seriously people take the whole show."
  },
  {
    id: "live_say_no",
    profiles: ["LIVE"],
    category: "focus",
    difficulty: "hard",
    text: "Say no, or mentally say no, to one gig that would make you busy but not move things forward.",
    why: "Bad gigs can cost energy, money and momentum."
  },

  // FREELANCE
  {
    id: "freelance_stronger_rate",
    profiles: ["FREELANCE"],
    category: "pricing",
    difficulty: "medium",
    text: "On your next enquiry, test a slightly stronger rate.",
    why: "Not dramatic. Just stop undercutting yourself by default."
  },
  {
    id: "freelance_past_client",
    profiles: ["FREELANCE"],
    category: "relationships",
    difficulty: "easy",
    text: "Message one past client you liked working with.",
    why: "Good freelance work often comes from people who already trust you."
  },
  {
    id: "freelance_best_pattern",
    profiles: ["FREELANCE"],
    category: "money",
    difficulty: "easy",
    text: "Check which recent job gave you the best money-to-energy ratio.",
    why: "That is probably the type of work to chase more deliberately."
  },
  {
    id: "freelance_offer_sentence",
    profiles: ["FREELANCE"],
    category: "admin",
    difficulty: "easy",
    text: "Rewrite what you offer in one clear sentence.",
    why: "If people cannot explain what you do, they cannot refer you."
  },
  {
    id: "freelance_paid_extra",
    profiles: ["FREELANCE"],
    category: "pricing",
    difficulty: "medium",
    text: "Pick one thing you often include for free and decide whether it should become a paid extra.",
    why: "Small boundaries can protect your time without needing a full rebrand."
  },
  {
    id: "freelance_own_music_time",
    profiles: ["FREELANCE"],
    category: "focus",
    difficulty: "medium",
    text: "Protect one block of time for your own music this week.",
    why: "Freelance should support the bigger picture, not quietly eat it."
  },

  // STREAMING / AUDIENCE-BUILDING
  {
    id: "streaming_one_release_task",
    profiles: ["STREAMING"],
    category: "creative",
    difficulty: "easy",
    text: "Finish one release-related task this week.",
    why: "Small and done beats big and floating around forever."
  },
  {
    id: "streaming_real_listener_place",
    profiles: ["STREAMING"],
    category: "audience",
    difficulty: "medium",
    text: "Share your music somewhere people actually listen, not just somewhere people scroll.",
    why: "Streams come from real people, not just uploads."
  },
  {
    id: "streaming_release_job",
    profiles: ["STREAMING"],
    category: "focus",
    difficulty: "easy",
    text: "Give your next release one job: audience, collaborators, gigs, press, or proof of activity.",
    why: "A release without a job usually just disappears into the feed."
  },
  {
    id: "streaming_specific_send",
    profiles: ["STREAMING"],
    category: "relationships",
    difficulty: "medium",
    text: "Send one track to someone specific with a real reason.",
    why: "A personal message lands better than a copy-paste ‘check this out’."
  },
  {
    id: "streaming_stop_refreshing",
    profiles: ["STREAMING"],
    category: "reflection",
    difficulty: "easy",
    text: "Check your stats once, then stop.",
    why: "The work is not hidden inside the refresh button."
  },
  {
    id: "streaming_kill_or_finish",
    profiles: ["STREAMING"],
    category: "creative",
    difficulty: "medium",
    text: "Choose one unfinished idea and either finish it, park it, or kill it.",
    why: "Too many half-open ideas drain more energy than they deserve."
  },

  // BALANCED / MIXED
  {
    id: "balanced_one_lane",
    profiles: ["BALANCED"],
    category: "focus",
    difficulty: "easy",
    text: "Choose one lane to push this week. Not forever — just this week.",
    why: "Mixed income is useful, but trying to grow everything at once gets messy fast."
  },
  {
    id: "balanced_money_vs_tired",
    profiles: ["BALANCED"],
    category: "reflection",
    difficulty: "easy",
    text: "Look at what made you money and what only made you tired.",
    why: "Be honest, not harsh. The pattern matters."
  },
  {
    id: "balanced_clear_upside",
    profiles: ["BALANCED"],
    category: "money",
    difficulty: "medium",
    text: "Pick the income stream with the clearest upside and give it one proper action.",
    why: "You do not need to abandon everything else. You just need one sharper push."
  },
  {
    id: "balanced_minimum_baseline",
    profiles: ["BALANCED"],
    category: "admin",
    difficulty: "easy",
    text: "Set a minimum baseline for the things you are not focusing on.",
    why: "Maintenance mode is better than accidentally dropping something important."
  },
  {
    id: "balanced_remove_task",
    profiles: ["BALANCED"],
    category: "focus",
    difficulty: "medium",
    text: "Remove one low-value task from your week.",
    why: "Space is part of the strategy."
  },
  {
    id: "balanced_visible_step",
    profiles: ["BALANCED"],
    category: "creative",
    difficulty: "medium",
    text: "Move one creative idea forward by one visible step.",
    why: "Demo, draft, send, rehearse, publish — something that exists outside your head."
  }
];

function getWeekStartDate() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split("T")[0];
}

function getSnapshotIncome(snapshot) {
  return snapshot?.results_json?.totals?.typical || 0;
}

async function logUserEvent(eventType, metadata = {}) {
  const user = await getCurrentUser();
  if (!user) return;

  const { error } = await supabaseClient.from("user_events").insert([
    {
      user_id: user.id,
      event_type: eventType,
      metadata
    }
  ]);

  if (error) {
    console.error("User event error:", error);
  }
}

async function getRecentCompletedMissionIds(userId) {
  const { data, error } = await supabaseClient
    .from("missions")
    .select("mission_bank_id")
    .eq("user_id", userId)
    .eq("completed", true)
    .order("completed_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Recent mission history error:", error);
    return [];
  }

  return (data || []).map((item) => item.mission_bank_id);
}

async function getRecentUserEvents(userId, limit = 30) {
  const { data, error } = await supabaseClient
    .from("user_events")
    .select("event_type, metadata, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("User events fetch error:", error);
    return [];
  }

  return data || [];
}

function hasRecentEvent(events, eventType) {
  return events.some((event) => event.event_type === eventType);
}

async function getMissionCompletionRate(userId) {
  const { data, error } = await supabaseClient
    .from("missions")
    .select("completed")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error || !data || !data.length) return 0;

  const completed = data.filter((item) => item.completed).length;
  return completed / data.length;
}

function diagnoseUser(latest, previous, completionRate, recentEvents = []) {
  const latestIncome = getSnapshotIncome(latest);
  const previousIncome = previous ? getSnapshotIncome(previous) : null;

  let incomeTrend = "new";

  if (previousIncome !== null) {
    if (latestIncome > previousIncome) incomeTrend = "up";
    else if (latestIncome < previousIncome) incomeTrend = "down";
    else incomeTrend = "flat";
  }

  const target = latest?.results_json?.input?.target || 0;
  const gap = target > 0 ? target - latestIncome : 0;

  return {
    profile: latest.profile_code || "BALANCED",
    previousProfile: previous?.profile_code || null,
    incomeTrend,
    latestIncome,
    previousIncome,
    targetGapValue: gap,
    targetGap:
      gap > 500 ? "large" :
      gap > 0 ? "small" :
      "none",
    completionRate,
    usedMapRecently: hasRecentEvent(recentEvents, "postcode_searched"),
    downloadedPdfRecently: hasRecentEvent(recentEvents, "pdf_downloaded"),
    viewedDashboardRecently: hasRecentEvent(recentEvents, "dashboard_viewed")
  };
}

function selectStrategy(diagnosis) {
  if (diagnosis.completionRate < 0.25) return "rebuild_momentum";

  if (diagnosis.incomeTrend === "down") return "stabilise";

  if (diagnosis.targetGap === "large") {
    return "close_target_gap";
  }

  if (diagnosis.usedMapRecently && diagnosis.completionRate >= 0.4) {
    return "turn_discovery_into_action";
  }

  if (diagnosis.downloadedPdfRecently && diagnosis.completionRate < 0.6) {
    return "move_from_planning_to_doing";
  }

  if (diagnosis.incomeTrend === "up" && diagnosis.completionRate >= 0.5) {
    return "accelerate";
  }

  if (diagnosis.profile === "LIVE") return "improve_live_quality";
  if (diagnosis.profile === "FREELANCE") return "increase_value";
  if (diagnosis.profile === "STREAMING") return "build_audience";

  return "choose_direction";
}

function getStrategyIntro(strategyKey, diagnosis) {
  const intros = {
    rebuild_momentum:
      "Let’s keep this light. The main thing this week is to get one small thing moving again.",

    stabilise:
      "Things dipped a bit, so this week is about steadying the basics rather than adding more pressure.",

    close_target_gap:
      "You’re below your target, so this week should stay practical: better money, better focus, fewer vague moves.",

    accelerate:
      "There’s some useful movement here. This week is about gently pushing what seems to be working.",

    turn_discovery_into_action:
      "You’ve looked at possible places. Now the useful bit is choosing one and doing something with it.",

    move_from_planning_to_doing:
      "You’ve done the thinking. This week is about turning one of those thoughts into something real.",

    improve_live_quality:
      "Your live activity is doing a lot right now. This week is about making the shows count a little more.",

    increase_value:
      "Freelance is carrying a lot of the weight. This week is about getting more value from the work you already do.",

    build_audience:
      "Streaming is not the main income engine yet. This week is about helping your music meet real people.",

    choose_direction:
      "You’ve got a few things happening at once. This week is about choosing one lane to push gently."
  };

  return intros[strategyKey] || intros.choose_direction;
}

function chooseMissionsFromBank(diagnosis, recentMissionIds = []) {
  const strategyKey = selectStrategy(diagnosis);

  let candidates = SMART_MISSION_BANK.filter((mission) =>
    mission.profiles.includes(diagnosis.profile)
  );

  candidates = candidates.filter((mission) =>
    !recentMissionIds.includes(mission.id)
  );

  if (diagnosis.completionRate < 0.25) {
    candidates = candidates.filter((mission) => mission.difficulty === "easy");
  }

  if (diagnosis.completionRate > 0.7) {
    candidates = candidates.filter((mission) => mission.difficulty !== "easy");
  }

  if (diagnosis.targetGap === "large") {
    candidates = candidates.sort((a, b) => {
      const priority = ["money", "pricing", "relationships", "focus"];
      return priority.indexOf(a.category) - priority.indexOf(b.category);
    });
  }

  if (diagnosis.incomeTrend === "down") {
    candidates = candidates.sort((a, b) => {
      const priority = ["money", "focus", "relationships", "admin"];
      return priority.indexOf(a.category) - priority.indexOf(b.category);
    });
  }

  if (candidates.length < 3) {
    candidates = SMART_MISSION_BANK.filter((mission) =>
      mission.profiles.includes(diagnosis.profile)
    );
  }

  const selected = [];
  const usedCategories = new Set();

  candidates.forEach((mission) => {
    if (selected.length >= 3) return;

    if (!usedCategories.has(mission.category)) {
      selected.push(mission);
      usedCategories.add(mission.category);
    }
  });

  if (selected.length < 3) {
    candidates.forEach((mission) => {
      if (selected.length >= 3) return;
      if (!selected.find((item) => item.id === mission.id)) {
        selected.push(mission);
      }
    });
  }

  return {
    strategyKey,
    missions: selected.slice(0, 3)
  };
}

async function getOrCreateWeeklyMissionCycle(latestSnapshot, previousSnapshot) {
  const user = await getCurrentUser();
  if (!user || !latestSnapshot) return null;

  const weekStart = getWeekStartDate();

  const { data: existingCycle, error: existingError } = await supabaseClient
    .from("mission_cycles")
    .select("*")
    .eq("user_id", user.id)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (existingError) {
    console.error("Mission cycle fetch error:", existingError);
  }

  if (existingCycle) {
    const { data: existingMissions, error: missionError } = await supabaseClient
      .from("missions")
      .select("*")
      .eq("cycle_id", existingCycle.id)
      .order("created_at", { ascending: true });

    if (missionError) {
      console.error("Existing missions fetch error:", missionError);
      return null;
    }

    return {
      cycle: existingCycle,
      missions: existingMissions || []
    };
  }

  const completionRate = await getMissionCompletionRate(user.id);
const recentMissionIds = await getRecentCompletedMissionIds(user.id);
const recentEvents = await getRecentUserEvents(user.id);

const diagnosis = diagnoseUser(
  latestSnapshot,
  previousSnapshot,
  completionRate,
  recentEvents
);

const generated = chooseMissionsFromBank(diagnosis, recentMissionIds);

  const { data: newCycle, error: cycleError } = await supabaseClient
    .from("mission_cycles")
    .insert([
      {
        user_id: user.id,
        week_start: weekStart,
        snapshot_id: latestSnapshot.id,
        profile_code: diagnosis.profile,
        strategy_key: generated.strategyKey,
        diagnosis_json: diagnosis
      }
    ])
    .select()
    .single();

  if (cycleError) {
    console.error("Mission cycle create error:", cycleError);
    return null;
  }

  const missionRows = generated.missions.map((mission) => ({
    user_id: user.id,
    cycle_id: newCycle.id,
    mission_bank_id: mission.id,
    mission_text: mission.text,
    mission_why: mission.why,
    category: mission.category,
    difficulty: mission.difficulty
  }));

  const { data: newMissions, error: missionsError } = await supabaseClient
    .from("missions")
    .insert(missionRows)
    .select();

  if (missionsError) {
    console.error("Mission create error:", missionsError);
    return {
      cycle: newCycle,
      missions: []
    };
  }

  await logUserEvent("mission_cycle_created", {
    week_start: weekStart,
    strategy_key: generated.strategyKey,
    profile_code: diagnosis.profile
  });

  return {
    cycle: newCycle,
    missions: newMissions || []
  };
}

function animateMissionClick(card) {
  if (!card) return;

  card.classList.add("missionPressed");

  if (navigator.vibrate) {
    navigator.vibrate(18);
  }

  setTimeout(() => {
    card.classList.remove("missionPressed");
  }, 140);
}

function renderMissionProgressFromRows(missions = []) {
  const progressEl = document.getElementById("dashboardMissionProgress");
  if (!progressEl) return;

  const completedCount = missions.filter((mission) => mission.completed).length;
  const percent = missions.length ? (completedCount / missions.length) * 100 : 0;

  progressEl.innerHTML = `
    <div class="missionProgressTop">
      <div class="missionProgressLabel">This week</div>
      <div class="missionProgressCount">${completedCount}/${missions.length} complete</div>
    </div>
    <div class="missionProgressTrack">
      <div class="missionProgressFill" style="width:${percent}%"></div>
    </div>
  `;
}

async function renderRecentMissionHistory() {
  const container = document.getElementById("recentMissions");
  if (!container) return;

  const user = await getCurrentUser();
  if (!user) return;

  const { data, error } = await supabaseClient
    .from("missions")
    .select("mission_text, completed_at")
    .eq("user_id", user.id)
    .eq("completed", true)
    .order("completed_at", { ascending: false })
    .limit(5);

  if (error || !data || !data.length) {
    container.innerHTML = `
      <div class="searchPrompt">
        <span class="promptLabel">No completed missions yet</span>
        <div class="promptText">
          Complete a few missions and they’ll show up here.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="resultBlock compact">
      <div class="resultTitle">Recently completed</div>
      ${data
        .map((m) => {
          return `
            <div class="missionHistoryItem">
              ✓ ${m.mission_text}
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

async function renderUnfinishedMissionHistory() {
  const container = document.getElementById("unfinishedMissions");
  if (!container) return;

  const user = await getCurrentUser();
  if (!user) return;

  const currentWeekStart = getWeekStartDate();

  const { data, error } = await supabaseClient
    .from("missions")
    .select(`
      id,
      mission_bank_id,
      mission_text,
      mission_why,
      category,
      difficulty,
      completed,
      created_at,
      mission_cycles!inner(week_start)
    `)
    .eq("user_id", user.id)
    .eq("completed", false)
    .lt("mission_cycles.week_start", currentWeekStart)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error || !data || !data.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="sectionLabel">Still worth doing</div>
    <div class="actionGrid unfinishedMissionGrid">
      ${data
        .map((mission) => {
          return `
            <div class="actionCard missionCard unfinishedMissionCard" data-unfinished-mission-id="${mission.id}">
              <div class="actionTitle">${mission.mission_text}</div>
              <p>${mission.mission_why || "This may still be useful before your next snapshot."}</p>
              <div class="missionMeta">Click to mark complete</div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  document.querySelectorAll(".unfinishedMissionCard").forEach((card) => {
    card.addEventListener("click", async () => {
      const missionId = card.dataset.unfinishedMissionId;
      const mission = data.find((item) => item.id === missionId);

      if (!mission) return;

animateMissionClick(card);

card.classList.add("completed");

      const meta = card.querySelector(".missionMeta");
      if (meta) meta.innerText = "Completed";

      const { error: updateError } = await supabaseClient
        .from("missions")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", missionId);

      if (updateError) {
        console.error("Unfinished mission update error:", updateError);
        card.classList.remove("completed");
        if (meta) meta.innerText = "Click to mark complete";
        return;
      }

      await logUserEvent("mission_completed", {
        mission_id: missionId,
        mission_bank_id: mission.mission_bank_id,
        category: mission.category,
        difficulty: mission.difficulty,
        source: "unfinished_missions"
      });

      await renderRecentMissionHistory();
      await renderUnfinishedMissionHistory();
    });
  });
}

async function renderDashboardMissions(latestSnapshot, previousSnapshot = null) {
  const container = document.getElementById("dashboardMissions");
  if (!container || !latestSnapshot) return;

  const weekly = await getOrCreateWeeklyMissionCycle(latestSnapshot, previousSnapshot);

  if (!weekly || !weekly.missions.length) {
    container.innerHTML = `
      <div class="searchPrompt">
        <span class="promptLabel">No missions yet</span>
        <div class="promptText">Save a snapshot to generate your weekly focus.</div>
      </div>
    `;
    return;
  }

  const strategyIntro = getStrategyIntro(
    weekly.cycle.strategy_key,
    weekly.cycle.diagnosis_json || {}
  );

  renderMissionProgressFromRows(weekly.missions);

  container.innerHTML = `
    <div class="missionStrategyStrip">
      <strong>Why this week looks like this:</strong> ${strategyIntro}
    </div>
    ${weekly.missions
      .map((mission) => {
        return `
          <div class="actionCard missionCard ${mission.completed ? "completed" : ""}" data-mission-id="${mission.id}">
            <div class="actionTitle">${mission.mission_text}</div>
            <p>${mission.mission_why || "This mission is based on your latest Lumen snapshot."}</p>
            <div class="missionMeta">${mission.completed ? "Completed" : "Click to mark complete"}</div>
          </div>
        `;
      })
      .join("")}
  `;

  document.querySelectorAll(".missionCard").forEach((card) => {
    card.addEventListener("click", async () => {
      const missionId = card.dataset.missionId;
      const mission = weekly.missions.find((item) => item.id === missionId);

      if (!mission) return;

animateMissionClick(card);

const nextCompleted = !mission.completed;
      mission.completed = nextCompleted;
      mission.completed_at = nextCompleted ? new Date().toISOString() : null;

      card.classList.toggle("completed", nextCompleted);

      const meta = card.querySelector(".missionMeta");
      if (meta) {
        meta.innerText = nextCompleted ? "Completed" : "Click to mark complete";
      }

      renderMissionProgressFromRows(weekly.missions);

      const { error } = await supabaseClient
        .from("missions")
        .update({
          completed: nextCompleted,
          completed_at: mission.completed_at,
          updated_at: new Date().toISOString()
        })
        .eq("id", missionId);

      if (error) {
        console.error("Mission update error:", error);
        return;
      }

      await logUserEvent(nextCompleted ? "mission_completed" : "mission_uncompleted", {
        mission_id: missionId,
        mission_bank_id: mission.mission_bank_id,
        category: mission.category,
        difficulty: mission.difficulty
      });
    });
  });
}

function renderDashboardChart(snapshots) {
  const canvas = document.getElementById("dashboardIncomeChart");
  if (!canvas) return;

  const labels = snapshots.map((snapshot, index) => {
  const date = new Date(snapshot.created_at);
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const dateLabel = `${day} ${month}`;

  const sameDateCount = snapshots.filter((item) => {
    const itemDate = new Date(item.created_at);
    return (
      itemDate.getDate() === date.getDate() &&
      itemDate.getMonth() === date.getMonth() &&
      itemDate.getFullYear() === date.getFullYear()
    );
  }).length;

  if (sameDateCount > 1) {
    return `Snapshot ${index + 1}`;
  }

  return dateLabel;
});

  const values = snapshots.map((snapshot) =>
    Math.round(getSnapshotTypicalIncome(snapshot))
  );

  const css = getComputedStyle(document.documentElement);
  const primary = css.getPropertyValue("--primary").trim();

  if (dashboardIncomeChart) {
    dashboardIncomeChart.destroy();
  }

  dashboardIncomeChart = new Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Typical monthly income",
          data: values,
          tension: 0.42,
          borderWidth: 4,
          borderColor: primary,
          backgroundColor: "rgba(77,184,174,0.10)",
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: primary,
          pointBorderWidth: 3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index"
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(255,255,255,0.96)",
          titleColor: "rgba(18,18,18,0.92)",
          bodyColor: "rgba(18,18,18,0.72)",
          borderColor: "rgba(20,20,20,0.08)",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: (context) => `Typical income: £${Number(context.raw).toLocaleString("en-GB")}`
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "rgba(18,18,18,0.52)",
            font: {
              family: "Satoshi",
              size: 12,
              weight: 700
            }
          }
        },
        y: {
          beginAtZero: true,
          border: {
            display: false
          },
          grid: {
            color: "rgba(20,20,20,0.06)"
          },
          ticks: {
            color: "rgba(18,18,18,0.52)",
            font: {
              family: "Satoshi",
              size: 12,
              weight: 700
            },
            callback: (value) => `£${Number(value).toLocaleString("en-GB")}`
          }
        }
      }
    }
  });
}

async function renderDashboard() {
  await logUserEvent("dashboard_viewed");

  const snapshots = await getUserSnapshotsFromSupabase(10);

  if (!snapshots.length) {
    showStep("stepIntro");
    return;
  }

  const latest = snapshots[snapshots.length - 1];
  const previous = snapshots.length > 1 ? snapshots[snapshots.length - 2] : null;

  const latestIncome = getSnapshotTypicalIncome(latest);
  const previousIncome = previous ? getSnapshotTypicalIncome(previous) : null;

  document.getElementById("dashboardLatestIncome").innerText =
    `~${formatGBP(latestIncome)}`;

  document.getElementById("dashboardProfile").innerText =
    getProfileLabel(latest.profile_code || "BALANCED");

  document.getElementById("dashboardSnapshotCount").innerText =
    snapshots.length;

  const dashboardFocus = document.getElementById("dashboardFocus");

if (dashboardFocus) {
  const profileLabel = getProfileLabel(latest.profile_code || "BALANCED");
  const focusArea = getFocusArea(latest.profile_code || "BALANCED");

  dashboardFocus.innerHTML = `
    <div class="resultBlock compact dashboardFocusCard">
      <div class="resultTitle">This week’s focus</div>
      <p class="bigText">
        You’re currently on a ${profileLabel} path. Focus on ${focusArea} this week.
      </p>
    </div>
  `;
}

  const comparison = document.getElementById("dashboardComparison");

  if (!previous) {
  comparison.innerHTML = `
    <div class="resultBlock compact">
      <div class="resultTitle">First snapshot saved</div>
      <p class="bigText">
        This is your baseline. Save another snapshot later to see what actually changed.
      </p>
    </div>
  `;
} else {
  const diff = latestIncome - previousIncome;
  const direction = diff >= 0 ? "+" : "-";

  const percentChange =
  previousIncome > 0 ? (diff / previousIncome) * 100 : 0;

const changeClass =
  diff > 0 ? "positiveChange" : diff < 0 ? "negativeChange" : "neutralChange";

const changeLabel =
  diff > 0 ? "Up since last snapshot" :
  diff < 0 ? "Down since last snapshot" :
  "No change since last snapshot";

comparison.innerHTML = `
  <div class="resultBlock compact">
    <div class="resultTitle">Since last time</div>

    <div class="resultValue smallValue ${changeClass}">
      ${direction}${formatGBP(Math.abs(diff))}
    </div>

    <p class="dashboardChangeMeta ${changeClass}">
      ${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(1)}% · ${changeLabel}
    </p>

    <p class="bigText dashboardDiagnosis">
      ${getIncomeExplanation(latest, previous)}
    </p>
  </div>
`;
}

renderDashboardChart(snapshots);
await renderDashboardMissions(latest, previous);
await renderRecentMissionHistory();
await renderUnfinishedMissionHistory();
showStep("dashboardView");
}

// ---------------------------
// PDF GENERATION
// ---------------------------
function buildPdfView(state) {
  const { input, totals, percentages, profileCode } = state;

  document.getElementById("pdfDate").innerText = formatDate();
  document.getElementById("pdfStreams").innerText = input.streams.toLocaleString("en-GB");
  document.getElementById("pdfShows").innerText = input.shows;
  document.getElementById("pdfNetPerShow").innerText = formatGBP(input.netPerShow);
  document.getElementById("pdfDayRate").innerText = formatGBP(input.dayRate);
  document.getElementById("pdfFreelanceDays").innerText = input.freelanceDays;

  const targetRow = document.getElementById("pdfTargetRow");
  if (input.target > 0) {
    targetRow.style.display = "flex";
    document.getElementById("pdfTarget").innerText = formatGBP(input.target);
  } else {
    targetRow.style.display = "none";
  }

  document.getElementById("pdfIncomeRange").innerText =
    `${formatGBP(totals.low)} - ${formatGBP(totals.high)}`;

  document.getElementById("pdfIncomeTypical").innerText =
    `Typical: ~${formatGBP(totals.typical)}`;

  if (mixChart) {
    try {
      document.getElementById("pdfChartImg").src = mixChart.toBase64Image();
    } catch (error) {
      console.error("Failed to capture chart image:", error);
    }
  }

  document.getElementById("pdfAllocation").innerText =
    `Streaming ${(percentages.streaming * 100).toFixed(0)}% • Live ${(percentages.live * 100).toFixed(0)}% • Freelance ${(percentages.freelance * 100).toFixed(0)}%`;

  document.getElementById("pdfInsight").innerText = getInsightText(profileCode);

  const pdfRecommendations = document.getElementById("pdfRecommendations");

  if (lastNearbyPlaces.length) {
    const topPlacesHtml = lastNearbyPlaces
      .slice(0, 3)
      .map((place) => {
        return `
          <p><strong>${place.name}</strong><br>
          ${place.fitReason || place.why || "A useful place to explore based on your current profile."}</p>
        `;
      })
      .join("");

    pdfRecommendations.innerHTML = `
      <h3>Your local strategy</h3>
      ${localStrategyHTMLFor(profileCode, lastNearbyPlaces)}
      <p class="recTitle">Places to look at first</p>
      ${topPlacesHtml}
    `;
  } else {
    pdfRecommendations.innerHTML = `
      <h3>What to do next</h3>
      <p>Use this snapshot as your baseline. Save it, come back later, and compare what has changed.</p>
      <p class="recTitle">Next step</p>
      <p>Enter your postcode inside Lumen to get local places and more grounded next moves.</p>
    `;
  }

  const pdfChecklist = document.getElementById("pdfChecklist");
  if (pdfChecklist) {
    pdfChecklist.innerHTML = `
      <li>Save this snapshot so you can compare progress later.</li>
      <li>Use your dashboard to track income, profile and missions over time.</li>
      <li>Come back after a real-world action and create a new snapshot.</li>
    `;
  }

  document.getElementById("pdfUrl").innerText =
    window.location.hostname || "lumenapp.com";
}

async function downloadPdf() {
  try {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    computeAndRender();

    const state = calculateState();
    buildPdfView(state);

    const dateStr = new Date().toISOString().split("T")[0];
    pdfFilename = `Lumen-Snapshot-${state.profileCode}-${dateStr}.pdf`;

    await renderPdfPageImages();
    showPdfPreviewModal();
  } catch (error) {
    console.error("Error generating PDF preview:", error);
    alert("Failed to generate PDF preview. Please try again.");
  }
}

async function renderPdfPageImages() {
  const pdfView = document.getElementById("pdfView");
  const pages = pdfView.querySelectorAll(".pdfPage");

  pdfPageImages = [];
  pdfView.classList.add("rendering");

  await new Promise((resolve) => setTimeout(resolve, 120));

  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null,
      width: 1240,
      height: 1754,
      windowWidth: 1240,
      windowHeight: 1754,
      removeContainer: false
    });

    pdfPageImages.push(canvas.toDataURL("image/png", 1.0));
    canvas.width = 1;
    canvas.height = 1;
  }

  pdfView.classList.remove("rendering");
}

function showPdfPreviewModal() {
  const modal = document.getElementById("pdfPreviewModal");
  const content = document.getElementById("pdfPreviewContent");

  content.innerHTML = pdfPageImages
    .map((imgData, index) => {
      return `
        <div class="pdfPreviewPage">
          <img src="${imgData}" alt="Page ${index + 1}" loading="lazy" />
        </div>
      `;
    })
    .join("");

  modal.style.display = "flex";
}

function closePdfPreview() {
  document.getElementById("pdfPreviewModal").style.display = "none";
}

async function confirmAndDownloadPdf() {
  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });

    pdfPageImages.forEach((imgData, index) => {
      if (index > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297, undefined, "FAST");
    });

    pdf.save(pdfFilename);

await logUserEvent("pdf_downloaded", {
  filename: pdfFilename
});

closePdfPreview();
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
}

// ---------------------------
// UNLOCK FLOW
// ---------------------------
function setupUnlock() {
  // Old Lemon Squeezy unlock UI has been removed.
  // Keeping this safe prevents JavaScript from crashing.
  const input = document.getElementById("licenseKey");
  const btn = document.getElementById("unlockBtn");
  const status = document.getElementById("unlockStatus");

  if (!input || !btn || !status) return;
}

// ---------------------------
// EVENTS
// ---------------------------
function setupEvents() {
  document.querySelectorAll("input[type='number']").forEach((el) =>
    el.addEventListener("input", computeAndRender)
  );

  document.getElementById("startFlowBtn").addEventListener("click", () => showStep("stepActivity"));
  document.getElementById("backToIntroBtn").addEventListener("click", () => showStep("stepIntro"));
  document.getElementById("toMoneyBtn").addEventListener("click", () => showStep("stepMoney"));
  document.getElementById("backToActivityBtn").addEventListener("click", () => showStep("stepActivity"));
  document.getElementById("closeAuthModalBtn").addEventListener("click", closeAuthModal);
  document.querySelector(".authOverlay").addEventListener("click", closeAuthModal);
  document.getElementById("authSubmitBtn").addEventListener("click", submitAuthForm);

  document.getElementById("authPassword").addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitAuthForm();
  });

  document.getElementById("toResultsBtn").addEventListener("click", () => {
    computeAndRender();
    showStep("stepResults");
  });

  document.getElementById("backToMoneyBtn").addEventListener("click", () => showStep("stepMoney"));
  document.getElementById("toFocusBtn").addEventListener("click", () => showStep("stepFocus"));
  document.getElementById("backToResultsBtn").addEventListener("click", () => showStep("stepResults"));
  document.getElementById("toPlanBtn").addEventListener("click", () => showStep("stepPlan"));
  document.getElementById("backToFocusBtn").addEventListener("click", () => showStep("stepFocus"));

  document.getElementById("startOverBtn").addEventListener("click", () => {
    setInputs({
      streams: 10000,
      shows: 2,
      netPerShow: 150,
      dayRate: 250,
      freelanceDays: 8,
      target: 1500
    });
    document.getElementById("saveStatus").innerText = "";
    showStep("stepIntro");
  });

  document.getElementById("savePlanBtn").addEventListener("click", saveCurrentSnapshot);

  document.getElementById("scenarioFreelance").addEventListener("click", () => {
    setInputs(scenarios.freelance);
    showStep("stepMoney");
  });

  document.getElementById("scenarioLive").addEventListener("click", () => {
    setInputs(scenarios.live);
    showStep("stepMoney");
  });

  document.getElementById("scenarioStreaming").addEventListener("click", () => {
    setInputs(scenarios.streaming);
    showStep("stepMoney");
  });

  document.getElementById("downloadPdfBtn").addEventListener("click", downloadPdf);
  document.getElementById("closePreviewBtn").addEventListener("click", closePdfPreview);
  document.getElementById("confirmDownloadBtn").addEventListener("click", confirmAndDownloadPdf);
  document.querySelector(".pdfPreviewOverlay").addEventListener("click", closePdfPreview);

  const findPlacesBtn = document.getElementById("findPlacesBtn");
  if (findPlacesBtn) findPlacesBtn.addEventListener("click", findPlacesNearUser);

  const postcodeInput = document.getElementById("postcodeInput");
  if (postcodeInput) {
    postcodeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") findPlacesNearUser();
    });
  }
  // Intro login (Step 1)
const introLoginBtn = document.getElementById("introLoginBtn");
if (introLoginBtn) {
  introLoginBtn.addEventListener("click", () => {
    logIn();
  });
}
const dashboardNewSnapshotBtn = document.getElementById("dashboardNewSnapshotBtn");
if (dashboardNewSnapshotBtn) {
  dashboardNewSnapshotBtn.addEventListener("click", () => {
    showStep("stepActivity");
  });
}
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      alert("Could not log out. Please try again.");
      return;
    }

    showStep("stepIntro");
  });
}
}
// ---------------------------
// AUTH
// ---------------------------

let authMode = "login";

function openAuthModal(mode = "login") {
  authMode = mode;

  const modal = document.getElementById("authModal");
  const title = document.getElementById("authTitle");
  const intro = document.getElementById("authIntro");
  const status = document.getElementById("authStatus");
  const submitBtn = document.getElementById("authSubmitBtn");

  if (!modal) return;

  title.innerText = mode === "signup" ? "Create your account" : "Log in";
  intro.innerText =
    mode === "signup"
      ? "Create an account to save your snapshot and start tracking progress over time."
      : "Log in to open your dashboard and continue from your latest snapshot.";

  submitBtn.innerText = mode === "signup" ? "Create account" : "Log in";
  status.innerText = "";

  modal.style.display = "flex";

  setTimeout(() => {
    document.getElementById("authEmail")?.focus();
  }, 80);
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.style.display = "none";
}

async function submitAuthForm() {
  const email = document.getElementById("authEmail")?.value.trim();
  const password = document.getElementById("authPassword")?.value;
  const status = document.getElementById("authStatus");

  if (!email || !password) {
    status.innerText = "Add your email and password first.";
    return;
  }

  status.innerText = authMode === "signup" ? "Creating account…" : "Logging in…";

  if (authMode === "signup") {
  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error("Signup error:", error);
    status.innerText =
      "If you already have an account, click Log in from the intro screen. Otherwise, check your details and try again.";
    return;
  }

  status.innerText = "Account created. Click “Save snapshot” again to save it.";
  setTimeout(closeAuthModal, 900);
  return;
}

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Login error:", error);
    status.innerText = error.message;
    return;
  }

  status.innerText = "Logged in.";
  setTimeout(async () => {
    closeAuthModal();
    await updateReturnCard();
    await renderDashboard();
  }, 500);
}

async function signUp() {
  openAuthModal("signup");
}

async function logIn() {
  openAuthModal("login");
}

async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error("Get user error:", error);
    return null;
  }

  return data.user;
}
// ---------------------------
// BOOT
// ---------------------------
async function bootLumen() {
  setupUnlock();
  setupEvents();
  computeAndRender();

  const user = await getCurrentUser();

  if (user) {
    const snapshots = await getUserSnapshotsFromSupabase(10);

    if (snapshots.length) {
      await renderDashboard();
      return;
    }

    await updateReturnCard();
    showStep("stepIntro");
    return;
  }

  await updateReturnCard();
  showStep("stepIntro");
}

bootLumen();