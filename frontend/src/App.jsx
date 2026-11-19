import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "https://abc-gnu.onrender.com").replace(/\/$/, "");
const USER_STORAGE_KEY = "unipulse-user-id";

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      {action}
    </div>
  );
}

function Notice({ children, error = false, onClose }) {
  if (!children) return null;
  return <div className={`notice${error ? " notice-error" : ""}`} role="status">
    <span>{children}</span>{onClose && <button aria-label="Dismiss message" onClick={onClose}>×</button>}
  </div>;
}

function EventCard({ event, onRegister, onAttendees, userId }) {
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);
  const register = async () => {
    if (!userId) {
      document.getElementById("user-id")?.focus();
      document.getElementById("identity")?.scrollIntoView({ behavior: "smooth" });
      onRegister("Enter and save your user UUID above before registering.", true);
      return;
    }
    setBusy(true);
    try {
      await api("/api/registrations", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, event_id: event.id }),
      });
      setRegistered(true);
      onRegister(`You're registered for ${event.title || "this event"}.`);
    } catch (error) {
      onRegister(error.message, true);
    } finally {
      setBusy(false);
    }
  };
  return <article className="event-card">
    <div className="card-top"><span className="pill">{event.status || "event"}</span><span className="card-id" title={event.id}>{event.id}</span></div>
    <h3>{event.title || "Untitled event"}</h3>
    <p className="event-meta">{[event.category, event.venue].filter(Boolean).join(" · ") || "Campus event"}</p>
    <p className="capacity">{event.capacity == null ? "Capacity not specified" : `${event.capacity} seats`}</p>
    <div className="card-actions">
      <button className="button button-primary" disabled={busy || registered} onClick={register}>{busy ? "Registering…" : registered ? "Registered ✓" : "Register"}</button>
      <button className="button button-quiet" onClick={() => onAttendees(event)}>Attendees</button>
    </div>
  </article>;
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState(() => localStorage.getItem(USER_STORAGE_KEY) || "");
  const [userDraft, setUserDraft] = useState(() => localStorage.getItem(USER_STORAGE_KEY) || "");
  const [notice, setNotice] = useState({ text: "", error: false });
  const [tickets, setTickets] = useState([]);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketError, setTicketError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoaded, setAttendeesLoaded] = useState(false);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [attendeeError, setAttendeeError] = useState("");

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError("");
    try {
      const result = await api("/api/events");
      setEvents(Array.isArray(result) ? result : []);
    } catch (error) {
      setEventsError(error.message);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const visibleEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) => `${event.title || ""} ${event.status || ""} ${event.category || ""} ${event.venue || ""}`.toLowerCase().includes(term));
  }, [events, search]);

  const saveUserId = (event) => {
    event.preventDefault();
    const value = userDraft.trim();
    if (!value) {
      setNotice({ text: "Enter your existing user UUID.", error: true });
      return;
    }
    localStorage.setItem(USER_STORAGE_KEY, value);
    setUserId(value);
    setTickets([]);
    setTicketsLoaded(false);
    setNotice({ text: "User UUID saved in this browser. No account or login was created.", error: false });
  };

  const loadTickets = async () => {
    if (!userId) {
      setNotice({ text: "Save your user UUID above to view registrations.", error: true });
      document.getElementById("identity")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setTicketsLoading(true);
    setTicketError("");
    try {
      const result = await api(`/api/me/registrations?user_id=${encodeURIComponent(userId)}`);
      setTickets(Array.isArray(result) ? result : []);
      setTicketsLoaded(true);
    } catch (error) {
      setTicketError(error.message);
    } finally {
      setTicketsLoading(false);
    }
  };

  const loadAttendees = async (eventId = selectedEvent) => {
    if (!eventId) {
      setAttendeeError("Choose an event first.");
      return;
    }
    setSelectedEvent(eventId);
    setAttendeesLoading(true);
    setAttendeeError("");
    setAttendeesLoaded(false);
    try {
      const result = await api(`/api/events/${encodeURIComponent(eventId)}/registrations`);
      setAttendees(Array.isArray(result) ? result : []);
      setAttendeesLoaded(true);
      document.getElementById("attendees")?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      setAttendeeError(error.message);
    } finally {
      setAttendeesLoading(false);
    }
  };

  const setUserNotice = (text, error = false) => setNotice({ text, error });
  const selectedEventName = events.find((event) => event.id === selectedEvent)?.title || "Selected event";

  return <>
    <header className="topbar">
      <a className="brand" href="#home"><span className="brand-mark">✳</span><span>Uni<span>Pulse</span></span></a>
      <nav aria-label="Main navigation"><a href="#events">Explore</a><a href="#tickets">My registrations</a></nav>
      <a className="account-link" href="#identity">Set user ID <span aria-hidden="true">↗</span></a>
    </header>

    <main id="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> CAMPUS, IN THE MOMENT</p>
          <h1>Find your<br /><span>next thing.</span></h1>
          <p className="hero-text">The talks, shows, meetups and late nights happening around campus.</p>
          <a className="button button-primary" href="#events">Explore events <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="orb orb-one" /><div className="orb orb-two" /><div className="hero-note"><span>YOUR CAMPUS</span><strong>is alive.</strong><small>Find your people out there.</small></div><span className="spark spark-a">✳</span><span className="spark spark-b">✦</span></div>
      </section>

      <section className="identity-bar" id="identity">
        <div><p className="eyebrow">REGISTRATION ID</p><p>Use an existing user UUID to register and view tickets. This app has no login.</p></div>
        <form className="identity-form" onSubmit={saveUserId}><label className="sr-only" htmlFor="user-id">User UUID</label><input id="user-id" value={userDraft} onChange={(event) => setUserDraft(event.target.value)} placeholder="Paste your user UUID" autoComplete="off" /><button className="button button-secondary">Save ID</button></form>
      </section>
      <Notice error={notice.error} onClose={() => setNotice({ text: "", error: false })}>{notice.text}</Notice>

      <section className="section" id="events">
        <SectionHeading eyebrow="WHAT'S HAPPENING" title="Upcoming events" action={<button className="text-button" onClick={loadEvents} disabled={eventsLoading}>{eventsLoading ? "Loading…" : "Refresh ↻"}</button>} />
        <div className="toolbar"><label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events" aria-label="Search events" /></label><span className="result-count">{eventsLoading ? "Loading…" : `${visibleEvents.length} ${visibleEvents.length === 1 ? "event" : "events"}`}</span></div>
        {eventsError && <Notice error>{`Could not load events: ${eventsError}`}</Notice>}
        {!eventsLoading && !eventsError && visibleEvents.length === 0 && <p className="empty-hint">{search ? "No events match your search." : "No events are listed yet."}</p>}
        <div className="event-grid">{visibleEvents.map((event) => <EventCard key={event.id} event={event} userId={userId} onRegister={setUserNotice} onAttendees={(item) => loadAttendees(item.id)} />)}</div>
      </section>

      <section className="section tickets-section" id="tickets">
        <SectionHeading eyebrow="YOUR PLANS" title="My registrations" action={<button className="button button-secondary" onClick={loadTickets} disabled={ticketsLoading}>{ticketsLoading ? "Loading…" : "Load tickets"}</button>} />
        {ticketError && <Notice error>{ticketError}</Notice>}
        <div className="ticket-list">{ticketsLoaded && tickets.length === 0 && <p className="empty-hint">No registrations found for this UUID.</p>}{tickets.map((ticket) => <div className="ticket-row" key={ticket.id}><div><strong>{ticket.event?.title || "Event registration"}</strong><small>Registration {ticket.id}{ticket.created_at ? ` · ${new Date(ticket.created_at).toLocaleString()}` : ""}</small></div><span className="ticket-mark">✓</span></div>)}{!ticketsLoaded && <p className="empty-hint">Save your user UUID, then load your registrations.</p>}</div>
      </section>

      <section className="section attendees-section" id="attendees">
        <SectionHeading eyebrow="OPEN ROSTERS" title="Event attendees" />
        <p className="section-intro">Attendee lists are public. Choose an event to view its registrations.</p>
        <div className="attendee-controls"><label className="sr-only" htmlFor="attendee-event">Select event</label><select id="attendee-event" value={selectedEvent} onChange={(event) => setSelectedEvent(event.target.value)}><option value="">Choose an event</option>{events.map((event) => <option value={event.id} key={event.id}>{event.title || event.id}</option>)}</select><button className="button button-secondary" onClick={() => loadAttendees()} disabled={attendeesLoading}>{attendeesLoading ? "Loading…" : "View attendees"}</button></div>
        {attendeeError && <Notice error>{attendeeError}</Notice>}
        {attendeesLoaded && <><p className="roster-count">{attendees.length} {attendees.length === 1 ? "attendee" : "attendees"} · {selectedEventName}</p><div className="ticket-list">{attendees.length === 0 && <p className="empty-hint">No attendees registered yet.</p>}{attendees.map((item) => <div className="ticket-row" key={item.id}><div><strong>Registered attendee</strong><small>User ID {item.user_id}{item.created_at ? ` · ${new Date(item.created_at).toLocaleString()}` : ""}</small></div></div>)}</div></>}
      </section>
    </main>
    <footer><a className="brand" href="#home"><span className="brand-mark">✳</span><span>Uni<span>Pulse</span></span></a><p>Make a little room for something new.</p><a href={`${API_BASE}/`} target="_blank" rel="noreferrer">API status ↗</a></footer>
  </>;
}
