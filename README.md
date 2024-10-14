# Google Calendar Watcher Node.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]

## Description

This is a node express serverless function that uses the Google API and nodemailer to scan a particular calendar for new events based on a particular time distance and emails the first new event found to the configured user.

## Table of Contents

⋆[Installation](#Installation)
⋆[Usage](#Usage)
⋆[Credits](#Credits)
⋆[License](#License)
⋆[Features](#Features)
⋆[Contributions](#Contributions)
⋆[Test](#Contributions)

## Installation

If you are interested in cloning and running this application on your local machine, please ensure you have the latest LTS Version of Node installed. Once the repo has been cloned, from the command line, navigate to the root of the project directory and enter `$ npm install` . Once the dependencies have successfully been installed, you must remove the `.example` from the `.env` file and add values for all variables. For further usage instructions, see [link](#Usage).

## Usage

To use this application you must have an active Google Project with the Google Calendar API enabled and an email service provider that allows for SMTP Server usage. If you are using Gmail, please refer to Google's instructions online for configuring this.

When you have fulfilled all the Google API environment variables, except for GOOGLE_REFRESH_TOKEN you can run `$ node refresh-scrift` in your CLI from the root of the project and visit 'http://localhost:4000/' in your browser. If you have configured your OAuth Consent Screen properly, you should be directed through the authentication flow and receive a refresh token in your CLI. Add this to the GOOGLE_REFRESH_TOKEN env value. 

To build bundle the source code to JS use `$ npm run build`

## Credits

## License

(https://opensource.org/licenses/MIT)

## Features

- Emailing capability
- Google Calendar API
- AWS EventBridge Timed Trigger

## Technologies

- AWS Lambda
- AWS EventBridge
- Nodemailer
- Google Calendar API

  ## Contributions

  ## Test

  ## Questions

  If you have any questions about the project you can reach out to me via email or GitHub with the information below.

  > Email: brahmvanh@gmail.com

  > GitHub: [brahmvanh](https://github.com/brahmvanh)
