#!/bin/bash
#
# Installs required packages for building the toolbox distribution package on Ubuntu
#

function die {
  echo "${1}" >&2 && exit 1
}

if [ $(whoami) != "root" ] ; then
  die "Must run as root"
fi

apt-get install -y pandoc zip wkhtmltopdf xorg xvfb hfsprogs
