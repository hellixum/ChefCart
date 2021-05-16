# ChefCart
## ENVIRONMET VARIABLES

PORT  // this is the port for server
DB_HOST  // database host 
DB_NAME  // database name
DB_USER  // database user 
DB_PASS  // data base password (leave empty if unnecessory error occurs)

REFREE_TABLE  // table name of refree's  ( table where data of refree's are stored)
LEADS_TABLE   // table name of leads ( table where data for leads are stored)

ADMIN_PASS   // password for admin to access admin APIs (admin has privelege to see all the data , give rewards, adn change status etc)
PASS_KEY     // secret key for hashing the passwords

## APIs for admin


1. /api/admin/createTable  // GET api for creating the table in database
2. /admin/login       // POST api for login in to the admin panel
3. /admin/getUsers    // GET api for fetching all the Refrees in the app
4. /admin/getLeads    // GET api for fetching all teh leads given by a refree 
5. /admin/reward      // PUT api for giving reward to a lead and hence to a refree
6. /admin/status      // PUT api for changing status of a lead


## APIs for refree's
1. /ref/login  // POST api for logging in 
2. /ref/signup  // POST api for signing in 
3. /ref/leads   // GET api for fetching all the leads refered by the user
4. /ref/addLead // PUT api for adding a new lead
