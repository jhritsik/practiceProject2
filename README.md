# ISP Template

The ISP template is a clean base and development environment for ISP projects.

## Project Setup

*These steps need to be done every time a new ISP Template project is started*

1. Clone the project via GitHub for Mac (see "Cloning" in this doc: [documentation](https://github.com/natgeo/specialprojects-isp-template/blob/master/docs/Github%20For%20Mac%20Workflow.md)). You'll need to come back and finish the installation 
- Navigate to the project folder in Finder, likely in your User directory, within /ISP
- Double click on `_INSTALL.command`. See the troubleshooting section below for issues.
- When this is successful, you can run the project by double clicking on `_LAUNCH.command`

## Project Shortcuts

#### Run the Project to preview your changes live within a browser
- Double click on `_LAUNCH.command` (same as `grunt serve`)

#### Validate HTML
- Double click on `_VALIDATE.command` (same as `grunt validate`)


#### Commandline
- `grunt` or `grunt serve` to develop, 
- `grunt serve:build` to compile and serve the production code to /dist
- `grunt build` to compile the production code to /dist.
- `grunt validate` to scan the HTML partials for errors.

## Troubleshooting

### Command line tools

1. You may be prompted to install "command line tools". Click on `install`.  
	*If this fails*, use one of the following installers to finish this step:
 	- [Apple command line tools for Yosemite (OSX 10.10)](https://www.dropbox.com/s/4afccnqr9230ae5/commandlinetoolsosx10.10forxcode6.3.1.dmg?dl=1 ) 
 	- [Apple command line tools for Mavericks (OSX 10.9)](https://www.dropbox.com/s/hra0jxrzrnfxljv/commandlinetoolsosx10.9forxcode6.2.dmg?dl=1)  
- When installation completes, double click on `_INSTALL.command` again to resume installation.

---

