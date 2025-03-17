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
- POST /request/send/intersted/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## user/connection
- GET /user/connections
- GET /user/request
- GET /user/feed - Gets you the profiles of other user for UI


Status : ignore(pass) , intersted(like) , accepted ,rejected 
