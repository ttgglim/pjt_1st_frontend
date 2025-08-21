import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Building, DollarSign } from 'lucide-react';
import { getDistrictData } from '../data/seoulSalesData';
import { apiService, PopulationStatistics } from '../services/api';

interface DashboardProps {
  selectedRegion: string;
}

interface BusinessTypeData {
  name: string;
  value: number;
  color: string;
  totalAmount: number;
}

export function Dashboard({ selectedRegion }: DashboardProps) {
  const [populationData, setPopulationData] = useState<PopulationStatistics | null>(null);
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
  const [avgMonthlySales, setAvgMonthlySales] = useState<number | null>(null);
  const [recentBusinesses, setRecentBusinesses] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [salesLoading, setSalesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salesError, setSalesError] = useState<string | null>(null);
  
  // 업종별 분포 상태 추가
  const [businessTypeData, setBusinessTypeData] = useState<BusinessTypeData[]>([
    { name: '음식점', value: 35, color: '#ff6b6b', totalAmount: 0 },
    { name: '카페', value: 22, color: '#4ecdc4', totalAmount: 0 },
    { name: '소매업', value: 18, color: '#45b7d1', totalAmount: 0 },
    { name: '서비스업', value: 15, color: '#96ceb4', totalAmount: 0 },
    { name: '기타', value: 10, color: '#ffeaa7', totalAmount: 0 }
  ]);
  const [businessTypeLoading, setBusinessTypeLoading] = useState(false);
  const [businessTypeError, setBusinessTypeError] = useState<string | null>(null);

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

  // 업종별 분포 데이터 가져오기
  useEffect(() => {
    const fetchBusinessTypeData = async () => {
      if (!selectedRegion) return;
      
      setBusinessTypeLoading(true);
      setBusinessTypeError(null);
      
      try {
        console.log('업종별 분포 데이터 요청 시작:', selectedRegion);
        const categoryStats = await apiService.getCategorySalesStatistics(selectedRegion);
        console.log('업종별 분포 데이터 응답:', categoryStats);
        
        // 업종을 그룹화하고 분포 계산
        const groupedCategories = groupCategoriesByType(categoryStats);
        console.log('그룹화된 업종:', groupedCategories);
        
        const totalAmount = groupedCategories.reduce((sum, item) => sum + item.totalAmount, 0);
        console.log('총 매출 금액:', totalAmount);
        
        const distributionData = groupedCategories.map(item => ({
          name: item.categoryName,
          value: totalAmount > 0 ? Math.round((item.totalAmount / totalAmount) * 100 * 10) / 10 : 0,
          color: getCategoryColor(item.categoryName),
          totalAmount: item.totalAmount
        }));
        
        // 매출 금액 기준으로 정렬
        distributionData.sort((a, b) => b.totalAmount - a.totalAmount);
        console.log('최종 분포 데이터:', distributionData);
        
        setBusinessTypeData(distributionData);
      } catch (err) {
        console.error('업종별 분포 데이터 조회 실패:', err);
        setBusinessTypeError('업종별 분포 데이터를 불러오는데 실패했습니다.');
        
        // 지역별로 다른 기본값 제공
        const defaultData = getDefaultBusinessTypeData(selectedRegion);
        setBusinessTypeData(defaultData);
      } finally {
        setBusinessTypeLoading(false);
      }
    };

    fetchBusinessTypeData();
  }, [selectedRegion]);

  // 업종 그룹화 함수
  const groupCategoriesByType = (categoryStats: any[]) => {
    const grouped: { [key: string]: { categoryName: string; totalAmount: number; totalCount: number } } = {};
    
    categoryStats.forEach(stat => {
      const groupName = getCategoryGroup(stat.serviceCategoryName);
      if (!grouped[groupName]) {
        grouped[groupName] = {
          categoryName: groupName,
          totalAmount: 0,
          totalCount: 0
        };
      }
      grouped[groupName].totalAmount += Number(stat.totalAmount) || 0;
      grouped[groupName].totalCount += stat.totalCount || 0;
    });
    
    return Object.values(grouped);
  };

  // 업종 분류 함수
  const getCategoryGroup = (serviceCategoryName: string): string => {
    if (!serviceCategoryName) return '기타';
    
    const name = serviceCategoryName.toLowerCase();
    
    if (name.includes('한식') || name.includes('중식') || name.includes('양식') || 
        name.includes('일식') || name.includes('음식') || name.includes('식당') ||
        name.includes('레스토랑') || name.includes('요리')) {
      return '한식/중식/양식/일식';
    } else if (name.includes('분식') || name.includes('치킨') || name.includes('패스트푸드') ||
               name.includes('피자') || name.includes('햄버거') || name.includes('도넛') ||
               name.includes('아이스크림') || name.includes('샌드위치')) {
      return '분식/치킨/패스트푸드';
    } else if (name.includes('카페') || name.includes('커피') || name.includes('차') ||
               name.includes('디저트') || name.includes('제과') || name.includes('베이커리') ||
               name.includes('음료') || name.includes('호프') || name.includes('주점')) {
      return '제과점/카페/호프';
    } else {
      return '기타';
    }
  };

  // 업종별 색상 매핑
  const getCategoryColor = (categoryName: string): string => {
    const colorMap: { [key: string]: string } = {
      '한식/중식/양식/일식': '#ff6b6b',
      '분식/치킨/패스트푸드': '#4ecdc4',
      '제과점/카페/호프': '#45b7d1',
      '기타': '#ffeaa7'
    };
    return colorMap[categoryName] || '#999999';
  };

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

  // 지역별 기본 업종 분포 데이터
  const getDefaultBusinessTypeData = (region: string) => {
    const regionDefaults: { [key: string]: BusinessTypeData[] } = {
      '강남구': [
        { name: '한식/중식/양식/일식', value: 45, color: '#ff6b6b', totalAmount: 4500000000 },
        { name: '제과점/카페/호프', value: 30, color: '#45b7d1', totalAmount: 3000000000 },
        { name: '분식/치킨/패스트푸드', value: 20, color: '#4ecdc4', totalAmount: 2000000000 },
        { name: '기타', value: 5, color: '#ffeaa7', totalAmount: 500000000 }
      ],
      '강서구': [
        { name: '한식/중식/양식/일식', value: 40, color: '#ff6b6b', totalAmount: 4000000000 },
        { name: '분식/치킨/패스트푸드', value: 30, color: '#4ecdc4', totalAmount: 3000000000 },
        { name: '제과점/카페/호프', value: 25, color: '#45b7d1', totalAmount: 2500000000 },
        { name: '기타', value: 5, color: '#ffeaa7', totalAmount: 500000000 }
      ],
      '마포구': [
        { name: '제과점/카페/호프', value: 40, color: '#45b7d1', totalAmount: 4000000000 },
        { name: '한식/중식/양식/일식', value: 35, color: '#ff6b6b', totalAmount: 3500000000 },
        { name: '분식/치킨/패스트푸드', value: 20, color: '#4ecdc4', totalAmount: 2000000000 },
        { name: '기타', value: 5, color: '#ffeaa7', totalAmount: 500000000 }
      ],
      '서초구': [
        { name: '한식/중식/양식/일식', value: 42, color: '#ff6b6b', totalAmount: 4200000000 },
        { name: '제과점/카페/호프', value: 28, color: '#45b7d1', totalAmount: 2800000000 },
        { name: '분식/치킨/패스트푸드', value: 25, color: '#4ecdc4', totalAmount: 2500000000 },
        { name: '기타', value: 5, color: '#ffeaa7', totalAmount: 500000000 }
      ],
      '영등포구': [
        { name: '한식/중식/양식/일식', value: 38, color: '#ff6b6b', totalAmount: 3800000000 },
        { name: '분식/치킨/패스트푸드', value: 32, color: '#4ecdc4', totalAmount: 3200000000 },
        { name: '제과점/카페/호프', value: 25, color: '#45b7d1', totalAmount: 2500000000 },
        { name: '기타', value: 5, color: '#ffeaa7', totalAmount: 500000000 }
      ]
    };
    
    return regionDefaults[region] || [
      { name: '한식/중식/양식/일식', value: 40, color: '#ff6b6b', totalAmount: 4000000000 },
      { name: '제과점/카페/호프', value: 30, color: '#45b7d1', totalAmount: 3000000000 },
      { name: '분식/치킨/패스트푸드', value: 25, color: '#4ecdc4', totalAmount: 2500000000 },
      { name: '기타', value: 5, color: '#ffeaa7', totalAmount: 500000000 }
    ];
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2>{selectedRegion} 상권 분석 리포트</h2>
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
          <Card className="p-4">
            <h3 className="mb-3 text-xl font-bold text-gray-800">연령별 성별 인구 분포</h3>
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
          <div className="flex justify-between gap-4">
            <Badge variant="outline" className="p-4 justify-center text-base font-medium">
                               {loading ? (
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                 ) : error ? (
                   <span className="text-red-500 text-sm">오류</span>
                 ) : populationData ? (
                   `거주인구: ${(populationData.residentPopulation / 10000).toFixed(1)}만명`
                 ) : (
                   '거주인구: 정보없음'
                 )}
            </Badge>
            <Badge variant="outline" className="p-4 justify-center text-base font-medium">
                               {loading ? (
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                 ) : error ? (
                   <span className="text-red-500 text-sm">오류</span>
                 ) : populationData ? (
                   `직장인구: ${(populationData.workerPopulation / 10000).toFixed(1)}만명`
                 ) : (
                   '직장인구: 정보없음'
                 )}
            </Badge>
            <Badge variant="outline" className="p-4 justify-center text-base font-medium">
                               {loading ? (
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                 ) : error ? (
                   <span className="text-red-500 text-sm">오류</span>
                 ) : populationData ? (
                   `유동인구: ${(populationData.floatingPopulation / 10000).toFixed(1)}만명`
                 ) : (
                   '유동인구: 정보없음'
                 )}
            </Badge>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="p-4">
                         <div className="flex items-center justify-between mb-3">
               <h3 className="text-xl font-bold text-gray-800">업종별/월별 매출 추이 (억 단위)</h3>
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
            <div className="mt-4 text-base text-muted-foreground">
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#ff6b6b' }}></div>
                  <span className="font-medium">한식/중식/양식/일식</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#4ecdc4' }}></div>
                  <span className="font-medium">분식/치킨/패스트푸드</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: '#45b7d1' }}></div>
                  <span className="font-medium">제과점/카페/호프</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800">업종별 분포</h3>
              {businessTypeLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  데이터 로딩 중...
                </div>
              )}
              {businessTypeError && (
                <div className="text-sm text-red-500">
                  {businessTypeError}
                </div>
              )}
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={businessTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {businessTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    `${value.toFixed(1)}%`, 
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            {businessTypeData.length > 0 && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {businessTypeData.slice(0, 6).map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}: {(item.totalAmount / 100000000).toFixed(1)}억원</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}