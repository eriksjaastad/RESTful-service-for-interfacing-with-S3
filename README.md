# RESTful-service-for-interfacing-with-S3
operations:

GET /users

POST /users

GET /users/:user

PUT /users/:user (rename a user and user's bucket)

DELETE /users/:user

GET /user/:user/files

POST /user/:user/files

GET /user/:user/files/:file

PUT /user/:user/files/:file (replace an already existing file, or update it somehow. I'll leave this up to interpretation)

DELETE /user/:user/files (deletes all files. Deleting all users is rather dangerous, so it was left out intentionally. You can include it if you really want)
