# pull the Node.js Docker image
FROM node:alpine

# update the package index
RUN apk update

# add busybox initscripts to the PATH
RUN apk add --no-cache busybox-initscripts curl openrc tzdata

# set timezone data
ENV TZ=Asia/Kuala_Lumpur

# create the directory inside the container
WORKDIR /usr/src/app

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN yarn install

# copy the generated modules and all other files to the container
COPY . .

# migrate models to database
RUN yarn prisma migrate dev --name init

# our app is running on port 3000 within the container, so need to expose it
EXPOSE 3000

# create optimized build for production
RUN yarn build

# the command that starts our app
CMD yarn start