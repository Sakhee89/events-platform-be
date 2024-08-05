# **Events Platform Backend**

## Summary

This is the backend service for the Events Platform application. It is built with Node.js and Express and is responsible for handling API requests, managing user data, and providing event information.

## <a name="tech-stack">⚙️ Tech Stack:</a>

- TypeScript.js
- Node.js
- Express
- Supertest
- Mongodb
- Stripe

## Installation & Setup

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Sakhee89/events-platform-be
cd events-platform-be
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Register an account with mongodb if you do no have an account here at https://account.mongodb.com/ and follow the instructions on how to deploy your free cluster and create a database (eg.EventsPlatformDB) https://www.mongodb.com/docs/atlas/getting-started/

To begin, create three environment variable files at the root level, and replace the default with your own database.

First environment variable: .env, in this file add the line DATABASE_URL, SUPABASE_URL, SUPABASE_KEY, STRIPE_SECRET_KEY, FRONTEND_URL

Second environment variable: .env.development, in this file add the line DATABASE_URL=<Your_hosted_URL_database>

Third environment variable: .env.production, in this file add the line DATABASE_URL=<Your_hosted_URL_database>

Database example: DATABASE_URL=mongodb+srv://<username>:<password>@sandbox.jadwj.mongodb.net/<databaseName>?retryWrites=true&w=majority

(databaseName is your database you have created on your mongodb setup eg. EventsPlatformDB)

To obtain the other env variables please follow the steps below:

Setup a supabase account (https://supabase.com/), google developer account (https://console.cloud.google.com/) and stripe account (https://dashboard.stripe.com/).

Once the supabase account is set up, create a new project with a project name. Then click on create new project. On the dashboard, click on Authentication on your left, then go to providers, and scroll down to google. Now go to console.cloud.google.com to register and create a new project. Select the created project, and in the search, search calendar api to enable it. Once done, click the OAuth consent screen to the left, select external user type, and then click create. Go down to the authorized domain, and to obtain this, go to the supabase site where there is an redirect URL you can copy and paste into the authorized domain, only add the top level domain. Next, add your email in developer contact information, then press add and continue. Add or remove scopes after, select the email and profile api, then go to the google calendar api and also add this scope, then click update. You should now see the add test users on the test users screen, add your own email, Save and continue. Now go to credentials and create credentials at the top of your screen. Select the create OAuth Client ID, go to Authorised JavaScript Origins and add the authorised origin for example http://localhost:3000 if you are running on local host or the hosted domain. For the Authorized redirect URLs copy the redirect URL from Supabase and paste it in here.

Copy both your client ID and client secret and paste it in Supabase client ID and client secret press the Google enabled and save.
On your home page scroll down and you should be able to find your Project URL and API Key. Copy this and add your SUPABASE_URL and SUPABASE_KEY in your env with these values.

Next, on your stripe account once it's set up go to your dashboard, click Developers, then API keys. Copy the secret key and add this to your STRIPE_SECRET_KEY env variable. Please note that your publishable key and secret key are in test mode until you are signed up with your business details.

**Running the Project**

```bash
npm run start
npm run dev
npm run test
```

Open [http://localhost:3333](http://localhost:3333) in your browser to view the project.

## Versions

This project is currently supported with Node v20.10.0
