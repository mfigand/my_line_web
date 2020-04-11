FROM node:12.12.0 AS compile-image

# install chrome for protractor tests
RUN apt-get update && apt-get install -y chromium && \
    export CHROME_BIN='/usr/bin/chromium'
# RUN apt-get update && apt-get install -y \
#       chromium \
#       chromium-l10n \
#       fonts-liberation \
#       fonts-roboto \
#       hicolor-icon-theme \
#       libcanberra-gtk-module \
#       libexif-dev \
#       libgl1-mesa-dri \
#       libgl1-mesa-glx \
#       libpango1.0-0 \
#       libv4l-0 \
#       fonts-symbola \
#       --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/* \
#     && mkdir -p /etc/chromium.d/

# Add chromium user
# RUN groupadd -r chromium && useradd -r -g chromium -G audio,video chromium \
#     && mkdir -p /home/chromium/Downloads && chown -R chromium:chromium /home/chromium

# Run as non privileged user
# USER chromium

# WORKDIR /opt/ng
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

ENV PATH="./node_modules/.bin:$PATH"
# Tell karma-chrome-launcher where chromium was downloaded and installed to.
ENV CHROME_BIN="/usr/bin/chromium"

COPY . ./
RUN ng build --prod
