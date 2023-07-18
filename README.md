# CodeSpace

The CodeSpace API allows users to execute and manage code snippets in different programming languages. Users can register, authenticate, and execute code in languages such as Python, C, C++, JavaScript, and PHP. The API provides endpoints for code execution, code management, user authentication, and registration.

## Technologies Used

The Code Runner API is built using the following technologies:

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt.js
- JWT

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nabeel-w/judge0-api-clone/
   ```
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   
   - Create a `.env` file based on the provided `.env.example` file.
   - Provide the necessary environment variables in the `.env` file, such as `PORT` for the server port and `JWT_SECRET` for the JWT secret key.

4. Start the server:

   ```bash
   node index.js
   ```

   The server will start running on the specified port or the default port 5000.

## API Documentation

For detailed information about the available API endpoints, please refer to the [API Documentation](API-Docs.md) file.

## Contributing

Contributions to the Code Runner API are welcome! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

The Code Runner API is licensed under the **MIT License**.


