import { useState, useEffect } from 'react';
import { fetchGourmetSpots } from '../services/api';

/**
 * グルメスポットデータを取得するカスタムフック
 * @param {Array} filterTags - フィルタリングするタグの配列
 */
const useGourmetSpots = (filterTags = []) => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSpots = async () => {
      try {
        setLoading(true);
        const data = await fetchGourmetSpots(filterTags);
        setSpots(data);
        setError(null);
      } catch (err) {
        setError('グルメスポットの取得に失敗しました。');
        console.error('Error fetching gourmet spots:', err);
      } finally {
        setLoading(false);
      }
    };

    getSpots();
  }, [filterTags]); // filterTagsが変更されたら再取得

  return { spots, loading, error };
};

export default useGourmetSpots;
