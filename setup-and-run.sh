#!/bin/bash

# setup-and-run.sh
# Script to install dependencies and run the application on Linux/macOS

echo "--- RetroFront Setup & Run ---"

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "Error: npm is not installed."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (this may take a minute)..."
    npm install
else
    echo "Dependencies already installed."
fi

# Run the application
echo "Starting the application in development mode..."
npm run dev
