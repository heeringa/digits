# Digits

This is a partial clone of the [New York Times Digits](https://www.nytimes.com/games/digits) game, which was put into beta in 2023, but ultimately not into production. It's final playable date was August 8 2023.

Our implementation has several features that the NYT version does not:

* A dynamic programming solver for full and partial games
* An editor to define your own games
* A random game generator

## Local Development 

You should have `node`, `python 3.9`, and `pipenv` installed. This project is written in next.js with api calls to a python fastapi backend, hosted in the same project.  Here are instructions for developing the next.js and fastapi parts of the project.

1. Clone this repo
2. Install the next.js project dependencies `npm install`
3. Start the local next webserver in development mode `npm run dev`
4. In a separate terminal, create a python virtual environment with the proper packages `pipenv install`
5. Activate the environment `pipenv shell`
6. Add the working directory to your Python search path `export PYTHONPATH=$PYTHONPATH:<path-to-digits>`
7. Start the local fastapi server `uvicorn index:app --reload --app-dir ./api`

Point your browser at [localhost:3000](http://localhost:3000/).

## Implementation Notes

This project started as a way for [me](https://github.com/heeringa) to learn react, next.js, tailwind.css, fastapi and deployment on vercel.  The code needs work and there already is a [small list of improvements](https://github.com/heeringa/digits/issues) in the queue.  Please consider this project open for feature requests via newly filed issues or code contributions. Really, have at it!

