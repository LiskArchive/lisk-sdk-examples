FROM node:10-stretch
MAINTAINER Lisk <sysops@lightcurve.io>
ENV DEBIAN_FRONTEND noninteractive

ARG user_id

RUN usermod --uid $user_id node
RUN chown -R node:node ~node
RUN apt-get update && apt-get install --assume-yes curl git vim postgresql-client

USER node
WORKDIR /home/node
