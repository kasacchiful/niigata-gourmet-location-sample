import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import TagFilter from './TagFilter';
import useGourmetSpots from '../hooks/useGourmetSpots';

// Leafletのデフォルトアイコンの問題を修正
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ユーザー位置用の丸いアイコン
const userLocationIcon = new L.DivIcon({
  className: 'user-location-icon',
  html: '<div class="user-location-dot"></div><div class="user-location-pulse"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// モバイルデバイスかどうかを判定する関数
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 新潟駅の座標
const NIIGATA_STATION = [37.9122, 139.0628];

// ユーザーの位置を取得して表示するコンポーネント
const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const map = useMap();

  useEffect(() => {
    // PCの場合は位置情報を表示しない
    if (!isMobileDevice()) {
      return;
    }

    let watchId = null;

    // 位置情報の監視を開始
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = { lat: latitude, lng: longitude };
          setPosition(newPosition);
          
          // 初回のみ地図の中心を現在地に設定
          if (!position) {
            map.setView(newPosition, 16);
          }
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
          setLocationError('位置情報の取得に失敗しました。位置情報の許可を確認してください。');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('お使いのブラウザは位置情報をサポートしていません。');
    }

    // クリーンアップ関数
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [map]);

  return position === null ? null : (
    <>
      <Marker position={position} icon={userLocationIcon}>
        <Popup>
          <div>
            <p>現在地</p>
          </div>
        </Popup>
      </Marker>
      {locationError && <div className="location-error">{locationError}</div>}
    </>
  );
};

const GourmetMap = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const { spots, loading, error } = useGourmetSpots(selectedTags);
  const mapRef = useRef(null);

  // フィルターの表示/非表示が切り替わった時に地図のサイズを再計算
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 300); // CSSトランジションの時間に合わせる
    }
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="gourmet-map-container">
      <TagFilter selectedTags={selectedTags} onTagsChange={setSelectedTags} />
      
      <MapContainer
        center={NIIGATA_STATION}
        zoom={15}
        scrollWheelZoom={true}
        className="map-container"
        ref={mapRef}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* モバイルデバイスの場合のみ位置情報を表示 */}
        {isMobileDevice() && <LocationMarker />}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
          >
            <Popup>
              <div className="popup-content">
                <h3>{spot.name}</h3>
                <img src={spot.image_url} alt={spot.name} />
                <p>
                  <strong>カテゴリ:</strong> 
                  <div className="spot-tags">
                    {spot.tags && spot.tags.map((tag, index) => (
                      <span key={index} className="spot-tag">{tag}</span>
                    ))}
                  </div>
                </p>
                <p><strong>住所:</strong> {spot.address}</p>
                <p><strong>営業時間:</strong> {spot.business_hours}</p>
                <a href={spot.website_url} target="_blank" rel="noopener noreferrer">
                  公式サイトを見る
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GourmetMap;
