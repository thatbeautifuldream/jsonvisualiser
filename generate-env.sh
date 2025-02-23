#!/bin/bash

# Check if .env file already exists
if [ -f .env ]; then
    echo ".env file already exists. Please remove it first if you want to generate a new one."
    exit 1
fi

# Generate .env file
cat > .env << EOL
DATABASE_URL=""
ADMIN_KEY=""
EOL

echo ".env file has been generated successfully!"
