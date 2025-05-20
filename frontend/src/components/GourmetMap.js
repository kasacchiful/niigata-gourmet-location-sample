import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchGourmetSpots } from '../services/api';

// Leafletのデフォルトアイコンの問題を修正
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 新潟駅の座標
const NIIGATA_STATION = [37.9122, 139.0628];

const GourmetMap = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSpots = async () => {
      try {
        const data = await fetchGourmetSpots();
        setSpots(data);
        setLoading(false);
      } catch (err) {
        setError('グルメスポットの取得に失敗しました。');
        setLoading(false);
        console.error('Error fetching gourmet spots:', err);
      }
    };

    getSpots();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <MapContainer
      center={NIIGATA_STATION}
      zoom={15}
      scrollWheelZoom={true}
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.latitude, spot.longitude]}
        >
          <Popup>
            <div className="popup-content">
              <h3>{spot.name}</h3>
              <img src={spot.image_url} alt={spot.name} />
              <p><strong>カテゴリ:</strong> {spot.category}</p>
              <p><strong>住所:</strong> {spot.address}</p>
              <p><strong>営業時間:</strong> {spot.business_hours}</p>
              <p><strong>電話番号:</strong> {spot.phone}</p>
              <a href={spot.website_url} target="_blank" rel="noopener noreferrer">
                公式サイトを見る
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GourmetMap;
