# 404-Project-BE

## BETA

https://l81eyc3fja.execute-api.eu-west-2.amazonaws.com/beta

## Current Endpoints

```http
GET /plants
    ?category={category}
    ?search={filters common and botanical names using regex}

GET /plants/{commonName}

GET /users

POST /users
    { username, email }

GET /users/{username}

PATCH /users/{username}
    { username }

GET /users/{username}/plants

POST /users/{username}/plants
    { nickname, commonName }

GET /users/{username}/plants/{nickname}

DELETE /users/{username}/plants/{nickname}

PATCH /users/{username}/plants/{nickname}
    { newNickName }

```
