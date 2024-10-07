@echo off
REM
REM Windows BATCH script to build docker container
REM
@echo on
docker rmi nodejs-express-server
docker build -t nodejs-express-server .
