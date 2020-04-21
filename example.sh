# create a user/attendee
curl -d '{"name":"Jon", "email": "on@example.org", "dob": "2000-01-01"}' -H "Content-Type: application/json" -X POST http://localhost:3000/attendee/create

curl -d '{
    "name":"Jon", "email": "on@example.org", "dob": "2000-01-01"
}' -H "Content-Type: application/json" -X POST http://localhost:3000/attendee/create


# create an event
curl -d '{"title":"test event 2", "description": "Test", "time": "2000-01-01 18:00:00", "address": {"line1": "1 test st", "line2": "asdasd", "city": "Manchester", "county": "", "country": "UK", "postal_code": "M1 1AA"}}' -H "Content-Type: application/json" -X POST http://localhost:3000/event/create

curl -d '{
    "title":"test event 2", "description": "Test", "time": "2000-01-01 18:00:00", 
    "address": {
        "line1": "1 test st", "line2": "asdasd", "city": "Manchester",
        "county": "", "country": "UK", "postal_code": "M1 1AA"
     }
 }' -H "Content-Type: application/json" -X POST http://localhost:3000/event/create

# add attendee 1 to event id:1
curl -d '{"id": 1}' -H "Content-Type: application/json" -X POST http://localhost:3000/attendee/1

# list attendee id: 1 and their events
curl http://127.0.0.1:3000/attendee/1

# delete event id:2 (attendees automaticall removed)
 curl -X "DELETE" 127.0.0.1:3000/event/2

# remove attendee  id:1  from event id:2
curl -X "DELETE" 127.0.0.1:3000/attendee/1/2