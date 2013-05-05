Usage
=====

Once astro is running, you just have to type a command in flowdock, then, if astro find a matching command,
it will process it and send the response in the same flow.
For example, if you want to invoke the 'pt' command:

.. code-block:: bash

    pt documentation astro

Output

.. code-block:: bash

    +---------------------------------+
    | 1 documentation point for astro |
    +---------------------------------+

Commands have an available help, to show it:

.. code-block:: bash

    pt help

Output

.. code-block:: bash

    pt help                                                            author: astr⦿
    ————————————————————————————————————————————————————————————————————————————————
    give a type point to the given user
    usage:
    ➜ pt humor john


Available commands
------------------


List command
~~~~~~~~~~~~

The list command display the list of all available commands, to invoke it:

.. code-block:: bash

    list-cmd

Sample output

.. code-block:: bash

    astr⦿ available commands
    ————————————————————————————————————————————————————————————————————————————————
    • teach .................................................................. astr⦿
    • list-cmd ............................................................... astr⦿
    • so ..................................................................... astr⦿
    • pt ..................................................................... astr⦿
    • relic .................................................................. astr⦿
    ...


So command
~~~~~~~~~~

The so command display an image (most of them are animated gifs) according to the given term, example:

.. code-block:: bash

    so crazy

Output

.. code-block:: bash

    http://i188.photobucket.com/albums/z284/oblongman7/Scrubs/b6488ee3.gif

note: flowdock automatically convert the link to an image.


Point command
~~~~~~~~~~~~~