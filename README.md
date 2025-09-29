<h1>Ticketing Application</h1>


## Testing User 
for testing with admin use this account:<br>
- Username: **test@admin.com**
- Password: **Admin@123**<br>
for user role, you can sign up directly from the applications.<br>
<br>
To close the running app you can push ctrl+c or ctrl+z <br>
<br>
<br>
This application is created with **NodeJS Version 22.16.0**, before installing **please ensure that you have the same node js version**. <br>
**Back End**
For the Backend it use .env in order to map the supabase key.<br>
Also it use express package to host the applications. <br>
the Default port is set to 3001 for back end, once you clone the project, please go to the path : **your_clone_path**/ticketing-takehome/backend/ run **npm install** in order to install all the packages.<br>
once the npm install is done, you can run **npm run dev** to start the back end with port 3001 (it's set in the .env file). <br>
<br>
**Back End Note**<br>
If the port is already used in you local machine, you can change the port on the **.ENV** file with **PORT** tag.<br>
if The .env file is not cloned, please let me know. I will be share in private message to to set it up please just copy the **.env** file to the root of the backend project (sample path: **your_clone_path**/ticketing-takehome/backend/)

<br>
<br>

**Front End** <br>
The front end using nextjs 15 and with the help of shadcn framework as the ui base line, the reason why using shadcn, because it has many plug and play component ready that require minimum adjustment, and also the using shadcn we only import what we need to the projects.<br>
and also using react-table component for stateless to fetch the data after a change of the data without calling the API again.<br>
if The .env file is not cloned, please let me know. I will be share in private message to to set it up please just copy the **.env.local** file to the root of the frontend project 
<br>
## Installation
<br>
Clone the repository:<br>
<br>
```bash<br>
git clone https://github.com/your-username/ticket-takehome.git<br>
cd ticket-takehome<br>
<br>
Dependencies Installation :<br>
Run this command below :<br>
npm run install:all<br>
<br>
Run the project :<br>
Run this command below :<br>
npm run dev:all<br>

## Techstack Details 
### Frontend
- **Next.js 15** – React framework for server-side rendering & routing.
- **React 19** – Latest React for building UI.
- **TailwindCSS 4** – Utility-first styling framework.
- **Radix UI** – Accessible UI primitives.
- **ShadCN Components** – Headless, customizable UI components.
- **TanStack Query & Table** – Data fetching + table management.
- **Supabase** – Authentication & database (Postgres).
- **Zod** – Schema validation.
- **React Hook Form** – Form handling.
- **Axios** – API calls.
- **React Hot Toast** – Toast notifications.

### Backend
- **Supabase SSR & Supabase-js** – Database connection & server-side rendering helpers.
- **Express.js (or custom)** – API endpoints.
- **TypeScript** – Strict typing support.
- **cors** – for cross origin allowed.


## Tutorial for New Laptop Setup
<br>
- Install Node.js 20+<br>
- Clone this repo → git clone https://github.com/dhiazrionaldo/ticket-takehome.git<br>
- Go into folder → cd ticket-takehome<br>
- Install dependencies → npm run install:all<br>
- Set up environment variables:<br>
- backend/.env<br>
- frontend/.env.local<br>
- Run project → npm run dev<br>
<br>
<br>

## Access app:
- Backend API → http://localhost:3001 (example)<br>
- Frontend → http://localhost:3000<br>

###  `package.json` (root)
```json
{
  "scripts": {
    "install:all": "npm install --prefix frontend && npm install --prefix backend",
    "dev:frontend": "npm run dev --prefix frontend",
    "dev:backend": "npm run dev --prefix backend",
    "dev:all": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\""
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
