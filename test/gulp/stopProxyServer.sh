#!/usr/bin/env bash

set -e

echo "********* stopProxyServer: Kill existing proxy server ... if running *********"
for KILLPID in `ps -ef | grep browsermob-proxy | grep net.lightbody | grep -v grep | awk '{print $2;}'`; do echo "killing process - " $KILLPID;  kill -9 $KILLPID; done
sleep 3
echo "********* stopProxyServer: DONE *********"
