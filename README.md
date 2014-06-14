# LaseRun

An educational (arithmetic) 2D platformer game


## Instructions

Navigate through the map to get the highest possible scores. Collecting coins 
gives you points. If you strike a laser, yo will be presented with a question. 
If you fail to answer the question, then the game is over. However if you answer 
the question correctly then you will be granted bonus points.

## Building and Running

NOTE: You do not necessarily have to build to run.
To build the project, you require the following:
<ul>
    <li>
        <a href="http://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html" title="Java 8">Java 8</a>
    </li>
    <li>
        <a href="http://www.gnu.org/software/make/" title="GNU make">GNU make</a>
    </li>
</ul>
In the 'site' folder, there is a Makefile. From the commandline execute 'make release' on 
that folder to build the release version. Ignore any warnings. You can execute 'make clean' to 
clean up the build too.

To run the project, you require the following:
<ul>
    <li>
        <a href="http://nodejs.org/" title="nodejs">nodejs</a> (npm) or any webserver.
    </li>
</ul>
To run the project using nodejs:
<ul>
    <li>
        From the root project folder, execute 'npm i'. This will install the dependencies in a folder 
        called 'node_modules'.
    </li>
    <li>
        Run http-server from the same directory. So on Windows run 'call ./node_modules/.bin/http-server -p $PORT ./site'. 
        Replace '$PORT' with whatever port you want, for example 8000. So an example would be 'call ./node_modules/.bin/http-server -p 8000 ./site'.
    </li>
    <li>
        Open your web browser and go to 'localhost:$PORT/build/release' where '$PORT' is the port you used. If you did not build, 
        you can also just do 'localhost:$PORT'. This will open the original source which is easier to debug.
    </li>
</ul>

## License
LaseRun is released under Apache License 2.0. The full license can be found in the file 'LICENSE'.

## Authors
Pranjal Raihan <prshreshtha at yahoo.com>
