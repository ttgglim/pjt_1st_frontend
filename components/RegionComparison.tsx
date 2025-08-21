import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, Download } from 'lucide-react';
import { seoulDistrictsData } from '../data/seoulSalesData';
import { apiService, PopulationStatistics } from '../services/api';

interface ComparisonData {
  metric: string;
  [key: string]: any;
}

export function RegionComparison() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['강남구', '서초구']);
  const [newRegion, setNewRegion] = useState<string>('');
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('총 인구');

  const seoulDistricts = seoulDistrictsData.map(district => district.name);

  // 선택된 지역들의 데이터를 가져오는 함수
  const fetchComparisonData = async () => {
    if (selectedRegions.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const regionDataPromises = selectedRegions.map(async (region) => {
        const [populationData, avgMonthlySales, recentBusinesses] = await Promise.all([
          apiService.getDistrictByName(region),
          apiService.getAverageMonthlySalesByDistrict(region),
          apiService.getRecentBusinessesByDistrict(region)
        ]);
        
        return {
          region,
          population: populationData?.totalPopulation || 0,
          businesses: recentBusinesses || 0,
          monthlySales: avgMonthlySales || 0
        };
      });
      
      const regionData = await Promise.all(regionDataPromises);
      
      // 비교 데이터 구성
      const newComparisonData: ComparisonData[] = [
        {
          metric: '총 인구',
          ...regionData.reduce((acc, data) => {
            acc[data.region] = data.population;
            return acc;
          }, {} as any)
        },
        {
          metric: '사업체 수',
          ...regionData.reduce((acc, data) => {
            acc[data.region] = data.businesses;
            return acc;
          }, {} as any)
        },
        {
          metric: '월 평균 매출',
          ...regionData.reduce((acc, data) => {
            acc[data.region] = data.monthlySales;
            return acc;
          }, {} as any)
        }
      ];
      
      setComparisonData(newComparisonData);
    } catch (err) {
      console.error('지역 비교 데이터 조회 실패:', err);
      setError('지역 비교 데이터를 불러오는데 실패했습니다.');
      // 기본 데이터로 fallback
      setComparisonData([
        {
          metric: '총 인구',
          강남구: 550000,
          서초구: 450000
        },
        {
          metric: '사업체 수',
          강남구: 12450,
          서초구: 9870
        },
        {
          metric: '월 평균 매출',
          강남구: 8470000,
          서초구: 6920000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 선택된 지표에 대한 데이터만 반환하는 함수
  const getSelectedMetricData = () => {
    if (comparisonData.length === 0) return [];
    
    const selectedData = comparisonData.find(item => item.metric === selectedMetric);
    if (!selectedData) return [];
    
    return selectedRegions.map(region => ({
      region,
      value: selectedData[region] || 0
    }));
  };

  // Y축 범위 계산 함수
  const getYAxisDomain = () => {
    const selectedData = getSelectedMetricData();
    if (selectedData.length === 0) return [0, 100];
    
    const values = selectedData.map(item => item.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    // 각 지표별로 적절한 범위 설정
    if (selectedMetric === '총 인구') {
      const maxInTenThousands = Math.ceil(maxValue / 10000);
      return [0, Math.ceil(maxInTenThousands / 10) * 10 * 10000];
    } else if (selectedMetric === '사업체 수') {
      // 사업체 수는 데이터 범위에 맞게 적절한 범위 설정
      if (maxValue <= 100) {
        return [0, Math.ceil(maxValue / 10) * 10];
      } else if (maxValue <= 1000) {
        return [0, Math.ceil(maxValue / 100) * 100];
      } else {
        return [0, Math.ceil(maxValue / 1000) * 1000];
      }
    } else if (selectedMetric === '월 평균 매출') {
      // 월 평균 매출은 억 단위로 적절한 범위 설정 (100 단위로 조정)
      const maxInBillions = Math.ceil(maxValue / 100000000);
      return [0, Math.ceil(maxInBillions / 100) * 100 * 100000000];
    }
    
    return [0, Math.ceil(maxValue / 10) * 10];
  };

  // Y축 라벨 설정
  const getYAxisLabel = () => {
    if (selectedMetric === '총 인구') {
      return { value: '(만)', position: 'top', offset: 10, style: { textAnchor: 'middle' } };
    }
    return undefined;
  };

  // Y축 틱 포맷터
  const getYAxisTickFormatter = (value: number) => {
    if (selectedMetric === '총 인구') {
      return `${(value / 10000).toFixed(0)}`;
    } else if (selectedMetric === '사업체 수') {
      return value.toLocaleString();
    } else if (selectedMetric === '월 평균 매출') {
      return `${(value / 100000000).toFixed(0)}`;
    }
    return value.toString();
  };

  // 툴팁 포맷터
  const getTooltipFormatter = (value: number) => {
    if (selectedMetric === '총 인구') {
      return `${(value / 10000).toFixed(1)}만명`;
    } else if (selectedMetric === '사업체 수') {
      return `${value.toLocaleString()}개`;
    } else if (selectedMetric === '월 평균 매출') {
      return `${(value / 100000000).toFixed(1)}억원`;
    }
    return value.toString();
  };

  // 선택된 지역이 변경될 때마다 데이터 다시 가져오기
  useEffect(() => {
    fetchComparisonData();
  }, [selectedRegions]);

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

  // 테이블 데이터 생성
  const getTableData = () => {
    if (comparisonData.length === 0) return [];
    
    const populationData = comparisonData.find(item => item.metric === '총 인구');
    const businessData = comparisonData.find(item => item.metric === '사업체 수');
    const salesData = comparisonData.find(item => item.metric === '월 평균 매출');
    
    return [
      {
        label: '총 인구',
        values: selectedRegions.map(region => 
          populationData?.[region] ? `${(populationData[region] / 10000).toFixed(1)}만명` : '정보없음'
        )
      },
      {
        label: '총 사업체 수',
        values: selectedRegions.map(region => 
          businessData?.[region] ? `${businessData[region].toLocaleString()}개` : '정보없음'
        )
      },
      {
        label: '월 평균 매출',
        values: selectedRegions.map(region => 
          salesData?.[region] ? `${(salesData[region] / 100000000).toFixed(1)}억원` : '정보없음'
        )
      }
    ];
  };

  return (
    <div className="space-y-6">
             {/* 헤더 */}
       <div>
         <h2>지역 비교 분석</h2>
         <p className="text-muted-foreground">최대 3개 지역까지 비교 가능합니다</p>
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

                           {/* 주요 지표 비교 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">주요 지표 비교</h3>
            <div className="flex items-center gap-4">
              {/* 지표 선택 버튼들 */}
              <div className="flex gap-2">
                <Button
                  variant={selectedMetric === '총 인구' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric('총 인구')}
                >
                  총 인구
                </Button>
                <Button
                  variant={selectedMetric === '사업체 수' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric('사업체 수')}
                >
                  사업체 수
                </Button>
                <Button
                  variant={selectedMetric === '월 평균 매출' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric('월 평균 매출')}
                >
                  월 평균 매출
                </Button>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  데이터 로딩 중...
                </div>
              )}
              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}
            </div>
          </div>
          
                                <div className="relative">
             <ResponsiveContainer width="100%" height={400}>
                               <BarChart data={getSelectedMetricData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="region" 
                    tick={{ fontSize: 14, fontWeight: 500 }}
                  />
                  <YAxis 
                    domain={getYAxisDomain()}
                    tickFormatter={getYAxisTickFormatter}
                    width={60}
                    tick={{ fontSize: 14, fontWeight: 500 }}
                  />
                 <Tooltip 
                   formatter={(value: any, name: any) => {
                     return [getTooltipFormatter(value), name];
                   }}
                 />
                                   <Bar 
                    dataKey="value" 
                    fill="#3b82f6"
                    barSize={80}
                  >
                                         {getSelectedMetricData().map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={
                         index === 0 ? '#ef4444' : // 첫 번째: 빨간색
                         index === 1 ? '#3b82f6' : // 두 번째: 파란색
                         '#22c55e' // 세 번째: 초록색
                       } />
                     ))}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
                                                       {selectedMetric === '총 인구' && (
                 <div className="absolute top-2 left-0 text-sm text-gray-600 font-medium">
                   (만)
                 </div>
               )}
                            {selectedMetric === '월 평균 매출' && (
                 <div className="absolute top-2 left-0 text-sm text-gray-600 font-medium">
                   (억)
                 </div>
               )}
           </div>
        </Card>

      {/* 상세 비교 테이블 */}
      <Card className="p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-800">상세 지표 비교</h3>
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
              {getTableData().map((row, index) => (
                <tr key={index}>
                  <td className="p-2 font-medium">{row.label}</td>
                  {row.values.map((value, valueIndex) => (
                    <td key={valueIndex} className="p-2 text-center">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}