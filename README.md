
# My-Hairstyles

A full-stack web application for a hair salon, offering online booking, contact forms, service management, and admin functionalities. Built using **React**, **Vite**, **Tailwind CSS**, **Express**, and **MongoDB**.

## 📖 Overview

This project aims to streamline salon operations by providing a user-friendly interface for customers and an efficient dashboard for administrators. Users can view services, book appointments, contact the salon, and browse galleries, while admins can manage bookings, feedback, and user accounts.

## 🛠 Technologies Used

### Frontend
- React.js (with Vite)
- Tailwind CSS
- Axios (for API requests)
- React Router for navigation
- Form validation and UI feedback

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT-based authentication
- Nodemailer for email notifications
- Environment-based configuration

### Tools & Configurations
- Vercel for frontend deployment
- MongoDB Atlas for database storage
- Cloudinary or similar for image storage (optional)
- dotenv for environment variables

## 📂 Project Structure

```
My-Hairstyles/
├── BACKEND/            # Express server, API routes, models, middleware
├── FRONTEND/           # React frontend with pages, components, and styling
├── .gitignore
├── README.md
```

## 🚀 Features

### User Features
- Browse salon services and gallery
- Book appointments with date/time selection
- Submit feedback and contact requests
- Responsive and visually appealing UI

### Admin Features
- Manage bookings and view user details
- Access feedback and contact messages
- Admin login and registration
- Secure API endpoints

## 📥 Installation

### Backend Setup
1. Navigate to the `BACKEND` directory:
   ```bash
   cd BACKEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```
4. Run the server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the `FRONTEND` directory:
   ```bash
   cd FRONTEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file if needed for API URLs:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📦 Deployment

- **Frontend** can be deployed using Vercel.
- **Backend** can be deployed using Render, Heroku, or any cloud provider.
- Make sure to secure environment variables and configure proper CORS settings.

## 🔑 Security Considerations

- Protect sensitive routes with JWT authentication.
- Validate user input on both frontend and backend.
- Use environment variables for secrets and database credentials.

## 📂 Future Improvements

- Add payment gateway integration
- Implement advanced role-based access control
- Enhance UI/UX with animations and accessibility features
- Expand service management options

## 📧 Contact

For any inquiries or feedback, please open an issue or contact the project maintainer.

