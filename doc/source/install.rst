Installation
============

Install dependencies
--------------------

Dependencies are managed through npm

.. code-block:: bash

    npm install

Configure
---------

You have to configure the bot to use your own flowdock API tokens

.. code-block:: bash

    mv config.sample.js config.js
    vim config.js

Basic configuration reference
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In order to get your flowdock tokens, go to https://www.flowdock.com/account/tokens,

    - userToken = Personal API token
    - apiToken =  Flow API token.

apiToken must match the corresponding flow. You can see that all configuration options
reside under the 'default' key, it allow you to define multiple configs.

.. code-block:: javascript

    var config = {
      'default': {
        'botName':        'astro', // the name of your bot
        'org':            'ORGANIZATION_NAME',
        'flow':           'FLOW_NAME',
        'userToken':      'YOUR_FLOW_USER_TOKEN',
        'apiToken':       'YOUR_FLOW_API_TOKEN',
        'welcomeMessage': 'Hi, I\'m astro' // message to display on bot connection
      }
    };

Run
---

You're now ready to launch astro, simply type teh following command in the root folder

.. code-block:: javascript

    node astro.js default

If you want to run the bot with a different configuration, define it and call

.. code-block:: javascript

    node astro.js CONFIG_KEY