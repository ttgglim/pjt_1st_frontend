import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Plus, Download, Compare } from 'lucide-react';
import { seoulDistrictsData, getDistrictData } from '../data/seoulSalesData';

export function RegionComparison() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['강남구', '서초구']);
  const [newRegion, setNewRegion] = useState<string>('');

  const seoulDistricts = seoulDistrictsData.map(district => district.name);

  const comparisonData = [
    {
      metric: '유동인구',
      강남구: 23000,
      서초구: 18500,
      마포구: 15200
    },
    {
      metric: '사업체수',
      강남구: 1245,
      서초구: 987,
      마포구: 834
    },
    {
      metric: '평균매출',
      강남구: 847,
      서초구: 692,
      마포구: 573
    },
    {
      metric: '임대료',
      강남구: 4.5,
      서초구: 3.8,
      마포구: 2.9
    }
  ];

  const radarData = [
    {
      subject: '유동인구',
      강남구: 95,
      서초구: 80,
      마포구: 65,
      fullMark: 100
    },
    {
      subject: '사업체밀도',
      강남구: 88,
      서초구: 72,
      마포구: 58,
      fullMark: 100
    },
    {
      subject: '매출수준',
      강남구: 92,
      서초구: 78,
      마포구: 62,
      fullMark: 100
    },
    {
      subject: '상권활성도',
      강남구: 90,
      서초구: 75,
      마포구: 68,
      fullMark: 100
    },
    {
      subject: '접근성',
      강남구: 85,
      서초구: 82,
      마포구: 78,
      fullMark: 100
    },
    {
      subject: '경쟁강도',
      강남구: 95,
      서초구: 80,
      마포구: 60,
      fullMark: 100
    }
  ];

  const addRegion = () => {
    if (newRegion && !selectedRegions.includes(newRegion) && selectedRegions.length < 3) {
      setSelectedRegions([...selectedRegions, newRegion]);
      setNewRegion('');
    }
  };

  const removeRegion = (region: string) => {
    if (selectedRegions.length > 1) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    }
  };

  const getRegionScore = (region: string) => {
    const data = getDistrictData(region);
    if (!data) return 70;
    
    // 매출, 성장률, 사업체 수를 기반으로 점수 계산
    const salesScore = Math.min((data.sales / 3000) * 40, 40); // 최대 40점
    const growthScore = Math.min((data.growthRate / 15) * 30, 30); // 최대 30점
    const businessScore = Math.min((data.businesses / 50000) * 30, 30); // 최대 30점
    
    return Math.round(salesScore + growthScore + businessScore);
  };

  const getRegionRank = (region: string) => {
    const sortedDistricts = seoulDistrictsData
      .sort((a, b) => b.sales - a.sales)
      .map(district => district.name);
    
    return sortedDistricts.indexOf(region) + 1;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2>지역 비교 분석</h2>
          <p className="text-muted-foreground">최대 3개 지역까지 비교 가능합니다</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          비교 결과 저장
        </Button>
      </div>

      {/* 지역 선택 */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <h3>비교할 지역 선택</h3>
          <div className="flex items-center gap-2">
            <Select value={newRegion} onValueChange={setNewRegion}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="지역 추가" />
              </SelectTrigger>
              <SelectContent>
                {seoulDistricts
                  .filter(district => !selectedRegions.includes(district))
                  .map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              onClick={addRegion}
              disabled={!newRegion || selectedRegions.length >= 3}
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedRegions.map((region) => (
            <Badge
              key={region}
              variant="secondary"
              className="px-3 py-2 cursor-pointer hover:bg-secondary/80"
              onClick={() => removeRegion(region)}
            >
              {region}
              {selectedRegions.length > 1 && (
                <span className="ml-2 text-xs">×</span>
              )}
            </Badge>
          ))}
        </div>
      </Card>

      {/* 종합 점수 비교 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectedRegions.map((region) => (
          <Card key={region} className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">{region}</h3>
              <div className="text-3xl font-bold text-primary mb-2">
                {getRegionScore(region)}점
              </div>
              <Badge variant="outline">서울시 {getRegionRank(region)}위</Badge>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>상권 활성도</span>
                  <span className="font-medium">높음</span>
                </div>
                <div className="flex justify-between">
                  <span>창업 적합도</span>
                  <span className="font-medium">우수</span>
                </div>
                <div className="flex justify-between">
                  <span>경쟁 강도</span>
                  <span className="font-medium">높음</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 상세 비교 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 막대 차트 */}
        <Card className="p-6">
          <h3 className="mb-4">주요 지표 비교</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="강남구" fill="#ff6b6b" />
              <Bar dataKey="서초구" fill="#4ecdc4" />
              <Bar dataKey="마포구" fill="#45b7d1" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 레이더 차트 */}
        <Card className="p-6">
          <h3 className="mb-4">종합 역량 비교</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="강남구"
                dataKey="강남구"
                stroke="#ff6b6b"
                fill="#ff6b6b"
                fillOpacity={0.1}
              />
              <Radar
                name="서초구"
                dataKey="서초구"
                stroke="#4ecdc4"
                fill="#4ecdc4"
                fillOpacity={0.1}
              />
              <Radar
                name="마포구"
                dataKey="마포구"
                stroke="#45b7d1"
                fill="#45b7d1"
                fillOpacity={0.1}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 상세 비교 테이블 */}
      <Card className="p-6">
        <h3 className="mb-4">상세 지표 비교</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">지표</th>
                {selectedRegions.map((region) => (
                  <th key={region} className="text-center p-2">{region}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-2 font-medium">유동인구 (명)</td>
                <td className="p-2 text-center">23,000</td>
                <td className="p-2 text-center">18,500</td>
                {selectedRegions.length > 2 && <td className="p-2 text-center">15,200</td>}
              </tr>
              <tr>
                <td className="p-2 font-medium">총 사업체 수 (개)</td>
                <td className="p-2 text-center">1,245</td>
                <td className="p-2 text-center">987</td>
                {selectedRegions.length > 2 && <td className="p-2 text-center">834</td>}
              </tr>
              <tr>
                <td className="p-2 font-medium">평균 매출 (만원)</td>
                <td className="p-2 text-center">847</td>
                <td className="p-2 text-center">692</td>
                {selectedRegions.length > 2 && <td className="p-2 text-center">573</td>}
              </tr>
              <tr>
                <td className="p-2 font-medium">평균 임대료 (만원/㎡)</td>
                <td className="p-2 text-center">4.5</td>
                <td className="p-2 text-center">3.8</td>
                {selectedRegions.length > 2 && <td className="p-2 text-center">2.9</td>}
              </tr>
              <tr>
                <td className="p-2 font-medium">경쟁 강도</td>
                <td className="p-2 text-center">
                  <Badge variant="destructive" className="text-xs">높음</Badge>
                </td>
                <td className="p-2 text-center">
                  <Badge variant="secondary" className="text-xs">보통</Badge>
                </td>
                {selectedRegions.length > 2 && (
                  <td className="p-2 text-center">
                    <Badge variant="outline" className="text-xs">낮음</Badge>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}