<h1>Ticketing Application</h1>

This application is created with NodeJS Version 22.16.0, before installing please ensure that you have the same node js version. <br>
**Back End**
For the Backend it use .env in order to map the supabase key.<br>
Also it use express package to host the applications. <br>
the Default port is set to 3001 for back end, once you clone the project, please go to the path : **your_clone_path**/ticketing-takehome/backend/ run **npm install** in order to install all the packages.<br>
once the npm install is done, you can run **npm run dev** to start the back end with port 3001 (it's set in the .env file). <br>
<br>
**Back End Note**<br>
If the port is already used in you local machine, you can change the port on the **.ENV** file with **PORT** tag.<br>
The .env file will be share in private message to to set it up please just copy the **.env** file to the root of the backend project (sample path: **your_clone_path**/ticketing-takehome/backend/)

<br>
<br>
**Front End**<br>
The front end using nextjs 15 and with the help of shadcn framework as the ui base line, the reason why using shadcn, because it has many plug and play component ready that require minimum adjustment, and also the using shadcn we only import what we need to the projects.<br>
and also using react-table component for stateless to fetch the data after a change of the data without calling the API again.<br>