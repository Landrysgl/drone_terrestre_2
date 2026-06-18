const videoBtn = document.getElementById('videoBtn');
const mapBtn = document.getElementById('mapBtn');

const videoContainer = document.getElementById('videoContainer');
const mapContainer = document.getElementById('mapContainer');




mapContainer.classList.add('hidden');




videoBtn.onclick = () => {

  videoContainer.classList.remove('hidden');
  mapContainer.classList.add('hidden');

};

mapBtn.onclick = () => {

  mapContainer.classList.remove('hidden');
  videoContainer.classList.add('hidden');

};



const ros = new ROSLIB.Ros({
  url: 'ws://[PI_ADDRESS]:9090'
});

ros.on('connection', () => {
  console.log('Connected to ROS');
});

ros.on('error', (error) => {
  console.log(error);
});


const map = L.map('map').setView([48.8566, 2.3522], 18);

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
  }
).addTo(map);

const marker = L.marker([48.8566, 2.3522]).addTo(map);



const gpsListener = new ROSLIB.Topic({

  ros: ros,
  name: '/fix',
  messageType: 'sensor_msgs/msg/NavSatFix'

});

gpsListener.subscribe((msg) => {

  const lat = msg.latitude;
  const lon = msg.longitude;

  marker.setLatLng([lat, lon]);

  map.setView([lat, lon]);

});
