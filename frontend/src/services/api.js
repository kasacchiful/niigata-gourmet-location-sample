import axios from 'axios';

// APIのベースURL（環境に応じて変更）
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// グルメスポット一覧を取得する関数
export const fetchGourmetSpots = async (tags = []) => {
  try {
    let url = `${API_BASE_URL}/spots`;
    
    // タグによるフィルタリングがある場合
    if (tags && tags.length > 0) {
      const params = new URLSearchParams();
      tags.forEach(tag => params.append('tags[]', tag));
      url = `${url}?${params.toString()}`;
    }
    
    const response = await axios.get(url, {
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

// 利用可能なタグ一覧を取得する関数
export const fetchTags = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tags`, {
        headers: {
            "Content-Type": 'Application/json',
            'Accept': 'Application/json',
        },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};
