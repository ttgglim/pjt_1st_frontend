const API_BASE_URL = 'http://localhost:8080/api';

export interface PopulationStatistics {
  id: number;
  districtName: string;
  totalPopulation: number;
  residentPopulation: number;
  workerPopulation: number;
  floatingPopulation: number;
  age0To9Male: number;
  age0To9Female: number;
  age10To19Male: number;
  age10To19Female: number;
  age20To29Male: number;
  age20To29Female: number;
  age30To39Male: number;
  age30To39Female: number;
  age40To49Male: number;
  age40To49Female: number;
  age50To59Male: number;
  age50To59Female: number;
  age60PlusMale: number;
  age60PlusFemale: number;
  createdAt: string;
  updatedAt: string;
}

export interface PopulationStatisticsPageResponse {
  data: PopulationStatistics[];
  nextCursor: number | null;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // 모든 자치구 인구 통계 조회
  async getAllDistricts(): Promise<PopulationStatistics[]> {
    return this.request<PopulationStatistics[]>('/districts');
  }

  // 특정 자치구 인구 통계 조회
  async getDistrictByName(districtName: string): Promise<PopulationStatistics> {
    return this.request<PopulationStatistics>(`/districts/${encodeURIComponent(districtName)}`);
  }

  // 상위 N개 인구 많은 자치구 조회
  async getTopDistrictsByPopulation(limit: number = 5): Promise<PopulationStatistics[]> {
    return this.request<PopulationStatistics[]>(`/districts/top?limit=${limit}`);
  }

  // 커서 기반 페이지네이션으로 인구 통계 데이터 조회 (기존 호환성 유지)
  async getPopulationStatistics(cursor?: number, size: number = 10): Promise<PopulationStatisticsPageResponse> {
    const allDistricts = await this.getAllDistricts();
    const startIndex = cursor || 0;
    const endIndex = startIndex + size;
    const data = allDistricts.slice(startIndex, endIndex);
    const nextCursor = endIndex < allDistricts.length ? endIndex : null;
    
    return {
      data,
      nextCursor
    };
  }

  // 특정 구의 인구 통계 조회 (기존 호환성 유지)
  async getPopulationStatisticsByDistrict(district: string): Promise<PopulationStatistics[]> {
    const districtData = await this.getDistrictByName(district);
    return [districtData];
  }

  // 전체 데이터 개수 조회
  async getTotalCount(): Promise<number> {
    const allDistricts = await this.getAllDistricts();
    return allDistricts.length;
  }

  // 헬스 체크
  async healthCheck(): Promise<string> {
    return this.request<string>('/health');
  }

  // 매출 데이터 관련 API
  async getSalesDataByDistrict(districtName: string): Promise<any[]> {
    return this.request<any[]>(`/sales/district/${encodeURIComponent(districtName)}`);
  }

  async getSalesDataByCategory(categoryName: string): Promise<any[]> {
    return this.request<any[]>(`/sales/category/${encodeURIComponent(categoryName)}`);
  }

  async getDistrictTotalSales(districtName: string): Promise<any> {
    return this.request<any>(`/sales/district/${encodeURIComponent(districtName)}/total`);
  }

  async getCategorySalesStatistics(districtName: string): Promise<any[]> {
    return this.request<any[]>(`/sales/district/${encodeURIComponent(districtName)}/statistics/category`);
  }

  async getGenderSalesStatistics(districtName: string): Promise<any> {
    return this.request<any>(`/sales/district/${encodeURIComponent(districtName)}/statistics/gender`);
  }

  async getWeekdayWeekendSalesStatistics(districtName: string): Promise<any> {
    return this.request<any>(`/sales/district/${encodeURIComponent(districtName)}/statistics/weekday-weekend`);
  }

  async getTopDistrictsBySales(limit: number = 10): Promise<any[]> {
    return this.request<any[]>(`/sales/top/districts?limit=${limit}`);
  }

  async getTopCategoriesBySales(limit: number = 10): Promise<any[]> {
    return this.request<any[]>(`/sales/top/categories?limit=${limit}`);
  }

  // 업종별 월별 평균 매출 통계 조회
  async getCategoryGroupMonthlySales(): Promise<any[]> {
    return this.request<any[]>('/sales/monthly/category-groups');
  }

  // 자치구별 업종별 월별 평균 매출 통계 조회
  async getCategoryGroupMonthlySalesByDistrict(districtName: string): Promise<any[]> {
    return this.request<any[]>(`/sales/monthly/category-groups/${encodeURIComponent(districtName)}`);
  }

  // 자치구별 월 평균 매출 조회
  async getAverageMonthlySalesByDistrict(districtName: string): Promise<number> {
    return this.request<number>(`/sales/average-monthly-sales/${encodeURIComponent(districtName)}`);
  }

  // 자치구별 최근 날짜 사업체 수 조회
  async getRecentBusinessesByDistrict(districtName: string): Promise<number> {
    return this.request<number>(`/sales/recent-businesses/${encodeURIComponent(districtName)}`);
  }
}

export const apiService = new ApiService();

