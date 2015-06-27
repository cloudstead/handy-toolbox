#!/bin/bash
#
# Create necessary artifacts for a distribution package
#
# Usage: build_artifacts.sh [cloudos-src-dir]
#
# The optional cloudos-src-dir argument is the path to the "cloudos" source repository.
# It should at least be initialized with all submodules.
#
# If omitted, we look for a directory named "cloudos" in the path to this script.
# When run within an initialized cloudos repo, it will use the current repo.
#

function die {
  echo "${1}" >&2 && exit 1
}

THISDIR=$(cd $(dirname $0) && pwd)

CLOUDOS_DIR="${1}"
if [ -z "${CLOUDOS_DIR}" ] ; then
  CLOUDOS_DIR=$(echo ${THISDIR} | egrep -o '.+/cloudos/')
  if [ -z "${CLOUDOS_DIR}" ] ; then
    die "No cloudos-dir provided"
  else
    echo "Detected CLOUDOS_DIR=${CLOUDOS_DIR}"
  fi
fi

APPSTORE_BASE="${CLOUDOS_DIR}/cloudos-appstore"
APPSTORE_COMMON="${APPSTORE_BASE}/appstore-common"
CLOUDOS_SERVER="${CLOUDOS_DIR}/cloudos-server"
BUNDLER_JAR="${APPSTORE_COMMON}/target/cloudos-app-bundler.jar"
CLOUDOS_APPS="${CLOUDOS_DIR}/cloudos-apps"
CLOUDOS_TARBALL="${CLOUDOS_SERVER}/target/cloudos-server.tar.gz"

cd ${CLOUDOS_DIR} && \
  mvn -DskipTests=true package install && \
cd cloudos-server && \
  ./gen-apidocs.sh && ./gen-sql.sh && \
cd ${APPSTORE_COMMON} && \
  mvn -DskipTests=true -P bundler-jar package && \
cd ${CLOUDOS_APPS} && \
  CLOUDOS_BUNDLER_JAR=${BUNDLER_JAR} ${APPSTORE_BASE}/bin/mcbundle ./apps && \
cd ${CLOUDOS_DIR} &&
  ./prep.sh cloudos-server ${CLOUDOS_SERVER}/target

if [ ! -f ${CLOUDOS_TARBALL} ] ; then
  die "Error building cloudos-server"
fi
if [ ! -f ${BUNDLER_JAR} ] ; then
  die "Error building bundler jar"
fi
