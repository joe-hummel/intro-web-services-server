#!/bin/bash
#
# Linux/Mac BASH script to build docker container
#
docker rmi nodejs-express-server
docker build -t nodejs-express-server .
