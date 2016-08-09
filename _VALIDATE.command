# this will HTML5 validate everyting in the app/_content/ folder
#!/bin/bash

cd $(dirname $0)
grunt validate
