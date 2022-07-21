# Health booking
Service for booking an appointment with the doctors of the polyclinic/hospital.
Every day, no more than 3 people can book up to see a doctor, regardless of his profile.
Registration opens every day at midnight.

## Features 
- creation of users with the help of registration
- created doctors by backend command
- authorization
- changing user and doctor information
- pagination of free doctors
- free doctor appointment
- doctors status update at midnight
- writed test case for authorization and users services

## Doctors creation 
For creation doctor application must be built and can be running. 
Doctors is creation only on project cli. So go to the root and input 
`npm run create-doctor $doctor_email $password $doctor_specialization`.
After it doctor can login on service. 

## Testing 
For test application input `npm run test:e2e`. 


## Instalation 
 - clone the repository
 - ```сd time-shot```
 - ```npm ci```
 - create an ```.env``` file copy and completely fill in the content from the ```.env.example``` file
 - ```npm run start:dev```
