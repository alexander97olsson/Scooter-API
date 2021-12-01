# Scooter API

Installation/documentation of API.
This is the backend and server repo for el sparkcyklar.

GitHub repo is published at:

* https://github.com/alexander97olsson/Scooter-API

Documentation:

* https://docs.google.com/document/d/1b51lAyhmb2n8YFrUnwgyALpxFJhnjb_DBkPGWEBg-E0/edit?usp=sharing

Download:

Link to download docker-compose file
* https://drive.google.com/file/d/1HF4-U0y4tyz2WUOb70xgQZYhkOj-NslV/view?usp=sharing

The server will run on localhost:1337.
Route localhost:1337 will print {"data":{"msg":"Hello world, version ***"}}
If you get that you know its working, you can check which version the program is in with
the same route (version ***).

Start:
```
    docker-compose up -d server
```
End:
```
    docker-compose down
```
