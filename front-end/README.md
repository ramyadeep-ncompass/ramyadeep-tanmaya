#PROJECT

Use github email in login page to get your repositories.

How to run
# start server
npm start or npm run start:dev in development
How to test
Install Postman

API endpoints
HTTP route prefix : http://52.65.9.30:5002/user

API endpoints summary
USER Log-in
Route	Method	Description
/login	post	to get access token
Repo
Route	Method	Description
/repositories	GET	read repo (Authentication needed)
POST http://52.65.9.30:5002/user/login
Screenshot: alt text

HTTP Request Body Example
{
    "EMAIL" : "****@gmail.com",
    "PASSWORD" : "****"
}
In place of **** => give ur respective email and password
HTTP Response Body Example
{
    "access_token" : "**************************************************************************"
}
get http://52.65.9.30:5002/user/repositories
Screenshot: alt text

TOKEN
BEARER TOKEN in authorization header

HTTP Request Body Example
Repo details will be fetched after logging in

HTTP Response Body Example
{
    [
       {
            "id": 1,
            "repositoryOwner": "ramyadeep-ncompass",
            "email": "ramyadeep@ncompass.inc",
            "repositoryId": 492276640,
            "repositoryName": "mysql-usecases-solution",
            "repositoryUrl": "https://api.github.com/users/ramyadeep-ncompass/repos",
            "cloneUrl": "https://github.com/ramyadeep-ncompass/mysql-usecases-solution.git",
            "contributorsUrl": "https://api.github.com/repos/ramyadeep-ncompass/mysql-usecases-solution/contributors"
        }
    ]
}