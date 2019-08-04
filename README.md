
## INITIALIZATION
Step 1. Create a new schema in the database
Step 2. Update database credientials in the *config.json* under developement key, Please find this file under config directory
Step 3. And finally, In the project directory, you need to run:

// to install dependancies
### `npm install` 

// For db migrations (It will create tables in the database)
### `npx sequelize-cli db:migrate`

// Finally to run your server
### `node index.js` 

Runs the app in the development mode.<br>
http://localhost:8080/api