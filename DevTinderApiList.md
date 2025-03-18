# DevTinder Api List

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // forgot password api

## connectionRequestRouter
- POST /request/send/interested/:userId // status = interested/ignored
- POST /request/review/accepted/:requestId  // status = accepted/rejected


## user/connection
- GET /user/connections
- GET /user/request
- GET /user/feed - Gets you the profiles of other user for UI

with pagination in mongodb skip() and limit()
- GET /user/feed?page=1&limit =10 => first 10 user 1-10


Status : ignore(pass) , intersted(like) , accepted ,rejected 
