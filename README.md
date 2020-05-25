# Full Stack JavaScript + Docker Demo

## How to run
Simply run `make run`

## General Notes
### Bootstrapping JavaScript Apps
To get started, create a directory for the project, here named `js-app`, and create a basic Dockerfile like so:
```Dockerfile
FROM node:14.3
WORKDIR /app
```
You then have to create an entry in the docker-compose file that bind mounts the app's directory to the container's working directory:
```yaml
js-app:
  image: node:14.3
  volumes:
    - type: bind
      source: ./js-app
      target: /app
```
You then need to run the container and initialize the project:
(host)
```bash
docker-compose run --rm js-app /bin/bash
```
(container)
```bash
npm init -y # or create-react-app
npm install <package1> <package2>
```
*special note: if you are creating a react app with `create-react-app`, you will want to modify the docker-compose to target the root of the container (`/`), remove the app directory, and run `create-react-app app`.  After doing this you will need to revert the docker-compose service to look like the one above.

Next, modify the Dockerfile to its final form:
```Dockerfile
FROM node:14.3
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app/
# the CMD command differes depending on the project
CMD [ "npm", "start" ]
```
At this point you need to modify the docker-compose file to build with this Dockerfile
```yaml
js-app:
  build: ./js-app
  volumes:
    - type: bind
      source: ./js-app
      target: /app
```

## Running On a New Machine
Because the docker-compose.yml file bind mounts the app's directory, it will overwite the contents of the Dockerfile's `npm install` run command (or any file that is placed in the overwritten directory for that matter).  This is normally fine, except on fresh installs or after removing the node_modules directory. To rectify this, you will need to run the container interactively and manually install dependencies:
(host)
```bash
docker-compose run --rm js-app /bin/bash
```
(container)
```bash
npm install
```
Please not that this is only an issue for bind-mounted containers.  Since you will not be bind-mounting in production, this will not be an issue outside of development.
A potential solution to this problem where the results of `npm instll` don't get overwritten, with the downside that you have to restart the container when deps change, is shown here: https://stackoverflow.com/a/35317425
This is an attractive alternative when there are many developers on a project. 