# Virtual Pet Adoption Center

A full-stack web application that simulates a virtual pet adoption center where users can manage adoptable pets. Built with Node.js for the backend and React.js for the frontend.

## Features

- **Pet Management**: Create, view, update, and delete virtual pets
- **Dynamic Pet Moods**: Pet moods change based on time in the system
- **Adoption System**: Mark pets as adopted with adoption dates
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Mood Filtering**: Filter pets by their current mood

## Tech Stack

### Backend
- Node.js
- Express.js
- RESTful API architecture

### Frontend
- React.js
- React Hooks
- Modern CSS (TailwindCSS/Bootstrap)

## Installation

### Prerequisites
- Node.js (v16.x or above)
- npm (v8.x or above)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/virtual-pet-adoption-center.git
   cd virtual-pet-adoption-center
   ```

2. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Install dependencies
   npm install
   
   # Start the server
   npm start
   
   # For development with auto-restart
   npm run dev
   ```
   
   The backend server will run on http://localhost:5000

3. **Frontend Setup**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm start
   ```
   
   The frontend development server will run on http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pets` | Get all pets |
| GET | `/pets/:id` | Get a specific pet |
| POST | `/pets` | Create a new pet |
| PUT | `/pets/:id` | Update a pet's details |
| PATCH | `/pets/:id/adopt` | Mark a pet as adopted |
| DELETE | `/pets/:id` | Delete a pet |
| GET | `/pets/filter?mood=<mood>` | Filter pets by mood |

## Project Structure

### Backend Structure
```
/backend
├── app.js            # Main application file
├── server.js         # Server setup
├── /routes           # API routes
│   └── petRoutes.js
├── /controllers      # Business logic
│   └── petController.js
├── /models           # Data models
│   └── petModel.js
├── /services         # Service layer
│   └── petService.js
└── /utils            # Utility functions
    └── moodLogic.js
```

### Frontend Structure
```
/frontend
├── public/           # Static assets
├── src/
│   ├── App.js        # Main component
│   ├── index.js      # Entry point
│   ├── /components
│   │   ├── PetList.js
│   │   ├── PetCard.js
│   │   ├── AddPetForm.js
│   │   └── FilterBar.js
│   ├── /pages
│   │   └── HomePage.js
│   ├── /services
│   │   └── api.js    # API calls
│   ├── /styles
│   │   └── global.css
│   └── /utils
│       └── helpers.js
```

## Usage

1. **Adding a New Pet**
   - Navigate to the Add Pet form
   - Fill in the pet's details (name, species, age, personality)
   - Submit the form to create a new pet in the system

2. **Viewing Pets**
   - Browse the homepage to see all available pets
   - Each pet card shows the pet's details and current mood
   - Use the filter bar to show pets with specific moods

3. **Adopting a Pet**
   - Click the "Adopt" button on a pet's card
   - The pet will be marked as adopted with the current date

4. **Updating Pet Information**
   - Click "Edit" on a pet's card to modify its details
   - Submit the updated information

5. **Removing a Pet**
   - Click "Delete" on a pet's card to remove it from the system

## Pet Mood System

Pets' moods change based on how long they've been in the system:
- Less than 1 day: **Happy**
- 1-3 days: **Excited**
- More than 3 days: **Sad**

## Future Enhancements

- Pet Personality Quiz to match users with compatible pets
- Downloadable Adoption Certificates
- Mood change notifications
- Interactive animations for pet activities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Created as part of a weekend coding assignment
