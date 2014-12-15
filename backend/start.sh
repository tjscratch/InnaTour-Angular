#!/bin/bash
echo "start app"

SCRIPTPATH=`pwd -P`
HOME=$(dirname $BASH_SOURCE)
APPLICATION_START='backend/express.js'
LOG=$SCRIPTPATH'/backend/log/forever.log'
LOG_ERROR=$SCRIPTPATH'/backend/log/error.log'
LOG_OUT=$SCRIPTPATH'/backend/log/out.log'


echo $LOG_OUT
echo $LOG_ERROR
echo $LOG



echo $DIR
echo $SCRIPTPATH

function startApp {
   forever start -a -l $LOG -o $LOG_OUT -e $LOG_ERROR $APPLICATION_START
}

function stopApp {
   forever stop $APPLICATION_START
}

stopApp
startApp

