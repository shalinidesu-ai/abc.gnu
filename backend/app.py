"""Event Registration API backed by Supabase."""

import os
from uuid import UUID

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from supabase import Client, create_client

load_dotenv()

app = Flask(__name__)

# Supabase configuration
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY")

supabase: Client | None = None

if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("Supabase client initialized successfully!")
    except Exception as error:
        print("Supabase initialization failed:", error)
else:
    print("Supabase URL or publishable key is missing!")


# Home route
@app.route("/")
def home():
    return jsonify({
        "message": "Event Registration API is running!",
        "status": "success"
    })


# Database connection check
def db():
    if supabase is None:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be configured"
        )
    return supabase


# CORS support
@app.after_request
def allow_cross_origin(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@app.route("/api/<path:_path>", methods=["OPTIONS"])
def cors_preflight(_path):
    return "", 204


def valid_uuid(value):
    try:
        return str(UUID(str(value)))
    except (ValueError, TypeError, AttributeError):
        return None


def db_error(error):
    app.logger.exception("Supabase request failed", exc_info=error)
    return jsonify(error="Database request failed"), 500


# Get all events
@app.get("/api/events")
def list_events():
    try:
        query = db().table("events").select("*")

        if request.args.get("status"):
            query = query.eq("status", request.args["status"])

        organizer_id = request.args.get("organizer_id")

        if organizer_id:
            organizer_id = valid_uuid(organizer_id)
            if not organizer_id:
                return jsonify(error="organizer_id must be a UUID"), 400
            query = query.eq("organizer_id", organizer_id)

        return jsonify(query.execute().data), 200

    except Exception as error:
        return db_error(error)


# Get one event
@app.get("/api/events/<event_id>")
def get_event(event_id):
    event_id = valid_uuid(event_id)

    if not event_id:
        return jsonify(error="event id must be a UUID"), 400

    try:
        response = (
            db().table("events").select("*")
            .eq("id", event_id).limit(1).execute()
        )

        if not response.data:
            return jsonify(error="Event not found"), 404

        return jsonify(response.data[0]), 200

    except Exception as error:
        return db_error(error)


# Create registration
@app.post("/api/registrations")
def create_registration():
    payload = request.get_json(silent=True) or {}

    user_id = valid_uuid(payload.get("user_id"))
    event_id = valid_uuid(payload.get("event_id"))

    if not user_id or not event_id:
        return jsonify(error="Valid user_id and event_id are required"), 400

    try:
        client = db()

        event_response = (
            client.table("events").select("*")
            .eq("id", event_id).limit(1).execute()
        )

        if not event_response.data:
            return jsonify(error="Event not found"), 404

        event = event_response.data[0]

        if event.get("status", "open") not in ("open", "published", "active"):
            return jsonify(error="Event is not open for registration"), 409

        existing = (
            client.table("registrations").select("id")
            .eq("event_id", event_id)
            .eq("user_id", user_id).limit(1).execute()
        )

        if existing.data:
            return jsonify(error="Already registered"), 409

        registrations = (
            client.table("registrations").select("id")
            .eq("event_id", event_id).execute().data
        )

        capacity = event.get("capacity")

        if capacity is not None and len(registrations) >= capacity:
            return jsonify(error="Event is full"), 409

        created = (
            client.table("registrations")
            .insert({"event_id": event_id, "user_id": user_id})
            .execute()
        )

        return jsonify(created.data[0] if created.data else {}), 201

    except Exception as error:
        return db_error(error)


# Get registrations for a user
@app.get("/api/me/registrations")
def my_registrations():
    user_id = valid_uuid(request.args.get("user_id"))

    if not user_id:
        return jsonify(error="Valid user_id is required"), 400

    try:
        client = db()

        registrations = (
            client.table("registrations").select("*")
            .eq("user_id", user_id).execute().data
        )

        result = []

        for registration in registrations:
            event_response = (
                client.table("events").select("*")
                .eq("id", registration["event_id"])
                .limit(1).execute()
            )

            result.append({
                **registration,
                "event": event_response.data[0] if event_response.data else None
            })

        return jsonify(result), 200

    except Exception as error:
        return db_error(error)


# Get event attendees. Public endpoint: this API intentionally has no authn/authz.
@app.get("/api/events/<event_id>/registrations")
def event_registrations(event_id):
    event_id = valid_uuid(event_id)

    if not event_id:
        return jsonify(error="Valid event id is required"), 400

    try:
        client = db()

        event_response = (
            client.table("events").select("*")
            .eq("id", event_id).limit(1).execute()
        )

        if not event_response.data:
            return jsonify(error="Event not found"), 404

        rows = (
            client.table("registrations").select("*")
            .eq("event_id", event_id).execute().data
        )

        return jsonify(rows), 200

    except Exception as error:
        return db_error(error)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
