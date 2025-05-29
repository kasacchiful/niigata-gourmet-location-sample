import React, { useState, useEffect } from 'react';
import { fetchTags } from '../services/api';

/**
 * タグフィルターコンポーネント
 * @param {Object} props
 * @param {Array} props.selectedTags - 選択されているタグの配列
 * @param {Function} props.onTagsChange - タグ選択変更時のコールバック関数
 */
const TagFilter = ({ selectedTags = [], onTagsChange }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // フィルター表示状態の管理

  // 利用可能なタグを取得
  useEffect(() => {
    const getTags = async () => {
      try {
        setLoading(true);
        const data = await fetchTags();
        setTags(data);
        setError(null);
      } catch (err) {
        setError('タグの取得に失敗しました。');
        console.error('Error fetching tags:', err);
      } finally {
        setLoading(false);
      }
    };

    getTags();
  }, []);

  // タグの選択状態を切り替える
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      // タグが既に選択されている場合は削除
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      // タグが選択されていない場合は追加
      onTagsChange([...selectedTags, tag]);
    }
  };

  // すべてのタグを選択解除
  const clearAllTags = () => {
    onTagsChange([]);
  };

  // フィルター表示/非表示の切り替え
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (loading) {
    return <div className="tag-filter-loading">タグを読み込み中...</div>;
  }

  if (error) {
    return <div className="tag-filter-error">{error}</div>;
  }

  return (
    <div className={`tag-filter ${isVisible ? 'expanded' : 'collapsed'}`}>
      <div className="tag-filter-header">
        <h3>カテゴリでフィルタ</h3>
        <button 
          className="toggle-filter-button" 
          onClick={toggleVisibility}
          aria-label={isVisible ? 'フィルターを隠す' : 'フィルターを表示'}
        >
          {isVisible ? '▲ 隠す' : '▼ 表示'}
        </button>
      </div>
      
      <div className="tag-filter-content">
        <div className="tag-list">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <button className="clear-tags-button" onClick={clearAllTags}>
            フィルタをクリア
          </button>
        )}
      </div>
    </div>
  );
};

export default TagFilter;
