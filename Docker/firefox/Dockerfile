FROM ubuntu:latest
RUN apt-get update && apt-get install -y firefox xauth
RUN groupadd --gid 1000 user && \
        useradd --uid 1000 --gid 1000 --create-home user
USER user
CMD ["/usr/bin/firefox"]
