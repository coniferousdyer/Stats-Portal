<div align="center">

<img style="width: 10vw" src="assets/img/codeforces-logo.png">

# Codeforces Stats Portal

![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

</div>

Welcome to the repository of the Codeforces Stats Portal!

The Stats Portal is a web application that keeps track of the Codeforces statistics of the members of a particular Codeforces organization and allows you to view the relevant analytics through means of data visualization.

View a deployed demo here: https://stats-portal.vercel.app

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png"><br>

## Features

### I. Data Visualization

Interesting analytics for the entire organization are visualized by means of interactive charts and plots. Statistics for an individual user can be visualized as well.

### II. Leaderboards

The leaderboards provide a way of finding out where one stands among other members of the organization, as well as the top members of the organization.

### III. Compare Users

The Stats Portal lets you view the statistics of any number of users in the organization side-by-side to compare them. 2 or more users can be compared at the same time.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png"><br>

## Setup (Development Environment)

Clone the repository and change the working directory to the root directory of the repository.

```bash
cd Stats-Portal
```

### I. Backend (Flask)

1. Change the working directory to the `api` directory.

```bash
cd api
```

2. Set up a virtual environment. For example, if you are using the venv module, you can use the following command to create a virtual environment:

```bash
python3 -m venv <name of virtual environment>
```

You can then activate the virtual environment by running the following command:

```bash
source <name of virtual environment>/bin/activate
```

3. Install the dependencies within the virtual environment.

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the `api` directory. You can use the `.env.template` file as a template using the following command.

```bash
cp .env.template .env
```

You can then fill in the required values in the `.env` file.

5. The app is now ready to be run. Run the app with the Gunicorn server.

```bash
gunicorn -c gunicorn.conf.py wsgi:app
```

The backend should now be running on `localhost:5000`.

> <b>Note:</b> The virtual environment can be exited by running the `deactivate` command.

### II. Frontend (Next.js)

1. Change the working directory to the `client` directory.

```bash
cd client
```

2. Install the required dependencies.

```bash
npm install
```

3. Create a `.env.local` file in the `client` directory. You can use the `.env.template` file as a template using the following command.

```bash
cp .env.template .env.local
```

You can then fill in the required values in the `.env.local` file.

4. The app is now ready to be run. Run the app.

```bash
npm run dev
```

The frontend should now be running on `localhost:3000`.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png"><br>

## Moving to Production

In order to make the application production-ready, a few changes would have to be made to the environment.

1. In the `api` directory, set the value of the `FLASK_ENV` environment variable in the created `.env` file to `production`. This will ensure that the Flask backend is run in production mode. In production mode, debug log statements are disabled and only error messages along with the stack trace of the error are logged.

2. In the `client` directory, ensure that `BASE_URL` in the `.env` file is set to the correct value, be it the URL of the deployed backend or `http://localhost:5000`. In addition, set the values of `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT` to ensure a successful build of the Next.js frontend, as well as proper error tracking during production.

3. While the Flask backend is hosted, either locally or remotely, run the following command.

```bash
npm run build
```

This will build the application (generating the static pages of the frontend). To start the application, run

```
npm start
```

The frontend should now be running on `localhost:3000`.
