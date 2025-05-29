import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// モバイルデバイスかどうかを判定する関数
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 新潟駅の座標
const NIIGATA_STATION = [37.9122, 139.0628];

const InitialMapPosition = () => {
  const map = useMap();

  useEffect(() => {
    // モバイルデバイスの場合は現在地を取得して地図の中心に設定
    if (isMobileDevice()) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 16);
          },
          (error) => {
            console.error('位置情報の取得に失敗しました:', error);
            // 位置情報が取得できない場合は新潟駅を中心に表示
            map.setView(NIIGATA_STATION, 15);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        // Geolocationがサポートされていない場合は新潟駅を中心に表示
        map.setView(NIIGATA_STATION, 15);
      }
    } else {
      // PCの場合は新潟駅を中心に表示
      map.setView(NIIGATA_STATION, 15);
    }
  }, [map]);

  return null;
};

export default InitialMapPosition;
