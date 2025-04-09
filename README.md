# Watt's Up? – Smart Energy Usage Estimator

Watt's Up? is an interactive energy usage estimator that helps you understand and manage your household energy consumption. By allowing users to input data for common appliances and their usage patterns, Watt's Up? performs order-of-magnitude estimates to calculate daily energy usage and compares it to national averages. The app also provides practical energy-saving tips and insights to empower users with a scientific approach to energy efficiency. Built with React and styled using Tailwind CSS, the project demonstrates how everyday science can inform sustainable energy practices.

## Getting Started

This project was bootstrapped with Create React App. Follow the steps below to set up the project on your local machine.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (preferably version 18.x LTS for compatibility).
- **npm**: Comes bundled with Node.js.
- **Git**: For version control and pushing to GitHub.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mgulati3/Watt-s-Up.git
   cd Watt-s-Up
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

### Development

To run the app in development mode, use the following command. (If using Node 20 or later, the legacy OpenSSL setting is required.)

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application. The page will reload with any code changes, and you can view lint errors or warnings in the console.

### Production Build

To create an optimized production build:

```bash
npm run build
```

This command uses the legacy OpenSSL provider via:

```json
"build": "NODE_OPTIONS=--openssl-legacy-provider react-scripts build"
```

The build artifacts will be stored in the `build` folder. You can serve it locally with:

```bash
npm install -g serve
npx serve -s build
```

### Deployment

Watt's Up? can be deployed on hosting platforms like Netlify. After pushing your code to GitHub, connect your repository to Netlify and set the following build settings:

- **Build command**: `npm run build`
- **Publish directory**: `build`

For detailed instructions, see the [Create React App deployment guide](https://create-react-app.dev/docs/deployment/).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page reloads on changes, and lint errors can be seen in the console.

### `npm test`

Launches the test runner in the interactive watch mode. See the section about running tests for more information.

### `npm run build`

Builds the app for production to the `build` folder. It optimizes your app for the best performance, minifies the code, and includes hashed filenames. See the deployment section for more information.

### `npm run eject`

**Note**: This is a one-way operation. Once you eject, you cannot go back! This command copies all configuration files and transitive dependencies (Webpack, Babel, ESLint, etc.) into your project, giving you full control over them. All commands except eject will still work, but they will now reference the locally copied scripts.

## Learn More

To learn more about the technologies used in this project:

- [Create React App Documentation](https://create-react-app.dev/docs/getting-started/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
