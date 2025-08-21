import React, { useState, useEffect } from 'react';
import { apiService, PopulationStatistics, PopulationStatisticsPageResponse } from '../services/api';

const PopulationData: React.FC = () => {
  const [populationData, setPopulationData] = useState<PopulationStatistics[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageSize] = useState(10);

  // 첫 페이지 데이터 로드
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PopulationStatisticsPageResponse = await apiService.getPopulationStatistics(undefined, pageSize);
      setPopulationData(response.data);
      setNextCursor(response.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 다음 페이지 데이터 로드
  const loadNextPage = async () => {
    if (!nextCursor) return;
    
    setLoading(true);
    setError(null);
    try {
      const response: PopulationStatisticsPageResponse = await apiService.getPopulationStatistics(nextCursor, pageSize);
      setPopulationData(prev => [...prev, ...response.data]);
      setNextCursor(response.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : '다음 페이지를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">오류 발생</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadInitialData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">서울시 인구 통계 데이터</h2>
        <div className="text-sm text-gray-600">
          총 {populationData.length}개 구 데이터
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총 인구</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주민</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직장인</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유동인구</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">20-29세</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">30-39세</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {populationData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.districtName}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(item.totalPopulation)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(item.residentPopulation)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(item.workerPopulation)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(item.floatingPopulation)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatNumber(item.age20To29Male + item.age20To29Female)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatNumber(item.age30To39Male + item.age30To39Female)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {nextCursor && !loading && (
        <div className="flex justify-center">
          <button
            onClick={loadNextPage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            더 보기
          </button>
        </div>
      )}

      {!nextCursor && populationData.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          모든 데이터를 불러왔습니다.
        </div>
      )}
    </div>
  );
};

export default PopulationData;

