astro
=====

astro is a nodejs bot for flowdock.
Its particularity is its ability to learn new commands.

[![Build Status](https://travis-ci.org/plouc/astro.png?branch=master)](https://travis-ci.org/plouc/astro)

## Installation

### Install dependencies

    npm install

### Configure

    mv config.sample.js config.js
    vim config.js

## Launch the bot

    node astro.js

## Run the test suite

    ./node_modules/.bin/vows tests/*