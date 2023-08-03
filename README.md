# Digits

This is a partial clone of the [New York Times Digits](https://www.nytimes.com/games/digits) game, which was put into beta but not into production. It's last playable date is 08 August 2023.

The game has several features that the NYT game does not:

* A solver for full or partial games
* An editor to define your own games
* A random game generator

## Local Development 

This project is written in next.js with several api calls to a fastapi backend, hosted in the same project.  Here are instructions for developing the next.js and fastapi parts of the project.

1. Clone this repo
2. Install the next.js project dependencies `npm install`
3. Start the local next webserver in development mode `npm run dev`

In a separate terminal:
1. Create a python virtual environment and install the packages `pipenv install`
2. Activate the environment `pipenv shell`
3. Add the working directory to your Python search path `export PYTHONPATH=$PYTHONPATH:<path-to-digits>`
4. Start the local fastapi server `uvicorn index:app --reload --app-dir ./api`

