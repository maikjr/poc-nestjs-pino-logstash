# Step 1 - filebeat
#FROM docker.elastic.co/beats/filebeat:8.5.3

# Copy our custom configuration file
#COPY config/filebeat.yml /usr/share/filebeat/filebeat.yml

#USER root
# Create a directory to map volume with all docker log files
#RUN mkdir /usr/share/filebeat/dockerlogs
##RUN pwd
#RUN chown -R root /usr/share/filebeat/
#RUN chmod -R go-w /usr/share/filebeat/

########### Step 2 - application nod
### Base
FROM node:14.8.0-slim as base

# Enable Node.js optimisation
ENV NODE_ENV=production
ENV LOGASTASH_HOST=localhost
ENV LOGASTASH_PORT=50000
# Create application folder
# WORKDIR can`t create folder with given user:group
# So, we will create it ourselves
RUN mkdir /app && chown -R node:node /app

# Open port
EXPOSE 3000

# Set default folder to /app
WORKDIR /app

# Node.js image comes with user node so let`s switch
USER node

# Copy dependencies describing files
COPY --chown=node:node package.json package-lock*.json ./

# Install runtime dependencies
RUN npm ci --prod

### Builder
FROM base as builder

# Install development dependencies (typings, etc.) require for build
RUN npm install --only=development

# Copy application source code
COPY --chown=node:node . ./

# Build application
RUN npm run build

### Runtime
FROM base as runtime
# Copy runtime dependencies
COPY --from=base /app/node_modules ./node_modules
# Copy compiled application
COPY --from=builder /app/dist ./dist
# Setup entry point
ENTRYPOINT [ "node", "dist/main.js" ]