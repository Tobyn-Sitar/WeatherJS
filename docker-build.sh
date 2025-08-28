#!/bin/bash

# WeatherJS Docker Build and Push Script

echo "Building WeatherJS Docker image..."
sudo docker build -t weatherjs-app .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    echo "Testing the container locally..."
    sudo docker run -d -p 8080:80 --name weatherjs-test weatherjs-app
    
    echo "✅ Container is running on http://localhost:8080"
    echo "Test it in your browser, then press any key to continue..."
    read -n 1 -s
    
    echo "Stopping test container..."
    sudo docker stop weatherjs-test
    sudo docker rm weatherjs-test
    
    echo ""
    echo "Ready to push to DockerHub!"
    echo "Please run:"
    echo "1. sudo docker login"
    echo "2. sudo docker tag weatherjs-app YOUR_DOCKERHUB_USERNAME/weatherjs:latest"
    echo "3. sudo docker push YOUR_DOCKERHUB_USERNAME/weatherjs:latest"
else
    echo "❌ Docker build failed!"
    exit 1
fi