<div align="center">

<img style="width: 10vw" src="assets/img/codeforces-logo.png">

# Codeforces Stats Portal

![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

</div>

Welcome to the repository of the Codeforces Stats Portal!

The Stats Portal is a web application that keeps track of the Codeforces statistics of the members of a particular Codeforces organization and allows you to view the relevant analytics through means of data visualization.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png"><br>

## Features

### I. Data Visualization

Interesting analytics for the entire organization are visualized by means of interactive charts and plots. Statistics for an individual user can be visualized as well.

### II. Leaderboards

The leaderboards provide a way of finding out where one stands among other members of the organization, as well as the top members of the organization.

### III. Compare Users

The Stats Portal lets you view the statistics of any two users in the organization side-by-side to compare them.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png"><br>

## Setup

Clone the repository and change the working directory to the root directory of the repository.

```bash
cd Stats-Portal
```

### I. Backend (Flask)

1. Change the working directory to the `backend` directory.

```bash
cd backend
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

4. Create a `.env` file in the cloned directory. You can use the `.env.template` file as a template using the following command.

```bash
cp .env.template .env
```

You can then fill in the required values in the `.env` file.

5. The app is now ready to be run. Run the app.

```bash
python app.py
```

The backend should now be running on the host and port specified in the `.env` file. If no value has been specified, the default values will be used, meaning that the app will run on `localhost:5000`.

> <b>Note:</b> The virtual environment can be exited by running the `deactivate` command.

### II. Frontend (Next.js)
