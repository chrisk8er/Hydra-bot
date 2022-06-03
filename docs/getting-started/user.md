# Example Postman
Use Postman to test routes!
[Postman example](https://github.com/jonalan7/Hydra-bot/blob/master/Postman/postman_collection.json)
[Download Postman](https://www.postman.com/downloads/)

### List of routes for managing whatsapp: 

All whatsapp connection wheels have a pattern of `Headers` of user.
The headers must be parameterized as :

```json
{
    "Content-Type" : "application/json",
    "user" : "user",
    "user_pass" : "user"
}
```

# Using Webhook

if you want to receive a callback on a specific url, pass the url parameter in the connect route.

| Type | Route to browser | Description                    | Body                                             |
|------|------------------|--------------------------------|--------------------------------------------------|
| POST | `/connect`       | Start connection with Whatsapp | `{ "url": "http://localhost:8080/webhooktest" }` |
| POST | `/sendtext`      | Send a text to a number        | `{ "to": "contact number", "body": "message"}`   |