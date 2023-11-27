# Base image
FROM node:18
# Create app directory
WORKDIR /usr/src/app
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# Install app dependencies
RUN npm install 
# Bundle app source
COPY . .
#Exposing the port 3000
EXPOSE 3000
# Creates a "dist" folder with the production build
RUN npm run build
#set environment variables
ARG YML_PAYMENT_GATEWAY_STRIPE_SECRET_KEY
ARG YML_PAYMENT_GATEWAY_HOST
ARG YML_PAYMENT_GATEWAY_SUCCESS_URL
ARG YML_PAYMENT_GATEWAY_CANCEL_URL
ARG YML_PAYMENT_GATEWAY_SVB_AUTHENTICATION_URL
ARG YML_PAYMENT_GATEWAY_SVB_CLIENT_ID
ARG YML_PAYMENT_GATEWAY_SVB_CLIENT_SECRET
ARG YML_PAYMENT_GATEWAY_PAYMENT_SERVICE_PROVIDER
ARG YML_PAYMENT_GATEWAY_SVB_TRANSFER_URL
ARG YML_PAYMENT_GATEWAY_SVB_BASE_API_URL
ARG YML_PAYMENT_GATEWAY_GET_ALL_TRANSACTIONS_PREFERENCE
# Start the server using the production build
CMD [ "npm", "run", "start" ]