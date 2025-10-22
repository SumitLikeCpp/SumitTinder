# SumitTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- from these two req we can make it dynamic
- POST /request/send/:status/:userId


- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
- from uppar 2 we can do dynamically
- POST /request/review/:status/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets the profiles of other users on platform



Status: ignore , intrested, accepted,rejected