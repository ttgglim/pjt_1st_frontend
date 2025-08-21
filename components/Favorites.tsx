import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Heart, Search, MapPin, TrendingUp, X, Download, Share } from 'lucide-react';
import { getDistrictData, seoulDistrictsData } from '../data/seoulSalesData';

interface FavoritesProps {
  favorites: string[];
  onRemoveFromFavorites: (region: string) => void;
  onRegionSelect: (region: string) => void;
}

export function Favorites({ favorites, onRemoveFromFavorites, onRegionSelect }: FavoritesProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getFavoriteData = (region: string) => {
    const data = getDistrictData(region);
    if (!data) return null;
    
    return {
      population: `${(data.population / 1000).toFixed(0)}천`,
      businesses: `${(data.businesses / 1000).toFixed(1)}천`,
      sales: `${data.sales}억원`,
      trend: `${data.growthRate > 0 ? '+' : ''}${data.growthRate}%`,
      color: 'bg-blue-500'
    };
  };

  const getRegionRank = (region: string) => {
    const sortedDistricts = seoulDistrictsData
      .sort((a, b) => b.sales - a.sales)
      .map(district => district.name);
    
    return sortedDistricts.indexOf(region) + 1;
  };

  const filteredFavorites = favorites.filter(fav => 
    fav.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2>즐겨찾기</h2>
          <p className="text-muted-foreground">관심 지역을 한눈에 관리하고 비교하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            즐겨찾기 내보내기
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            공유하기
          </Button>
        </div>
      </div>

      {/* 검색 */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="즐겨찾기에서 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">즐겨찾기 수</p>
              <p className="text-2xl font-bold">{favorites.length}개</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">평균 점수</p>
              <p className="text-2xl font-bold">78점</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">최고 순위</p>
              <p className="text-2xl font-bold">1위</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-sm text-muted-foreground">추천 지역</p>
              <p className="text-2xl font-bold">강남구</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 즐겨찾기 목록 */}
      {filteredFavorites.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {searchTerm ? '검색 결과가 없습니다' : '즐겨찾기가 비어있습니다'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? '다른 검색어를 시도해보세요' : '관심 있는 지역을 즐겨찾기에 추가해보세요'}
          </p>
          {!searchTerm && (
            <Button onClick={() => onRegionSelect('강남구')}>
              지역 둘러보기
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((region) => {
            const data = getFavoriteData(region);
            const rank = getRegionRank(region);
            
            if (!data) return null;
            
            return (
              <Card key={region} className="p-6 relative group hover:shadow-lg transition-shadow">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveFromFavorites(region)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 ${data.color} rounded-full`}></div>
                  <h3 className="font-medium">{region}</h3>
                  <Badge variant="outline" className="ml-auto">순위 {rank}위</Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">인구</span>
                    <span className="font-medium">{data.population}명</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">사업체 수</span>
                    <span className="font-medium">{data.businesses}개</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">총 매출</span>
                    <span className="font-medium">{data.sales}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">전년 대비</span>
                    <span className={`font-medium flex items-center gap-1 ${
                      data.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 ${
                        data.trend.startsWith('-') ? 'rotate-180' : ''
                      }`} />
                      {data.trend}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onRegionSelect(region)}
                  >
                    상세 보기
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 추천 지역 */}
      {filteredFavorites.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">추천 지역</h3>
          <p className="text-sm text-muted-foreground mb-4">
            즐겨찾기 기반으로 비슷한 특성을 가진 지역을 추천해드립니다
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => onRegionSelect('송파구')}
            >
              송파구 (유사도 85%)
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => onRegionSelect('영등포구')}
            >
              영등포구 (유사도 78%)
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => onRegionSelect('용산구')}
            >
              용산구 (유사도 72%)
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
}