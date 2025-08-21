import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Users, Building, DollarSign } from 'lucide-react';
import { CompleteSeoulMap } from './CompleteSeoulMap';

import { apiService, PopulationStatistics } from '../services/api';

interface MapViewProps {
  selectedRegion: string;
  onRegionSelect: (region: string) => void;
}

export function MapView({ selectedRegion, onRegionSelect }: MapViewProps) {
  const [populationData, setPopulationData] = useState<PopulationStatistics | null>(null);
  const [avgMonthlySales, setAvgMonthlySales] = useState<number | null>(null);
  const [recentBusinesses, setRecentBusinesses] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [salesLoading, setSalesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salesError, setSalesError] = useState<string | null>(null);

  // 선택된 지역의 인구 데이터 가져오기
  useEffect(() => {
    const fetchPopulationData = async () => {
      if (!selectedRegion) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await apiService.getDistrictByName(selectedRegion);
        setPopulationData(data);
      } catch (err) {
        console.error('인구 데이터 조회 실패:', err);
        setError('인구 데이터를 불러오는데 실패했습니다.');
        setPopulationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPopulationData();
  }, [selectedRegion]);

  // 월 평균 매출과 최근 사업체 수 데이터 가져오기
  useEffect(() => {
    const fetchSalesData = async () => {
      if (!selectedRegion) return;
      
      setSalesLoading(true);
      setSalesError(null);
      
      try {
        const [salesData, businessesData] = await Promise.all([
          apiService.getAverageMonthlySalesByDistrict(selectedRegion),
          apiService.getRecentBusinessesByDistrict(selectedRegion)
        ]);
        
        setAvgMonthlySales(salesData);
        setRecentBusinesses(businessesData);
      } catch (err) {
        console.error('월 평균 매출/최근 사업체 수 데이터 조회 실패:', err);
        setSalesError('매출/사업체 데이터를 불러오는데 실패했습니다.');
        setAvgMonthlySales(null);
        setRecentBusinesses(null);
      } finally {
        setSalesLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedRegion]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 지도 영역 */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">서울시 상권 지도</h2>
          </div>
          
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-96 overflow-hidden">
            <CompleteSeoulMap
              selectedRegion={selectedRegion}
              onRegionSelect={onRegionSelect}
              className="w-full h-full"
            />
          </div>
        </Card>
      </div>

      {/* 선택된 지역 정보 */}
      <div>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3>{selectedRegion}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">총 인구</span>
              </div>
              <span className="font-medium">
                               {loading ? (
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
               ) : error ? (
                 <span className="text-red-500 text-xs">오류</span>
               ) : populationData ? (
                 `${(populationData.totalPopulation / 10000).toFixed(1)}만명`
               ) : (
                 '정보없음'
               )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-green-600" />
                <span className="text-sm">사업체 수</span>
              </div>
              <span className="font-medium">
                {salesLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                ) : salesError ? (
                  <span className="text-red-500 text-xs">오류</span>
                ) : recentBusinesses ? (
                  `${recentBusinesses}개`
                ) : (
                  '정보없음'
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="text-sm">월 평균 매출</span>
              </div>
              <span className="font-medium">
                {salesLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                ) : salesError ? (
                  <span className="text-red-500 text-xs">오류</span>
                ) : avgMonthlySales ? (
                  `${(avgMonthlySales / 100000000).toFixed(1)}억원`
                ) : (
                  '정보없음'
                )}
              </span>
            </div>


          </div>
        </Card>
      </div>
    </div>
  );
}