#!/bin/bash

# install-service.sh
# Script to install RetroFront as a systemd service on Linux

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

PROJECT_DIR=$(pwd)
CURRENT_USER=$SUDO_USER
SERVICE_NAME="retrofront"

echo "Configuring RetroFront service..."
echo "Project Directory: $PROJECT_DIR"
echo "Running as User: $CURRENT_USER"

# Create the service file
cat > /etc/systemd/system/$SERVICE_NAME.service <<EOF
[Unit]
Description=RetroFront UI Application
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$PROJECT_DIR
ExecStart=$(which npm) start
Restart=always
Environment=NODE_ENV=production
# Add more environment variables if needed

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
systemctl daemon-reload

# Enable and start the service
systemctl enable $SERVICE_NAME
systemctl start $SERVICE_NAME

echo "------------------------------------------------"
echo "RetroFront service has been installed and started!"
echo "Status: systemctl status $SERVICE_NAME"
echo "Logs: journalctl -u $SERVICE_NAME -f"
echo "The app should now start automatically on boot."
echo "------------------------------------------------"
