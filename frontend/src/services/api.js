import axios from 'axios';

// APIのベースURL（環境に応じて変更）
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// グルメスポット一覧を取得する関数
export const fetchGourmetSpots = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/spots`, {
        headers: {
            "Content-Type": 'Application/json',
            'Accept': 'Application/json',
        },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching gourmet spots:', error);
    throw error;
  }
};

// 特定のグルメスポットの詳細を取得する関数
export const fetchGourmetSpotById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/spots/${id}`, {
        headers: {
            "Content-Type": 'Application/json',
            'Accept': 'Application/json',
        },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching gourmet spot with id ${id}:`, error);
    throw error;
  }
};
