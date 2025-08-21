import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { MapView } from './components/MapView';
import { Dashboard } from './components/Dashboard';
import { RegionComparison } from './components/RegionComparison';
import { Favorites } from './components/Favorites';
import PopulationData from './components/PopulationData';

import { SearchBar } from './components/SearchBar';
import { Map, BarChart3, GitCompare, Heart, Building2, Users } from 'lucide-react';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState<string>('강남구');
  const [favorites, setFavorites] = useState<string[]>(['강남구', '서초구']);

  const addToFavorites = (region: string) => {
    if (!favorites.includes(region)) {
      setFavorites([...favorites, region]);
    }
  };

  const removeFromFavorites = (region: string) => {
    setFavorites(favorites.filter(fav => fav !== region));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 메인 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                상권정보 제공 서비스
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              서울시 25개 자치구의 상세한 상권 분석 데이터를 통해 최적의 창업 위치를 찾아보세요
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              onRegionSelect={setSelectedRegion}
              selectedRegion={selectedRegion}
            />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm p-1 rounded-xl shadow-lg">
            <TabsTrigger value="map" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Map className="h-4 w-4" />
              지도 검색
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <BarChart3 className="h-4 w-4" />
              상권 분석
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <GitCompare className="h-4 w-4" />
              지역 비교
            </TabsTrigger>
            <TabsTrigger value="population" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Users className="h-4 w-4" />
              인구 통계
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Heart className="h-4 w-4" />
              즐겨찾기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-8">
            <MapView 
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
              onAddToFavorites={addToFavorites}
              favorites={favorites}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-8">
            <Dashboard 
              selectedRegion={selectedRegion}
              onAddToFavorites={addToFavorites}
              favorites={favorites}
            />
          </TabsContent>

          <TabsContent value="comparison" className="mt-8">
            <RegionComparison />
          </TabsContent>

          <TabsContent value="population" className="mt-8">
            <PopulationData />
          </TabsContent>

          <TabsContent value="favorites" className="mt-8">
            <Favorites 
              favorites={favorites}
              onRemoveFromFavorites={removeFromFavorites}
              onRegionSelect={setSelectedRegion}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}