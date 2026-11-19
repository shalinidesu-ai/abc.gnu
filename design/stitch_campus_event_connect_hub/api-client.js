// Public API client for the no-login event API.
const EVENT_API = "https://abc-gnu.onrender.com";
const USER_ID_STORAGE = "unipulse-user-id";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${EVENT_API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

function getOrAskForUserId() {
  let id = localStorage.getItem(USER_ID_STORAGE) || "";
  if (!id) {
    id = window.prompt("Enter your user UUID to use registrations (no account or login):") || "";
    id = id.trim();
    if (id) localStorage.setItem(USER_ID_STORAGE, id);
  }
  return id;
}

function showApiMessage(container, message, isError = false) {
  let note = container.querySelector("[data-api-message]");
  if (!note) {
    note = document.createElement("p");
    note.dataset.apiMessage = "true";
    note.className = "p-3 my-3 rounded-xl bg-surface-container-high text-body-md";
    container.prepend(note);
  }
  note.textContent = message;
  note.classList.toggle("text-error", isError);
}

async function loadLiveEvents() {
  const list = document.getElementById("events-list");
  if (!list) return;
  try {
    const events = await apiRequest("/api/events");
    list.replaceChildren();
    if (!events.length) {
      showApiMessage(list, "No events are available yet.");
      return;
    }
    for (const event of events) {
      const card = document.createElement("article");
      card.className = "event-feed-card rounded-xl bg-surface-container p-space-md flex flex-col gap-space-sm shadow-md";
      card.dataset.eventId = event.id;
      card.dataset.category = event.category || "";

      const title = document.createElement("h3");
      title.className = "font-headline-sm text-headline-sm text-on-surface";
      title.textContent = event.title || "Untitled event";
      const details = document.createElement("p");
      details.className = "font-body-sm text-body-sm text-on-surface-variant";
      details.textContent = [event.category, event.venue, event.status].filter(Boolean).join(" · ");
      const seats = document.createElement("p");
      seats.className = "font-label-sm text-label-sm text-on-surface-variant";
      seats.textContent = event.capacity == null ? "Capacity not specified" : `${event.capacity} seats`;
      const register = document.createElement("button");
      register.type = "button";
      register.className = "api-rsvp-btn h-10 px-4 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md";
      register.textContent = "Register";
      register.addEventListener("click", async () => {
        const userId = getOrAskForUserId();
        if (!userId) return;
        register.disabled = true;
        try {
          await apiRequest("/api/registrations", {
            method: "POST",
            body: JSON.stringify({ user_id: userId, event_id: event.id }),
          });
          register.textContent = "Registered";
          showApiMessage(list, "Registration created.");
        } catch (error) {
          showApiMessage(list, error.message, true);
          register.disabled = false;
        }
      });
      card.append(title, details, seats, register);
      list.append(card);
    }
    const badge = document.getElementById("event-count-badge");
    if (badge) badge.textContent = `${events.length} Events`;
  } catch (error) {
    showApiMessage(list, `Could not load events: ${error.message}`, true);
  }
}

function setupRegistrations() {
  const main = document.querySelector("main");
  if (!main || !location.pathname.includes("my_registrations_tickets")) return;
  const panel = document.createElement("section");
  panel.className = "mx-4 my-4 p-4 rounded-xl bg-surface-container";
  const heading = document.createElement("h2");
  heading.className = "font-headline-sm text-headline-sm mb-2";
  heading.textContent = "Your registrations";
  const input = document.createElement("input");
  input.className = "w-full p-3 rounded-lg bg-surface-container-high text-on-surface";
  input.placeholder = "Your user UUID";
  input.value = localStorage.getItem(USER_ID_STORAGE) || "";
  input.setAttribute("aria-label", "User UUID");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "mt-3 px-4 py-2 rounded-full bg-primary-container text-on-primary-container";
  button.textContent = "Load registrations";
  const results = document.createElement("div");
  results.className = "mt-3 space-y-2";
  button.addEventListener("click", async () => {
    const userId = input.value.trim();
    if (!userId) return showApiMessage(results, "Enter a user UUID.", true);
    localStorage.setItem(USER_ID_STORAGE, userId);
    button.disabled = true;
    try {
      const records = await apiRequest(`/api/me/registrations?user_id=${encodeURIComponent(userId)}`);
      results.replaceChildren();
      if (!records.length) return showApiMessage(results, "No registrations found.");
      for (const registration of records) {
        const row = document.createElement("p");
        row.className = "p-3 rounded-lg bg-surface-container-high";
        row.textContent = `${registration.event?.title || "Event"} · ${registration.created_at || "Registered"}`;
        results.append(row);
      }
    } catch (error) {
      showApiMessage(results, error.message, true);
    } finally {
      button.disabled = false;
    }
  });
  panel.append(heading, input, button, results);
  main.prepend(panel);
}

document.addEventListener("DOMContentLoaded", () => {
  loadLiveEvents();
  setupRegistrations();
});
