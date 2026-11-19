const API = "https://abc-gnu.onrender.com";
const USER_KEY = "unipulse-user-id";
const $ = (selector) => document.querySelector(selector);
const eventList = $("#event-list");
let events = [];

function message(id, text = "", error = false) {
  const el = $(id);
  el.textContent = text;
  el.hidden = !text;
  el.classList.toggle("error", error);
}

async function request(path, options) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

function loadSavedUser() {
  $("#user-id").value = localStorage.getItem(USER_KEY) || "";
}

function makeButton(label, className, action) {
  const button = document.createElement("button");
  button.className = `button ${className}`;
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", action);
  return button;
}

function renderEvents() {
  const search = $("#event-search").value.trim().toLowerCase();
  const filtered = events.filter((event) =>
    `${event.title || ""} ${event.status || ""} ${event.category || ""} ${event.venue || ""}`.toLowerCase().includes(search)
  );
  $("#event-count").textContent = `${filtered.length} ${filtered.length === 1 ? "event" : "events"}`;
  eventList.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty-hint";
    empty.textContent = search ? "No events match your search." : "No events are listed yet.";
    eventList.append(empty);
    return;
  }
  for (const event of filtered) {
    const card = document.createElement("article");
    card.className = "event-card";
    const top = document.createElement("div");
    top.className = "card-top";
    const status = document.createElement("span");
    status.className = "pill";
    status.textContent = event.status || "event";
    const id = document.createElement("span");
    id.className = "card-id";
    id.textContent = event.id;
    top.append(status, id);
    const title = document.createElement("h3");
    title.textContent = event.title || "Untitled event";
    const meta = document.createElement("p");
    meta.className = "event-meta";
    meta.textContent = [event.category, event.venue].filter(Boolean).join(" · ") || "Campus event";
    const capacity = document.createElement("p");
    capacity.className = "capacity";
    capacity.textContent = event.capacity == null ? "Capacity not specified" : `${event.capacity} spots available in total`;
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const register = makeButton("Register", "button-primary", async () => {
      const userId = localStorage.getItem(USER_KEY);
      if (!userId) {
        message("#events-message", "Enter and save your user UUID above to register.", true);
        $("#user-id").focus();
        location.hash = "identity";
        return;
      }
      register.disabled = true;
      try {
        await request("/api/registrations", {
          method: "POST",
          body: JSON.stringify({ user_id: userId, event_id: event.id }),
        });
        message("#events-message", `You're registered for ${event.title || "this event"}.`);
        register.textContent = "Registered ✓";
      } catch (error) {
        message("#events-message", error.message, true);
        register.disabled = false;
      }
    });
    const roster = makeButton("Attendees", "roster-button", () => {
      $("#attendee-event").value = event.id;
      location.hash = "attendees";
      loadAttendees();
    });
    actions.append(register, roster);
    card.append(top, title, meta, capacity, actions);
    eventList.append(card);
  }
}

async function loadEvents() {
  message("#events-message");
  $("#event-count").textContent = "Loading…";
  try {
    events = await request("/api/events");
    renderEvents();
    const select = $("#attendee-event");
    select.replaceChildren(new Option("Choose an event", ""));
    for (const event of events) select.add(new Option(event.title || event.id, event.id));
  } catch (error) {
    events = [];
    renderEvents();
    message("#events-message", `Could not load events: ${error.message}`, true);
  }
}

function appendRows(target, rows, labelKey, emptyText) {
  target.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty-hint";
    empty.textContent = emptyText;
    target.append(empty);
    return;
  }
  for (const item of rows) {
    const row = document.createElement("div");
    row.className = "ticket-row";
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.event?.title || item[labelKey] || "Registration";
    const id = document.createElement("small");
    id.textContent = `Registration ${item.id || ""}${item.created_at ? ` · ${new Date(item.created_at).toLocaleString()}` : ""}`;
    copy.append(title, id);
    row.append(copy);
    target.append(row);
  }
}

async function loadTickets() {
  const userId = localStorage.getItem(USER_KEY);
  if (!userId) {
    message("#tickets-message", "Enter and save your user UUID above first.", true);
    location.hash = "identity";
    return;
  }
  message("#tickets-message");
  $("#load-tickets").disabled = true;
  try {
    const rows = await request(`/api/me/registrations?user_id=${encodeURIComponent(userId)}`);
    appendRows($("#ticket-list"), rows, "event_id", "No registrations found for this UUID.");
  } catch (error) {
    message("#tickets-message", error.message, true);
  } finally {
    $("#load-tickets").disabled = false;
  }
}

async function loadAttendees() {
  const eventId = $("#attendee-event").value;
  if (!eventId) {
    message("#attendees-message", "Choose an event first.", true);
    return;
  }
  message("#attendees-message");
  $("#load-attendees").disabled = true;
  try {
    const rows = await request(`/api/events/${encodeURIComponent(eventId)}/registrations`);
    appendRows($("#attendee-list"), rows, "user_id", "No attendees registered yet.");
    message("#attendees-message", `${rows.length} ${rows.length === 1 ? "attendee" : "attendees"}`);
  } catch (error) {
    message("#attendees-message", error.message, true);
  } finally {
    $("#load-attendees").disabled = false;
  }
}

$("#identity-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = $("#user-id").value.trim();
  if (!value) return message("#events-message", "Enter your user UUID.", true);
  localStorage.setItem(USER_KEY, value);
  message("#events-message", "User UUID saved in this browser.");
});
$("#event-search").addEventListener("input", renderEvents);
$("#refresh-events").addEventListener("click", loadEvents);
$("#load-tickets").addEventListener("click", loadTickets);
$("#load-attendees").addEventListener("click", loadAttendees);
loadSavedUser();
loadEvents();
