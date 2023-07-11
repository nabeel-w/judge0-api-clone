1. **Authentication Routes**

**POST /auth**

- Endpoint for user authentication.
- Request Body Parameters:
  - `email` (string, required): Email of the user.
  - `password` (string, required): Password of the user.
- Response:
  - Status 200: Successful authentication. Returns a JWT token in the response body.
  - Status 401: Wrong credentials. Authentication failed.
  - Status 404: User not found.

**POST /auth/new**

- Endpoint for user registration.
- Request Body Parameters:
  - `uname` (string, required): Name of the user.
  - `email` (string, required): Email of the user.
  - `password` (string, required): Password of the user.
- Response:
  - Status 200: User created successfully.
  - Status 409: Email already in use.

2. **Code Execution Routes**

**GET /code**

- Endpoint to retrieve all codes associated with the authenticated user.
- Authentication required (JWT token in the request header).
- Response:
  - Status 200: Returns an array of user codes.
  - Status 200 (Empty Response): No code found.

**POST /code/python**

- Endpoint to execute Python code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `ucode` (string, required): The Python code to execute.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Execution successful. Returns the output of the code execution.
  - Status 500: Execution error occurred.

**POST /code/c**

- Endpoint to execute C code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `ucode` (string, required): The C code to execute.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Execution successful. Returns the output of the code execution.
  - Status 500: Execution error occurred.

**POST /code/cpp**

- Endpoint to execute C++ code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `ucode` (string, required): The C++ code to execute.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Execution successful. Returns the output of the code execution.
  - Status 500: Execution error occurred.

**POST /code/js**

- Endpoint to execute JavaScript code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `ucode` (string, required): The JavaScript code to execute.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Execution successful. Returns the output of the code execution.
  - Status 500: Execution error occurred.

**POST /code/php**

- Endpoint to execute PHP code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `ucode` (string, required): The PHP code to execute.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Execution successful. Returns the output of the code execution.
  - Status 500: Execution error occurred.

**PATCH /code/python**

- Endpoint to update Python code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `code_id` (string, required): ID of the code to update.
  - `ucode` (string, required): The updated Python code.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Update successful. Returns the output of the updated code execution.
  - Status 404: Code object not found.
  - Status 500: Execution error occurred.

**PATCH /code/c**

- Endpoint to update C code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `code_id` (string, required): ID of the code to update.
  - `ucode` (string, required): The updated C code.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Update successful. Returns the output of the updated code execution.
  - Status 404: Code object not found.
  - Status 500: Execution error occurred.

**PATCH /code/cpp**

- Endpoint to update C++ code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `code_id` (string, required): ID of the code to update.
  - `ucode` (string, required): The updated C++ code.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Update successful. Returns the output of the updated code execution.
  - Status 404: Code object not found.
  - Status 500: Execution error occurred.

**PATCH /code/js**

- Endpoint to update JavaScript code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `code_id` (string, required): ID of the code to update.
  - `ucode` (string, required): The updated JavaScript code.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Update successful. Returns the output of the updated code execution.
  - Status 404: Code object not found.
  - Status 500: Execution error occurred.

**PATCH /code/php**

- Endpoint to update PHP code.
- Authentication required (JWT token in the request header).
- Request Body Parameters:
  - `code_id` (string, required): ID of the code to update.
  - `ucode` (string, required): The updated PHP code.
  - `args` (array, optional): Command-line arguments for the code.
- Response:
  - Status 200: Update successful. Returns the output of the updated code execution.
  - Status 404: Code object not found.
  - Status 500: Execution error occurred.

**DELETE /code/:id**

- Endpoint to delete a code.
- Authentication required (JWT token in the request header).
- Request Parameter:
  - `id` (string, required): ObjectId of the code to delete.
- Response:
  - Status 200: Deletion successful.
  - Status 404: Code object not found.

Note: The API requires proper authentication using JWT tokens in the request headers for the routes that require authentication.
