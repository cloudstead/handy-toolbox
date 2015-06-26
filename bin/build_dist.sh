#!/bin/bash

function die {
  echo "${1}" >&2 && exit 1
}

CLOUDOS_DIR="${1}"
if [ -z "${CLOUDOS_DIR}" ] ; then
  die "No cloudos-dir provided"
fi

APPSTORE_COMMON="${CLOUDOS_DIR}/cloudos-appstore/appstore-common"
CLOUDOS_SERVER="${CLOUDOS_DIR}/cloudos-server"
BUNDLER_JAR="${APPSTORE_COMMON}/target/cloudos-app-bundler.jar"
CLOUDOS_APPS=${CLOUDOS_DIR}/cloudos-apps

# cloudos-server artifact
CLOUDOS_TARBALL="$(find ${CLOUDOS_SERVER}/target -type f -name "cloudos-server-*.jar")"
cd ${CLOUDOS_DIR} && \
  mvn -DskipTests=true package install && \
cd cloudos-server && \
  ./gen-apidocs.sh && ./gen-sql.sh && \
cd ${APPSTORE_COMMON} && \
  mvn -DskipTests=true -P bundler-jar package && \
cd ${CLOUDOS_APPS} && \
  CLOUDOS_BUNDLER_JAR=${BUNDLER_JAR} ${THISDIR}/bin/mcbundle ./apps

if [ ! -f ${CLOUDOS_TARBALL} ] ; then
  die "Error building cloudos-server"
fi
if [ ! -f ${BUNDLER_JAR} ] ; then
  die "Error building bundler jar"
fi
