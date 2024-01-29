# Rat Hunt Front-End Setup Guide

<img src="resources/icons/logo-192x192.png" alt="Rat Hunt Logo" width="200"/>

## Prerequisites

1. Install Node version 18.19.0 _(If you have a different version of node installed on your machine, you can install nvm which allows you to manage different node versions)_
2. Install Firebase CLI for hosting and deployment purposes by running `npm install -g firebase-tools@11.30.0` in terminal
3. Permission to access the rat hunt firebase project

## Initial Setup

1. Run `npm run f-install` in the root directory of the mono-repo to install all dependencies for the frontend
2. Run `firebase login` and login to your firebase account

## Scripts

-  `npm run f-start` - Starts the front-end development server
-  `npm run f-deploy` - Builds & deploys the front-end to firebase hosting (current domain is: https://rat-hunt.web.app)
-  `npm run f-install` - Installs all dependencies for the front-end
