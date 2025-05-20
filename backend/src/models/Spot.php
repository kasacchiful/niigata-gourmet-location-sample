<?php

namespace App\Models;

/**
 * グルメスポットモデル
 */
class Spot
{
    public string $id;
    public string $name;
    public string $category;
    public string $address;
    public string $business_hours;
    public string $phone;
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
        $spot->category = $data['category'] ?? '';
        $spot->address = $data['address'] ?? '';
        $spot->business_hours = $data['business_hours'] ?? '';
        $spot->phone = $data['phone'] ?? '';
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
            'category' => $this->category,
            'address' => $this->address,
            'business_hours' => $this->business_hours,
            'phone' => $this->phone,
            'website_url' => $this->website_url,
            'image_url' => $this->image_url,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ];
    }
}
