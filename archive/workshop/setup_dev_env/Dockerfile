FROM ubuntu:18.04
MAINTAINER Lisk <sysops@lightcurve.io>
ENV DEBIAN_FRONTEND noninteractive

ARG user_name
ARG user_id

RUN useradd --create-home --uid $user_id $user_name
RUN apt-get update && apt-get install --assume-yes libtool automake autoconf curl python-minimal build-essential git vim
RUN apt-get install --assume-yes sudo postgresql-client-10
RUN echo "$user_name ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/$user_name
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install --assume-yes nodejs

USER $user_name
WORKDIR /home/$user_name
RUN echo 'PS1="\[\033[01;31m\]LISK-SDK-ENV\[\033[00m\] - \[\033[01;32m\]\u@\h\[\033[01;34m\] \w \$\[\033[00m\] "' >> .bashrc
