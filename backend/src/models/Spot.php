<?php

namespace App\Models;

/**
 * グルメスポットモデル
 */
class Spot
{
    public string $id;
    public string $name;
    public array $tags;  // カテゴリをタグ形式に変更
    public string $address;
    public string $business_hours;
    public string $website_url;
    public string $image_url;
    public float $latitude;
    public float $longitude;

    /**
     * 配列からSpotオブジェクトを作成
     */
    public static function fromArray(array $data): self
    {
        $spot = new self();
        $spot->id = $data['id'] ?? '';
        $spot->name = $data['name'] ?? '';
        
        // タグの処理 - 配列として保存、または文字列からの変換
        if (isset($data['tags'])) {
            $spot->tags = is_array($data['tags']) ? $data['tags'] : [$data['tags']];
        } elseif (isset($data['category'])) {
            // 後方互換性のため、categoryフィールドがある場合はそれをタグとして扱う
            $spot->tags = [$data['category']];
        } else {
            $spot->tags = [];
        }
        
        $spot->address = $data['address'] ?? '';
        $spot->business_hours = $data['business_hours'] ?? '';
        $spot->website_url = $data['website_url'] ?? '';
        $spot->image_url = $data['image_url'] ?? '';
        $spot->latitude = (float)($data['latitude'] ?? 0);
        $spot->longitude = (float)($data['longitude'] ?? 0);
        
        return $spot;
    }

    /**
     * Spotオブジェクトを配列に変換
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'tags' => $this->tags,
            'address' => $this->address,
            'business_hours' => $this->business_hours,
            'website_url' => $this->website_url,
            'image_url' => $this->image_url,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ];
    }
    
    /**
     * 指定されたタグを持っているかチェック
     */
    public function hasTag(string $tag): bool
    {
        return in_array($tag, $this->tags);
    }
    
    /**
     * 指定されたタグのいずれかを持っているかチェック
     */
    public function hasAnyTag(array $tags): bool
    {
        if (empty($tags)) {
            return true;
        }
        
        foreach ($tags as $tag) {
            if ($this->hasTag($tag)) {
                return true;
            }
        }
        
        return false;
    }
}
