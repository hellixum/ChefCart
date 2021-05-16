# ChefCart
## npm install 
## npm run start


## ENVIRONMET VARIABLES
|VARIABLE NAME | VALUE TO STORE |
|-------|-------------------------------|
|PORT  | this is the port for server|
|DB_HOST | database host |
|DB_NAME | database name|
|DB_USER | database user | 
|DB_PASS | data base password (leave empty if unnecessory error occurs)| 
|REFREE_TABLE | table name of refree's  ( table where data of refree's are stored)| 
|LEADS_TABLE  | table name of leads ( table where data for leads are stored)| 
|ADMIN_PASS  | password for admin to access admin APIs (admin has privelege to see all the data , give rewards, adn change status etc)| 
|PASS_KEY    | secret key for hashing the passwords| 

## APIs for admin


1. /api/admin/createTable     (GET api for creating the table in database) 
2. /admin/login          (POST api for login in to the admin panel)
  REQUEST
  ``` 
    { "password" : "adminPassword" }
  ```

3. /admin/getUsers       (GET api for fetching all the Refrees in the app)
4. /admin/getLeads       (GET api for fetching all teh leads given by a refree )
  email -> email of refree
  REQUEST 
  ```
    {
    "email" : "adarshprakashpandey@gmail.com"
    }
  ```
5. /admin/reward         (PUT api for giving reward to a lead and hence to a refree)
  id -> id of lead, reward -> reward given to lead hence to refree
  REQUEST
  ```
    {
    "id" : "45", 
    "reward" : "78"
    }
  ```
6. /admin/status         (PUT api for changing status of a lead)
    id -> id of lead, status -> updated status of lead
    REQUEST
    ```
      {
      "id" : "45", 
      "status" : "junk"
      }
    ```


## APIs for refree's
1. /ref/login  // POST api for logging in 
  email -> email of user, password -> password of user
  REQUEST
  ```
    { 
    "email" : "sankalppandey45@gmail.com", 
    "password" : "1234567"
    }
  ```
  
  RESPONSE 
  ```
    {
      "jwt" : "some jwt token",'
      "message" : "Logged in Successfully"
    }
  ```

2. /ref/signup  // POST api for signing in 
    
    REQUEST
    ```
      { 
      "first_name" : "Anil", 
      "last_name" : "Singh", 
      "email" : "anil@gmail.com", 
      "phone" : "123456789", 
      "password" : "password"
      }
    ```
3. /ref/leads   // GET api for fetching all the leads refered by the user
    
    jwt_token => jwt token assigned while login
    REQUEST
    ```
     authorization header : "jwt jwt_token "
    ```

4. /ref/addLead // PUT api for adding a new lead
    jwt_token => jwt token assigned while login
    REQUEST
    ```
     authorization header : "jwt jwt_token "
     {
        "first_name" : "Anil", 
        "last_name" : "Singh", 
        "phone" : "123456789", 
        "address" : "kahi to rehta hai ye"
     }
    ```
