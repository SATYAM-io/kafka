# MAP: Real-Time Location Tracker

A real-time location tracking application built with **Node.js**, **Express**, **Socket.IO**, and **Apache Kafka**. This project demonstrates how to build a scalable architecture for real-time applications by using Kafka as a message broker to handle and distribute location updates across connected clients.

## Features

- **Real-Time Updates**: Instantaneous location sharing and updating using WebSockets (Socket.IO).
- **Scalable Architecture**: Utilizes Apache Kafka for robust and scalable message brokering.
- **Dockerized Infrastructure**: Includes a `docker-compose.yml` for easily spinning up a local Kafka broker.
- **Simple Client Interface**: Static frontend served via Express to visualize location updates.

## Architecture

1. **Clients** emit their location via `client:location:update` over WebSockets to the server.
2. The **Express Server** receives these updates and acts as a **Kafka Producer**, sending the data to the `location-updates` Kafka topic.
3. The server also acts as a **Kafka Consumer**, subscribing to the `location-updates` topic.
4. When a message is consumed from Kafka, the server broadcasts it to all connected WebSockets clients using the `server:location:update` event.

## Prerequisites

Before running this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker](https://www.docker.com/) & Docker Compose (for running Kafka)
- [pnpm](https://pnpm.io/) (Package manager)

## Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd MAP
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Getting Started

### 1. Start Apache Kafka
Start the Kafka broker using Docker Compose:
```bash
docker-compose up -d
```

### 2. Setup Kafka Topics
Run the admin script to create the necessary Kafka topic (`location-updates`):
```bash
node kafka-admin.js
```
*You should see output indicating successful connection and topic creation.*

### 3. Start the Server
Start the Express server and WebSocket/Kafka consumers:
```bash
node index.js
```

### 4. View the App
Open your browser and navigate to:
```
http://localhost:8000
```
Open the app in multiple browser windows or tabs to see real-time location synchronization across clients.

## Project Structure

- `index.js`: Main application entry point (Express server, Socket.IO setup, Kafka Producer/Consumer).
- `kafka-admin.js`: Script to initialize the Kafka environment and create topics.
- `kafka-client.js`: Kafka client configuration and initialization.
- `docker-compose.yml`: Docker configuration for the Apache Kafka broker.
- `public/`: Contains static client-side files (`index.html`).

## License

This project is licensed under the ISC License.
