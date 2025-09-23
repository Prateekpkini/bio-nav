// server/server.js
const express = require('express');
const cors = require('cors');
const { households } = require('./data');

const app = express();
const PORT = 5000;

app.use(cors());

// Function to calculate distance between two points using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Nearest Neighbor Algorithm for TSP
const findShortestPath = (points) => {
    if (points.length === 0) return [];

    let unvisited = [...points];
    let path = [];
    let currentLocation = unvisited.shift(); // Start at the first point
    path.push(currentLocation);

    while (unvisited.length > 0) {
        let nearestIndex = -1;
        let minDistance = Infinity;

        for (let i = 0; i < unvisited.length; i++) {
            const distance = getDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                unvisited[i].latitude,
                unvisited[i].longitude
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = i;
            }
        }
        currentLocation = unvisited.splice(nearestIndex, 1)[0];
        path.push(currentLocation);
    }
    return path;
};


app.get('/api/route', (req, res) => {
    const shortestPath = findShortestPath(households);
    res.json(shortestPath);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});