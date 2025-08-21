import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Building, DollarSign, Heart } from 'lucide-react';
import { getDistrictData } from '../data/seoulSalesData';
import { apiService, PopulationStatistics } from '../services/api';

interface DashboardProps {
  selectedRegion: string;
  onAddToFavorites: (region: string) => void;
  favorites: string[];
}

export function Dashboard({ selectedRegion, onAddToFavorites, favorites }: DashboardProps) {
  const [populationData, setPopulationData] = useState<PopulationStatistics | null>(null);
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
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

  // 업종별 월별 매출 데이터 가져오기
  useEffect(() => {
    const fetchMonthlySalesData = async () => {
      if (!selectedRegion) return;
      
      setSalesLoading(true);
      setSalesError(null);
      
      try {
        const data = await apiService.getCategoryGroupMonthlySalesByDistrict(selectedRegion);
        setMonthlySalesData(data);
      } catch (err) {
        console.error('월별 매출 데이터 조회 실패:', err);
        setSalesError('월별 매출 데이터를 불러오는데 실패했습니다.');
        setMonthlySalesData([]);
      } finally {
        setSalesLoading(false);
      }
    };

    fetchMonthlySalesData();
  }, [selectedRegion]);

  // 월 평균 매출과 최근 사업체 수 데이터 가져오기
  useEffect(() => {
    const fetchSalesData = async () => {
      if (!selectedRegion) return;
      
      try {
        const [salesData, businessesData] = await Promise.all([
          apiService.getAverageMonthlySalesByDistrict(selectedRegion),
          apiService.getRecentBusinessesByDistrict(selectedRegion)
        ]);
        
        setAvgMonthlySales(salesData);
        setRecentBusinesses(businessesData);
      } catch (err) {
        console.error('월 평균 매출/최근 사업체 수 데이터 조회 실패:', err);
        setAvgMonthlySales(null);
        setRecentBusinesses(null);
      }
    };

    fetchSalesData();
  }, [selectedRegion]);

  // 연령별 성별 인구 데이터 (백엔드 데이터 기반)
  const ageGenderData = populationData ? [
    { age: '20대', male: populationData.age20To29Male, female: populationData.age20To29Female },
    { age: '30대', male: populationData.age30To39Male, female: populationData.age30To39Female },
    { age: '40대', male: populationData.age40To49Male, female: populationData.age40To49Female },
    { age: '50대', male: populationData.age50To59Male, female: populationData.age50To59Female },
    { age: '60대+', male: populationData.age60PlusMale, female: populationData.age60PlusFemale }
  ] : [
    { age: '20대', male: 45, female: 52 },
    { age: '30대', male: 38, female: 41 },
    { age: '40대', male: 32, female: 35 },
    { age: '50대', male: 28, female: 30 },
    { age: '60대+', male: 20, female: 25 }
  ];

  // 백엔드 데이터를 기반으로 한 업종별 월별 매출 데이터
  const salesData = monthlySalesData.length > 0 ? 
    monthlySalesData[0]?.monthlyData?.map((item: any) => {
      const month = item.yearMonth ? `${item.yearMonth.substring(4, 6)}월` : '';
      const data: any = { month };
      
      // 각 업종 분류별 데이터 추가
      monthlySalesData.forEach((categoryGroup: any) => {
        const categoryData = categoryGroup.monthlyData?.find((m: any) => m.yearMonth === item.yearMonth);
        if (categoryData) {
          data[categoryGroup.categoryGroup] = Math.round(categoryData.averageAmount / 100000000 * 10) / 10; // 억 단위로 변환 (소수점 1자리)
        }
      });
      
      return data;
    }).filter((item: any) => item.month) || [] : [
      { month: '1월', '한식/중식/양식/일식': 4.5, '분식/치킨/패스트푸드': 2.3, '제과점/카페/호프': 1.8 },
      { month: '2월', '한식/중식/양식/일식': 3.8, '분식/치킨/패스트푸드': 2.1, '제과점/카페/호프': 1.6 },
      { month: '3월', '한식/중식/양식/일식': 5.2, '분식/치킨/패스트푸드': 2.8, '제과점/카페/호프': 2.0 },
      { month: '4월', '한식/중식/양식/일식': 4.9, '분식/치킨/패스트푸드': 2.6, '제과점/카페/호프': 1.9 },
      { month: '5월', '한식/중식/양식/일식': 5.4, '분식/치킨/패스트푸드': 3.0, '제과점/카페/호프': 2.2 },
      { month: '6월', '한식/중식/양식/일식': 5.8, '분식/치킨/패스트푸드': 3.2, '제과점/카페/호프': 2.4 }
    ];

  

  const businessTypeData = [
    { name: '음식점', value: 35, color: '#ff6b6b' },
    { name: '카페', value: 22, color: '#4ecdc4' },
    { name: '소매업', value: 18, color: '#45b7d1' },
    { name: '서비스업', value: 15, color: '#96ceb4' },
    { name: '기타', value: 10, color: '#ffeaa7' }
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2>{selectedRegion} 상권 분석</h2>
          <p className="text-muted-foreground">실시간 데이터 기반 종합 분석 리포트</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={favorites.includes(selectedRegion) ? "default" : "outline"}
            size="sm"
            onClick={() => onAddToFavorites(selectedRegion)}
          >
            <Heart className="h-4 w-4 mr-2" />
            즐겨찾기
          </Button>
        </div>
      </div>

      {/* 주요 지표 카드 */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 인구</p>
              <p className="text-2xl font-bold">
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                ) : error ? (
                  <span className="text-red-500 text-sm">오류</span>
                ) : populationData ? (
                  `${(populationData.totalPopulation / 10000).toFixed(1)}만명`
                ) : (
                  '정보없음'
                )}
              </p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                 +0% 전년 대비
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">총 사업체</p>
              <p className="text-2xl font-bold">
                 {recentBusinesses ? `${recentBusinesses}개` : '정보없음'}
              </p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                 +0% 전월 대비
              </p>
            </div>
            <Building className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
                             <p className="text-sm text-muted-foreground">월 평균 매출</p>
              <p className="text-2xl font-bold">
                 {avgMonthlySales ? `${(avgMonthlySales / 100000000).toFixed(1)}억원` : '정보없음'}
               </p>
               <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                 <TrendingUp className="h-3 w-3" />
                 +0% 전년 대비
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        
      </div>

      {/* 상세 분석 탭 */}
      <Tabs defaultValue="population">
         <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="population">인구 분석</TabsTrigger>
          <TabsTrigger value="sales">매출 분석</TabsTrigger>
          <TabsTrigger value="business">업종 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="population" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">연령별 성별 인구 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageGenderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="male" fill="#3b82f6" name="남성" />
                <Bar dataKey="female" fill="#ef4444" name="여성" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Badge variant="outline" className="p-3 justify-center">
                               {loading ? (
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                 ) : error ? (
                   <span className="text-red-500 text-xs">오류</span>
                 ) : populationData ? (
                   `거주인구: ${(populationData.residentPopulation / 10000).toFixed(1)}만명`
                 ) : (
                   '거주인구: 정보없음'
                 )}
            </Badge>
            <Badge variant="outline" className="p-3 justify-center">
                               {loading ? (
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                 ) : error ? (
                   <span className="text-red-500 text-xs">오류</span>
                 ) : populationData ? (
                   `직장인구: ${(populationData.workerPopulation / 10000).toFixed(1)}만명`
                 ) : (
                   '직장인구: 정보없음'
                 )}
            </Badge>
            <Badge variant="outline" className="p-3 justify-center">
                               {loading ? (
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                 ) : error ? (
                   <span className="text-red-500 text-xs">오류</span>
                 ) : populationData ? (
                   `유동인구: ${(populationData.floatingPopulation / 10000).toFixed(1)}만명`
                 ) : (
                   '유동인구: 정보없음'
                 )}
            </Badge>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="p-6">
                         <div className="flex items-center justify-between mb-4">
               <h3>업종별/월별 매출 추이 (억 단위)</h3>
              {salesLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  데이터 로딩 중...
                </div>
              )}
              {salesError && (
                <div className="text-sm text-red-500">
                  {salesError}
                </div>
              )}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                                 <Tooltip 
                   formatter={(value: any, name: any) => [
                     `${value}억원`, 
                     name
                   ]}
                 />
                <Line type="monotone" dataKey="한식/중식/양식/일식" stroke="#ff6b6b" strokeWidth={2} />
                <Line type="monotone" dataKey="분식/치킨/패스트푸드" stroke="#4ecdc4" strokeWidth={2} />
                <Line type="monotone" dataKey="제과점/카페/호프" stroke="#45b7d1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff6b6b' }}></div>
                <span>한식/중식/양식/일식</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4ecdc4' }}></div>
                <span>분식/치킨/패스트푸드</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#45b7d1' }}></div>
                <span>제과점/카페/호프</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        

        <TabsContent value="business" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4">업종별 분포</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={businessTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {businessTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}