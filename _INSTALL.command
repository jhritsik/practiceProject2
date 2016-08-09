#!/bin/bash

CYAN='\x1B[1;96m'
PURPLE='\x1B[1;95m'
RED='\x1B[0;31m'
END='\x1B[0m'    # Text color Reset

colorBlock() {
echo -e "${PURPLE}"
echo -e "###########################"
echo -e "$1"
echo -e "###########################"
echo -e "${END}"
}

errorBlock() {
echo -e "${RED}"
echo -e "***************************"
echo -e "$1"
echo -e "***************************"
echo -e "${END}"
}

# xcodeInstall() {
# 	xcode-select --install
# }

xcodeInstall() {
	# https://github.com/timsutton/osx-vm-templates/blob/master/scripts/xcode-cli-tools.sh
	# Get and install Xcode CLI tools
	OSX_VERS=$(sw_vers -productVersion | awk -F "." '{print $2}')

	# on 10.9+, we can leverage SUS to get the latest CLI tools
	if [ "$OSX_VERS" -ge 9 ]; then
	    # create the placeholder file that's checked by CLI updates' .dist code
	    # in Apple's SUS catalog
	    touch /tmp/.com.apple.dt.CommandLineTools.installondemand.in-progress &&
	    # find the CLI Tools update
	    PROD=$(softwareupdate -l | grep "\*.*Command Line" | head -n 1 | awk -F"*" '{print $2}' | sed -e 's/^ *//' | tr -d '\n')
	    # install it
	    echo "$PROD" &&
	    softwareupdate -i "$PROD" -v &&
	    rm /tmp/.com.apple.dt.CommandLineTools.installondemand.in-progress

	# on 10.7/10.8, we instead download from public download URLs, which can be found in
	# the dvtdownloadableindex:
	# https://devimages.apple.com.edgekey.net/downloads/xcode/simulators/index-3905972D-B609-49CE-8D06-51ADC78E07BC.dvtdownloadableindex
	else
	    [ "$OSX_VERS" -eq 7 ] && DMGURL=http://devimages.apple.com.edgekey.net/downloads/xcode/command_line_tools_for_xcode_os_x_lion_april_2013.dmg
	    [ "$OSX_VERS" -eq 8 ] && DMGURL=http://devimages.apple.com.edgekey.net/downloads/xcode/command_line_tools_for_osx_mountain_lion_april_2014.dmg

	    TOOLS=clitools.dmg
	    curl "$DMGURL" -o "$TOOLS" &&
	    TMPMOUNT=`/usr/bin/mktemp -d /tmp/clitools.XXXX`
	    hdiutil attach "$TOOLS" -mountpoint "$TMPMOUNT" &&
	    installer -pkg "$(find $TMPMOUNT -name '*.mpkg')" -target /
	    hdiutil detach "$TMPMOUNT" &&
	    rm -rf "$TMPMOUNT" &&
	    rm "$TOOLS"
	    # exit
	fi
}

downloadBlock() {
cat << EOF
You need to download and install the XCode developer tools manually

==> Yosemite (OSX 10.10): 
	https://www.dropbox.com/s/4afccnqr9230ae5/commandlinetoolsosx10.10forxcode6.3.1.dmg?dl=1

==> Mavericks (OSX 10.9): 
	https://www.dropbox.com/s/hra0jxrzrnfxljv/commandlinetoolsosx10.9forxcode6.2.dmg?dl=1


EOF
}

detect_profile() {
  if [ -f "$PROFILE" ]; then
    echo "$PROFILE"
  elif [ -f "$HOME/.bashrc" ]; then
    echo "$HOME/.bashrc"
  elif [ -f "$HOME/.bash_profile" ]; then
    echo "$HOME/.bash_profile"
  elif [ -f "$HOME/.zshrc" ]; then
    echo "$HOME/.zshrc"
  elif [ -f "$HOME/.profile" ]; then
    echo "$HOME/.profile"
  else 
  	echo "$HOME/.profile"
  fi
}


cat << EOF






8888888 .d8888b.  8888888b.  
  888  d88P  Y88b 888   Y88b 
  888  Y88b.      888    888 
  888   "Y888b.   888   d88P 
  888      "Y88b. 8888888P"  
  888        "888 888        
  888  Y88b  d88P 888        
8888888 "Y8888P"  888   
___ ____ _  _ ___  _    ____ ___ ____ 
 |  |___ |\/| |__] |    |__|  |  |___ 
 |  |___ |  | |    |___ |  |  |  |___ 
                                      

Hello, and welcome.






EOF


## allow the .command file to start in project directory
cd "${BASH_SOURCE%/*}"

## get the profile location
ISP_PROFILE=$(detect_profile)

## Check for entry within /etc/hosts
colorBlock "HOST FILE EDIT" &&
if grep -q "isp.dev.nationalgeographic.com" /etc/hosts
then
	echo "ISP HOSTS ENTRY FOUND"
else
	if sudo -v; then
		## if user has sudo rights, run the script
		./hosts.sh || exit;
		echo "Hosts file written"
	else
		## if doesn't have sudo rights we need to switch users
		echo "What is your admin username?"
		read USERNAME
		echo "You may be asked for your admin password twice"
		su $USERNAME ./hosts.sh || exit;
		echo "Hosts file written by admin user"
	fi
fi

# Check for xcode commandline tools so the NVM install script doesn't fail silently
# another possible location: "/System/Library/CoreServices/Command Line Developer Tools.app"
# what xcode-select -p should yield = "/Library/Developer/CommandLineTools"
# colorBlock "COMMANDLINE TOOLS CHECK" &&
# if [[ $(xcodeInstall 2>&1) =~ "command line tools are already installed" ]]; then #same as if [ "$?" = "0" ]
# 	echo "Commandline tools already installed"
# elif [[ $(xcodeInstall 2>&1) =~ "unknown command option" ]]; then
# 	echo "You have an old version of XCode..."
# 	downloadBlock
# 	exit 1
# else
# 	errorBlock "Commandline tools are not installed.\nPlease follow the prompt and rerun\n_INSTALL when finished"
# 	echo "If the prompt says the software is not currently available..."
# 	downloadBlock
# 	exit 1
# fi

# fully automated way
colorBlock "COMMANDLINE TOOLS CHECK" &&
if [ $(xcode-select -p &> /dev/null; printf $?) -ne 0 ]; then
	xcodeInstall || exit
else 
	echo "Commandline tools already installed"
fi

## Make sure a profile exists to prep for NVM
colorBlock "TOUCH $ISP_PROFILE"  &&
touch $ISP_PROFILE  &&

## Download NVM. Any errors within will NOT stop subsequent execution
colorBlock "DOWNLOAD and INSTALL NVM" &&
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.1/install.sh | bash

## Source the bash_profile to get NVM as a command instead of restarting terminal
colorBlock "SOURCE $ISP_PROFILE" &&
source $ISP_PROFILE &&

## install the node version
colorBlock "INSTALL NODE VIA NVM" &&
nvm install 5.6.0 &&

## set the node version
colorBlock "SET NODE VERSION" &&
echo "5.6.0" > .nvmrc &&
nvm alias default 5.6.0 &&
nvm use &&

## install node modules
colorBlock "INSTALLING GLOBAL NODE MODULES" &&
# npm list -g bower;
npm install -g grunt-cli &&
npm install -g bower &&


## install the per-project modules
colorBlock "INSTALLING PROJECT MODULES" &&
npm install &&
bower install --config.interactive=false &&

## Re-source bash_profile in case this script is not run as double-clicked
## This will make the .nvmrc changes take effect
colorBlock "SOURCE $ISP_PROFILE" &&
source $ISP_PROFILE &&

colorBlock "THANK YOU FOR USING THE ISP TEMPLATE"