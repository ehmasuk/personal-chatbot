# Personal AI Chatbot

This project showcases a personal chatbot application developed using Next.js and Tailwind CSS. The chatbot leverages OpenAI's GPT-3.5-turbo model to provide interactive and dynamic responses to user inputs.

## Features

- **Admin dashboard** : Admin can create chatbots and train them with personal data
- **Multiple chatbots**: Admin can create multiple chatbots with different data
- **Instructions**: Admin can mention bot's role from dashboard
- **Training with personal data**: Admin can train bot's with personal information and bot can response according to personalized data
- **Seamless Integration**: Easily integrates into various platforms for versatile use.​
- **Scalable Architecture**: Built to handle increasing user demands efficiently.​

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **OpenAI GPT-3.5-turbo**: An advanced language model for natural language understanding and generation.

## Project Structure

- **`app/`**: Contains the main application components and pages.
- **`components/`**: Reusable UI components.
- **`helpers/`**: Utility functions and helpers.
- **`hooks/`**: Custom React hooks.
- **`public/`**: Static assets like images and fonts.

## Setup and Installation

To run this project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ehmasuk/personal-chatbot.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd personal-chatbot
   ```

3. **Install dependencies**:

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

4. **Set up environment variables**:

   - Rename the `example.env` file to `.env`.
   - Add your OpenAI API key and other necessary configurations to the `.env` file.

5. **Run the development server**:

   Using npm:

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Deployment

The application can be deployed on platforms like Vercel for seamless integration with Next.js projects. Ensure that all environment variables are correctly set up in the deployment environment.

## Acknowledgements

- **OpenAI**: For providing the GPT-3.5-turbo model used in the chatbot.
- **Vercel**: For offering an excellent platform to deploy Next.js applications.
- **Tailwind CSS**: For simplifying the styling process with utility-first CSS.

_Note: This project is intended for personal use and documentation purposes only. It is not designed for public use or contributions._
