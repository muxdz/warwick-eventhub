## Browser
This is what will be used to to load and execute our frontend application.

Our web technologies should be handled by the browser itself.

## Frontend
This is the code used to display the information to the user.

This involves rendering the events and displaying the details to the user.

Creating the forms that users will have to fill when signing up or loging in. From this, also collecting the user's input such as clicks and keyboard inputs.

Communicating to the backend using APIs.

Also communicating to the user any validation/errors as well as loading screens when connection is slow.

## Backend
We process all inputs from the user using the backend.

This will include receiving the user input, validating it to ensure we find the right information required, as well as a level of security.

For protected operations, the backend will verify the user's
identity and check whether they have permission to perform the action.

Performing business logic and reading and writing to the database.

Finally, the backend will need to return a response to the frontend so that the user is able to get their feedback.

## Database
We store some possible information such as user account data and event data in the database that we can retrieve as we see find.

Larger files may be stored elsewhere, whilst the database simply points to it via a URL or key.

Passwords will always be stored in hash form to ensure proper security.


## Request Flow

1. The browser loads and runs the frontend application.
2. The frontend sends HTTP requests to the FastAPI backend.
3. The backend validates the request and performs the required logic.
4. When persistent data is required, the backend reads from or writes to PostgreSQL.
5. PostgreSQL returns the relevant data to the backend.
6. FastAPI sends an HTTP response, normally containing JSON, to the frontend.
7. The frontend updates the interface displayed in the browser.