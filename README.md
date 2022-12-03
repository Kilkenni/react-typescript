# Practice combining React and TypeScript

Tech stack: React, TypeScript

This small practice uses [JSON-server](https://github.com/typicode/json-server) as a mock backend.

## Launch

To provide a backend, launch JSON-server on port 3000. Mock database is located at `backend/db.json`.

After that, launch the app itself with `npm start`, use another port to avoid conflicts.

## Functionality

The page consists of a form to add a new entry (collapsed by default) and a table with entries. Tthe table is filled on-the-fly by an infinite loader from the backend.

The form for adding an newentry needs to be expanded by a button first. Its mounting/unmounting has token animation for practice purposes (inspired by [this article](https://letsbuildui.dev/articles/how-to-animate-mounting-content-in-react)). All the fields are required and have quick (and somewhat crude, can be improved by RegExp, for example) validation checks.

Negative responses from the backend can be intercepted and processed in different places. I'd probably prefer two:

- js/API.ts

  Level of Axios requests, probably good for catching general errors like 500.

- React component that uses methods from js/API.ts to talk to the backend

  Good for the cases where a more concrete error message is preferred, which requires knowing context of the request. JSON-server, to my knowledge, doesn't throw errors, but Axios responses always have a status field that corresponds to the standart HTML respond status codes (and a good backend can additionally return human-readable error messages in res body).

To process errors further, we may report them to the user via any suitable notification lib (such as [React-toastify](https://github.com/fkhadra/react-toastify))

State manager (such as Redux) isn't really required here. The purpose of a global state manager is to store global state that we will possibly need to access from many different (and hard to predict beforehand) points of our site/application. Typically this includes login information, selected locale for the site (if multilingial), selected theme and similar global variables.

In our case we work with a local component exchanging data with the backend for its local need, so storing its state on a global level is not necessary.

## Used libraries

Since my time was limited, I focused on MVP, hence CSS styles are minimal here. The same can be said about the libs:

- modern-normalize
  Classic CSS starting point
- [react-infinite-scroll-hook](https://www.npmjs.com/package/react-infinite-scroll-hook)
  For infinite load functionality in the table
- [axios](https://www.npmjs.com/package/axios)
  A typical HTTP client to make req/res exchange with the backend more convenient.

A good "clean" design could also use a loader component and a notification lib (or an entire component library, which I avoided to save time).
