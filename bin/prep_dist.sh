#!/bin/bash
#
# Usage: prep_dist.sh [--release|-r [/path/to/version-file] [user@host:]/path/to/scp/files/]
#
# Creates CloudOs distribution archives that can be used to launch cloudsteads and develop,
# package and publish apps for cloudsteads.
#
#   --release, -r  : if enabled, the patch level of the Major.Minor.Patch version found in version-file
#                    will be incremented and this version file will be saved within the archive files as VERSION.
#
#                    If no version-file is provided, the default value is VERSION, in the directory one level
#                    above the location of this script.
#
#                    The final argument is a destination (filesystem path or SSH-style) where the archives will
#                    be rsync'd.
#
# Optional environment variables:
#
#   DIST_BUILD     : if defined, the build_dist.sh script do a fresh rebuild of all the dependencies.
#                    if undefined, we assume all dependencies have been built and all artifacts are available.
#
#   CLOUDOS_DIR    : if defined, the path to the main cloudos source repository, for builds and asset retrieval.
#                    if undefined, the default path is ../../cloudos relative to the path to this script.
#
#   DIST_NOCLEAN   : if defined, the dist directory will not be removed before building the archives.
#                    if undefined, the dist directory will be removed before building the archives.
#
#

function die {
  echo "${1}" >&2 && exit 1
}

function usage {
  # count number of comment lines at start of this file
  comment_header_size=$(cat ${0} | egrep -vn '^#' | head -1 | awk -F ':' '{print $1}')
  # print comment header from this file
  head -n $(expr ${comment_header_size} - 1) ${0} | tail -n $(expr ${comment_header_size} - 2)
}

THISDIR="$(cd $(dirname ${0}) && pwd)"

# Parse arguments
if [[ -z "${CLOUDOS_DIR}" ]] ; then
  CLOUDOS_DIR="$(cd ${THISDIR}/../../cloudos && pwd)"
else
  # normalize possible relative paths, ensure it's actually a directory
  CLOUDOS_DIR=$(cd ${CLOUDOS_DIR} && pwd) || usage && die "Invalid CLOUDOS_DIR env var: ${CLOUDOS_DIR}"
fi

if [[ ! -z "${1}" ]] ; then
  if [[ "${1}" == "-r" || "${1}" == "--release" ]] ; then
    if [[ -d "${2}" || "${2}" =~ ":" ]] ; then
      # This is the destination. Use default version-file.
      RELEASE_VERSION_FILE=${THISDIR}/../VERSION
      RELEASE_DEST="${2}"

    elif [ -r "${2}" ] ; then
      RELEASE_VERSION_FILE="${2}"
      RELEASE_DEST="${3}"
    else
      usage && die "Error: Neither a VERSION file or a release destination: ${2}"
    fi

    # Validate arguments
    RELEASE_VERSION="$(cat "${RELEASE_VERSION_FILE}" | egrep -o "[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+") | head -1"
    if [ -z "${RELEASE_VERSION}" ] ; then
      usage && die "Invalid version file: ${RELEASE_VERSION_FILE}"
    fi
    if [ -z "${RELEASE_DEST}" ] ; then
      usage && die "No destination provided"
    fi
    if [[ ! -d "${RELEASE_DEST}" && ! "${RELEASE_DEST}" =~ ":" ]] ; then
      usage && die "Invalid destination: ${RELEASE_DEST}"
    fi

  else
    usage && die "Error: Unexpected argument: ${1}"
  fi
fi

DIST_SRC_ROOT="$(cd $(dirname $0)/.. && pwd)"
DIST_SRC_DOCS="${DIST_SRC_ROOT}/docs"
DIST_SRC_FILES="${DIST_SRC_ROOT}/_files"

DIST_ROOT="${DIST_SRC_ROOT}/dist"
DIST_BASE="${DIST_ROOT}/build"
DIST_FILES="${DIST_BASE}/_files"    # supporting files for tools
DIST_CHEF="${DIST_BASE}/launcher"   # chef-repo
CHEF_DATAFILES="${DIST_CHEF}/data_files/cloudos"
DIST_BIN="${DIST_BASE}/bin"

APPSTORE_COMMON="${CLOUDOS_DIR}/cloudos-appstore/appstore-common"
CLOUDOS_SERVER="${CLOUDOS_DIR}/cloudos-server"
BUNDLER_JAR="${APPSTORE_COMMON}/target/cloudos-app-bundler.jar"
CLOUDOS_APPS=${CLOUDOS_DIR}/cloudos-apps

CLOUDOS_TARBALL="$(find ${CLOUDOS_SERVER}/target -maxdepth 1 -type f -name "cloudos-server-*.jar")"
CLOUDOS_CHEF="${CLOUDOS_SERVER}/chef-repo"

if [ ! -z "${DIST_BUILD}" ] ; then
    echo "running build_dist..."
    ${THISDIR}/build_dist.sh
else
    echo "skipping build_dist..."
fi

# validate we have required artifcats
if [[ -z "${CLOUDOS_TARBALL}" || ! -f ${CLOUDOS_TARBALL} ]] ; then
  die "${CLOUDOS_TARBALL} has not been built, and DIST_BUILD env var was not set. Cannot create distribution archive."
fi
if [[ -z "${BUNDLER_JAR}" || ! -f ${BUNDLER_JAR} ]] ; then
  die "${BUNDLER_JAR} has not been built, and DIST_BUILD env var was not set. Cannot create distribution archive."
fi

# start fresh
if [ -z "${DIST_NOCLEAN}" ] ; then
  rm -rf ${DIST_ROOT}
fi
mkdir -p ${DIST_BIN}
mkdir -p ${DIST_CHEF}
mkdir -p ${CHEF_DATAFILES}
RSYNC="rsync -avzc --exclude=\".git*\""

# CloudOs app bundler tools
${RSYNC} ${CLOUDOS_DIR}/cloudos-appstore/bin/* ${DIST_BIN}
cp ${BUNDLER_JAR} ${DIST_BIN}
cp ${CLOUDOS_APPS}/DEVELOPING.md ${DIST_BASE}

# CloudOs launcher

# base files (no subdirs) and init_files dir
${RSYNC} $(find ${CLOUDOS_CHEF} -maxdepth 1 -type f) ${DIST_CHEF}
${RSYNC} ${CLOUDOS_CHEF}/init_files ${DIST_CHEF}

# cookbooks
for build_dir in $(find $(find ${CLOUDOS_APPS}/apps -maxdepth 2 -type d -name dist) -type d -name build) ; do
  ${RSYNC} ${build_dir}/chef/* ${DIST_CHEF}/
done

# data files
cp ${CLOUDOS_TARBALL} ${CHEF_DATAFILES}
${RSYNC} ${CLOUDOS_SERVER}/target/api-examples ${CHEF_DATAFILES}
${RSYNC} ${CLOUDOS_SERVER}/target/miredot ${CHEF_DATAFILES}/api-docs

# docs
MD_FILES="$(cd ${DIST_SRC_ROOT} && find . -type f -name "*.md")"
HTML_APPS="${DIST_SRC_ROOT}/*.html"

${RSYNC} ${DIST_SRC_FILES}/* ${DIST_FILES}/
${RSYNC} ${MD_FILES} ${DIST_BASE}
${RSYNC} ${HTML_APPS} ${DIST_BASE}

# load all localizations for HTML files in DIST_BASE
translation_files=""
for t in $(cd ${DIST_FILES}/strings && ls -1 localized_*.js | xargs basename) ; do
  translation_files="${translation_files} <script type='text/javascript' src=\"_files/strings/${t}\"></script>"
done
for html in $(ls -1 ${DIST_BASE}/*.html) ; do
  sed -i '' -e "s,<!--@@LOCALIZATIONS@@-->,${translation_files}," "${html}" && echo "successful sed run for ${html}"
done

# load all localizations for HTML files in DIST_FILES
translation_files=""
for t in $(cd ${DIST_FILES}/strings && ls -1 localized_*.js | xargs basename) ; do
  translation_files="${translation_files} <script type='text/javascript' src=\"strings/${t}\"></script>"
done
for html in $(ls -1 ${DIST_FILES}/*.html) ; do
  sed -i '' -e "s,<!--@@LOCALIZATIONS@@-->,${translation_files}," "${html}" && echo "successful sed run for ${html}"
done


# if we have pandoc, generate
if [ ! -z "$(which pandoc)" ] ; then
  for doc in ${MD_FILES} ; do
    doc_dir="$(dirname ${doc})"
    doc_name="$(basename ${doc} | awk -F '.' '{print $1}')"
    for format in html pdf rtf ; do
      output_dir="${DIST_BASE}/${doc_dir}"
      mkdir -p ${output_dir} && \
        cat ${doc} | sed -e 's/ href=\"\(.*\)\.md\"/ href=\"\1\.'${format}'\"/' \
          | pandoc -t ${format} > ${output_dir}/${doc_name}.${format}
    done
  done
fi

# Cloudstead launch helper tool

# Build apps.js if it does not exist
if [ ! -f ${DIST_FILES}/js/apps.js ] ; then

  JSON="java -cp ${BUNDLER_JAR} org.cobbzilla.util.json.main.JsonEditor"
  apps=""
  MANIFESTS="$(find ${CLOUDOS_APPS}/apps -maxdepth 2 -type f -name cloudos-manifest.json)"
  for manifest in ${MANIFESTS} ; do
    app=$(basename $(dirname ${manifest}))
    level=$(cat ${manifest} | ${JSON} --path level --operation read | tr -d '"') || die "Error determining level: ${manifest}"
    if [ -z "${level}" ] ; then
      level="app"
    fi
    apps="${apps}
  APPS.${level}.$(echo ${app} | tr '-' '_')= $(cat ${manifest});"
  done

    cat > ${DIST_FILES}/js/apps.js <<EOF
  /* generated by ${0} on $(date) */
  APPS = {
    init: {}, system: {}, cloudos: {}, app: {}
  };
  ${apps}
EOF

fi

# Marker file. Config preparer app checks to see if this file exists to determine if it is being run
# from the source tree, or from a packaged distribution. Running from source will have many errors
# due to missing files, so we take special care to ensure that doesn't happen.
cp ${DIST_FILES}/img/pixel.png ${DIST_FILES}/img/dist-pixel.png

# Generate a release version?
if [ ! -z "${RELEASE_VERSION}" ] ; then
  # Bump version
  LAST=$(echo ${RELEASE_VERSION} | awk -F '.' '{print $NF}')
  NEXT=$(expr ${LAST} + 1)
  NEW_VERSION="$(echo ${RELEASE_VERSION} | awk -F '.' '{print $1"."$2}').${NEXT}"
  cat > ${RELEASE_VERSION_FILE} <<EOF
# generated by ${0} on $(date)
# The $0 script increments the patch number every time it builds a release distribution package set.
# You can change the version of this file to affect which "next" version is selected, but it's bad
# practice to "roll back the odometer" on version numbers. Always roll forward.
${NEW_VERSION}
EOF

  cp ${RELEASE_VERSION_FILE} ${DIST_ROOT}/VERSION
  ARCHIVE_NAME="handy-toolbox-${NEW_VERSION}"
else
  ARCHIVE_NAME="handy-toolbox-snapshot-$(date +%Y-%m-%d)"
fi

exit 0

# Roll it all up.
cd ${DIST_ROOT}
cp -R ${DIST_BASE} ${ARCHIVE_NAME}
tar czf ${ARCHIVE_NAME}.tar.gz ${ARCHIVE_NAME}
zip -r ${ARCHIVE_NAME}.zip ${ARCHIVE_NAME}

# rsync the release version?
if [ ! -z "${RELEASE_DEST}" ] ; then
  ${RSYNC} ${ARCHIVE_NAME}.* ${RELEASE_DEST}
  echo "complete"
fi
