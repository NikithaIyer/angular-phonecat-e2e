#!/usr/bin/env bash

set -e

port=$1
proxyPort=$2
hostname=$3

sleep 5
echo "********* startProxyServer: Proxy server status *********"
echo $(ps -ef | grep browsermob-proxy | grep net.lightbody | grep -v grep)
echo "********* startProxyServer: Start Proxy Server *********"
mkdir -p output/e2e
cd output/e2e
pwd
./../temp/browsermob-proxy-2.1.1/bin/browsermob-proxy --port $port --address $hostname &>/dev/null &
wget --retry-connrefused http://$hostname:$port/proxy
echo "********* startProxyServer: Register proxy port $proxyPort *********"
curl -X POST -d port=$proxyPort -d bindAddress=$hostname http://$hostname:$port/proxy
sleep 3
echo "********* startProxyServer: Registered ports *********"
echo curl -X GET http://$hostname:$port/proxy

echo "********* startProxyServer: Proxy server running on port: *********"
echo $(ps -ef | grep browsermob-proxy | grep net.lightbody | grep -v grep)

echo "********* startProxyServer: DONE *********"
