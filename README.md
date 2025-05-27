# Risk Matrix Frontend

This project is the frontend for a risk matrix management application, developed with React. It allows administrators and evaluators to manage companies, users, risk matrices, and their associated components.

## Main Features

- **User authentication**: Registration, login, and user verification.
- **Roles**: Support for administrator and evaluator roles.
- **Admin panel**: Management of users, companies, matrices, risks, affected objectives, impacts, probabilities, and affected phases.
- **Evaluator panel**: Viewing and creation of risk matrices, with access restricted by user role.
- **Full CRUD**: For all main system elements.
- **Protected navigation**: Routes protected according to user role.

## Project Structure

- `/src/components`: React components for each functionality (CRUDs, login, panels, etc).
- `/src/styles`: CSS files for application styles.
- `/src/App.js`: Main route configuration.
- `/src/api.js`: Backend API call configuration.

## Installation

1. Clone the repository and enter the frontend folder:
   ```bash
   git clone <repo-url>
   cd matriz/front_matriz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`.

## Available Scripts

- `npm start`: Starts the app in development mode.
- `npm run build`: Builds an optimized production version.
- `npm test`: Runs the tests.
- `npm run eject`: Exposes the React Scripts configuration.

## Main Dependencies

- React
- React Router DOM
- Axios
- Testing Library

## Notes

- The frontend connects to a backend (default: `https://backmatriz-production.up.railway.app`).
- The backend must be configured and running for full functionality.
