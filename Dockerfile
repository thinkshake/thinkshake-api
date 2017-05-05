FROM node:latest

RUN apt-get update
RUN apt-get install -y ocaml libelf-dev

RUN useradd -d /home/shaker -m shaker && echo 'shaker ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER shaker

RUN ln -nsf /srv/thinkshake-api ~/thinkshake-api

# RUN echo 'export LC_ALL="en_US.UTF-8" LANG="en_US.UTF-8" LANGUAGE="en_US.UTF-8"' >> ~/.bashrc
RUN echo 'export LANG="en_US.UTF-8" LANGUAGE="en_US.UTF-8"' >> ~/.bashrc

WORKDIR /srv/thinkshake-api

EXPOSE 5000
