import React from 'react';
import { useMap } from 'react-leaflet';
import '../styles/LocationChangeButton.css';

// モバイルデバイスかどうかを判定する関数
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 新潟駅の座標
const NIIGATA_STATION = [37.9122, 139.0628];

const LocationChangeButton = () => {
  const map = useMap();
  
  // 新潟駅に移動する関数
  const moveToNiigataStation = () => {
    map.setView(NIIGATA_STATION, 15);
  };
  
  // 現在地に移動する関数
  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 16);
        },
        (error) => {
          console.error('位置情報の取得に失敗しました:', error);
          alert('位置情報の取得に失敗しました。位置情報の許可を確認してください。');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('お使いのブラウザは位置情報をサポートしていません。');
    }
  };

  return (
    <div className="location-change-buttons">
      {/* 新潟駅ボタン - すべてのデバイスで表示 */}
      <button 
        className="location-button station-button" 
        onClick={moveToNiigataStation}
        title="新潟駅に移動"
      >
        <i className="location-icon station-icon"></i>
        <span className="button-text">新潟駅</span>
      </button>
      
      {/* 現在地ボタン - モバイルデバイスのみ表示 */}
      {isMobileDevice() && (
        <button 
          className="location-button current-location-button" 
          onClick={moveToCurrentLocation}
          title="現在地に移動"
        >
          <i className="location-icon current-location-icon"></i>
          <span className="button-text">現在地</span>
        </button>
      )}
    </div>
  );
};

export default LocationChangeButton;
