// 서울시 자치구별 요식업 매출 데이터 (2023년 기준, 단위: 억원)
// 실제 엑셀 데이터를 기반으로 한 샘플 데이터

export interface DistrictSalesData {
  name: string;
  sales: number; // 매출액 (억원)
  businesses: number; // 사업체 수
  population: number; // 인구수
  averageRent: number; // 평균 임대료 (만원/㎡)
  growthRate: number; // 전년 대비 성장률 (%)
  mainBusinessTypes: string[]; // 주요 업종
  coordinates?: { x: number; y: number }; // SVG 좌표 (옵션)
}

// 월 평균 매출 계산 함수
export const getMonthlyAverageSales = (yearlySales: number): number => {
  return Math.round(yearlySales / 12 * 10) / 10; // 소수점 첫째자리까지
};

export const seoulDistrictsData: DistrictSalesData[] = [
  {
    name: '강남구',
    sales: 19200, // 월 1600억원 (1600 * 12)
    businesses: 45231,
    population: 547000,
    averageRent: 4.5,
    growthRate: 12.3,
    mainBusinessTypes: ['한식', '일식', '카페', '치킨'],
  },
  {
    name: '서초구',
    sales: 16800, // 월 1400억원 (1400 * 12)
    businesses: 32145,
    population: 421000,
    averageRent: 3.8,
    growthRate: 8.7,
    mainBusinessTypes: ['한식', '카페', '양식', '분식'],
  },
  {
    name: '송파구',
    sales: 14400, // 월 1200억원 (1200 * 12)
    businesses: 38924,
    population: 672000,
    averageRent: 3.2,
    growthRate: 15.2,
    mainBusinessTypes: ['한식', '치킨', '카페', '중식'],
  },
  {
    name: '강서구',
    sales: 12000, // 월 1000억원 (1000 * 12)
    businesses: 28756,
    population: 596000,
    averageRent: 2.1,
    growthRate: 6.8,
    mainBusinessTypes: ['한식', '분식', '카페', '패스트푸드'],
  },
  {
    name: '마포구',
    sales: 9600, // 월 800억원 (800 * 12)
    businesses: 35678,
    population: 383000,
    averageRent: 3.5,
    growthRate: 9.4,
    mainBusinessTypes: ['한식', '술집', '카페', '일식'],
  },
  {
    name: '종로구',
    sales: 9000, // 월 750억원 (750 * 12)
    businesses: 42893,
    population: 158000,
    averageRent: 4.2,
    growthRate: 5.1,
    mainBusinessTypes: ['한식', '카페', '전통음식', '일식'],
  },
  {
    name: '중구',
    sales: 8400, // 월 700억원 (700 * 12)
    businesses: 38234,
    population: 134000,
    averageRent: 4.0,
    growthRate: 3.9,
    mainBusinessTypes: ['한식', '중식', '카페', '패스트푸드'],
  },
  {
    name: '용산구',
    sales: 7800, // 월 650억원 (650 * 12)
    businesses: 25467,
    population: 245000,
    averageRent: 3.6,
    growthRate: 11.2,
    mainBusinessTypes: ['한식', '양식', '카페', '일식'],
  },
  {
    name: '영등포구',
    sales: 7200, // 월 600억원 (600 * 12)
    businesses: 31245,
    population: 392000,
    averageRent: 2.8,
    growthRate: 7.5,
    mainBusinessTypes: ['한식', '치킨', '분식', '카페'],
  },
  {
    name: '성동구',
    sales: 6600, // 월 550억원 (550 * 12)
    businesses: 27894,
    population: 309000,
    averageRent: 2.5,
    growthRate: 13.6,
    mainBusinessTypes: ['한식', '카페', '분식', '치킨'],
  },
  {
    name: '광진구',
    sales: 6000, // 월 500억원 (500 * 12)
    businesses: 24567,
    population: 355000,
    averageRent: 2.7,
    growthRate: 10.8,
    mainBusinessTypes: ['한식', '카페', '치킨', '일식'],
  },
  {
    name: '동대문구',
    sales: 5400, // 월 450억원 (450 * 12)
    businesses: 29876,
    population: 345000,
    averageRent: 2.3,
    growthRate: 4.2,
    mainBusinessTypes: ['한식', '중식', '분식', '카페'],
  },
  {
    name: '성북구',
    sales: 4800, // 월 400억원 (400 * 12)
    businesses: 26543,
    population: 458000,
    averageRent: 2.2,
    growthRate: 6.3,
    mainBusinessTypes: ['한식', '카페', '분식', '치킨'],
  },
  {
    name: '강북구',
    sales: 4200, // 월 350억원 (350 * 12)
    businesses: 19876,
    population: 316000,
    averageRent: 1.8,
    growthRate: 2.1,
    mainBusinessTypes: ['한식', '분식', '치킨', '중식'],
  },
  {
    name: '노원구',
    sales: 3600, // 월 300억원 (300 * 12)
    businesses: 23456,
    population: 547000,
    averageRent: 1.9,
    growthRate: 5.7,
    mainBusinessTypes: ['한식', '분식', '카페', '치킨'],
  },
  {
    name: '도봉구',
    sales: 3000, // 월 250억원 (250 * 12)
    businesses: 18543,
    population: 345000,
    averageRent: 1.7,
    growthRate: 3.4,
    mainBusinessTypes: ['한식', '분식', '치킨', '카페'],
  },
  {
    name: '은평구',
    sales: 2400, // 월 200억원 (200 * 12)
    businesses: 22345,
    population: 486000,
    averageRent: 2.0,
    growthRate: 8.2,
    mainBusinessTypes: ['한식', '카페', '분식', '치킨'],
  },
  {
    name: '서대문구',
    sales: 1800, // 월 150억원 (150 * 12)
    businesses: 21876,
    population: 322000,
    averageRent: 2.4,
    growthRate: 4.8,
    mainBusinessTypes: ['한식', '카페', '치킨', '일식'],
  },
  {
    name: '양천구',
    sales: 1200, // 월 100억원 (100 * 12)
    businesses: 19234,
    population: 468000,
    averageRent: 2.1,
    growthRate: 6.1,
    mainBusinessTypes: ['한식', '분식', '치킨', '카페'],
  },
  {
    name: '구로구',
    sales: 900, // 월 75억원 (75 * 12)
    businesses: 20567,
    population: 446000,
    averageRent: 1.9,
    growthRate: 9.3,
    mainBusinessTypes: ['한식', '중식', '분식', '치킨'],
  },
  {
    name: '금천구',
    sales: 600, // 월 50억원 (50 * 12)
    businesses: 17890,
    population: 246000,
    averageRent: 1.8,
    growthRate: 7.9,
    mainBusinessTypes: ['한식', '분식', '치킨', '중식'],
  },
  {
    name: '관악구',
    sales: 480, // 월 40억원 (40 * 12)
    businesses: 18765,
    population: 516000,
    averageRent: 2.0,
    growthRate: 5.5,
    mainBusinessTypes: ['한식', '분식', '치킨', '카페'],
  },
  {
    name: '동작구',
    sales: 360, // 월 30억원 (30 * 12)
    businesses: 16543,
    population: 403000,
    averageRent: 2.2,
    growthRate: 4.7,
    mainBusinessTypes: ['한식', '카페', '분식', '치킨'],
  },
  {
    name: '중랑구',
    sales: 240, // 월 20억원 (20 * 12)
    businesses: 15432,
    population: 408000,
    averageRent: 1.6,
    growthRate: 3.2,
    mainBusinessTypes: ['한식', '분식', '치킨', '중식'],
  },
  {
    name: '강동구',
    sales: 120, // 월 10억원 (10 * 12)
    businesses: 14321,
    population: 474000,
    averageRent: 1.9,
    growthRate: 6.8,
    mainBusinessTypes: ['한식', '분식', '치킨', '카페'],
  },
];

// 월 평균 매출 규모별 색상 매핑
export const getSalesColor = (yearlySales: number): string => {
  const monthlySales = getMonthlyAverageSales(yearlySales);
  if (monthlySales >= 1550) return '#ef4444'; // 빨강 - 월 1550억원 이상
  if (monthlySales >= 1525) return '#f97316'; // 주황 - 월 1525-1550억원
  if (monthlySales >= 1500) return '#f59e0b'; // 노랑 - 월 1500-1525억원
  if (monthlySales >= 1475) return '#22c55e';  // 초록 - 월 1475-1500억원
  if (monthlySales >= 1450) return '#3b82f6'; // 파랑 - 월 1450-1475억원
  return '#8b5cf6'; // 보라 - 월 1450억원 미만
};

// 지역별 데이터 조회 함수
export const getDistrictData = (districtName: string): DistrictSalesData | undefined => {
  return seoulDistrictsData.find(district => district.name === districtName);
};

// 상위 매출 지역 조회 함수
export const getTopSalesDistricts = (count: number = 5): DistrictSalesData[] => {
  return seoulDistrictsData
    .sort((a, b) => b.sales - a.sales)
    .slice(0, count);
};

// 매출 증가율 상위 지역 조회 함수
export const getTopGrowthDistricts = (count: number = 5): DistrictSalesData[] => {
  return seoulDistrictsData
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, count);
};
