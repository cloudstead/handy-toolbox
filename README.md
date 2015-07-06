CloudOs Handy Toolbox
=====================

## Welcome to CloudOs! 

#### Get started with the [Handy Toolbox](cloudstead_handy_toolbox.html) 

The toolbox includes everything you need to launch your very own cloudstead, and to build and run apps on it.

### Before Building

You need to provide the individual apps data files. These files will be parsed for data nessesary to make the toolbox function.

After the files are provided, open the 'config/application.js' file and change the value of the 'APPS_DATA_CWD' variable to the path to the folder containing apps files.

Also change the 'APPS_DATA_LIST_CWD' to the folder path containing the file 'apps.js' with the list of apps.

### Building the toolbox

To setup the nessesery dependencies run:

`sudo ./setup_toolbox.sh`

To build the toolbox, from the 'web' directory run:

`lineman build`

this will compile the source files and generate a distribution under 'dist/web/' folder
