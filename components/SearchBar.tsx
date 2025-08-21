import React, { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SearchBarProps {
  onRegionSelect: (region: string) => void;
  selectedRegion: string;
}

export function SearchBar({ onRegionSelect, selectedRegion }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const seoulDistricts = [
    '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
    '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
  ];

  const filteredDistricts = seoulDistricts.filter(district => 
    district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            자치구 선택
          </label>
          <Select value={selectedRegion} onValueChange={onRegionSelect}>
            <SelectTrigger className="bg-white/80 border-gray-200 shadow-sm hover:shadow-md transition-all">
              <SelectValue placeholder="자치구를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {seoulDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {district}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <Search className="h-4 w-4" />
            빠른 검색
          </label>
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
            onClick={() => onRegionSelect(selectedRegion)}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {selectedRegion} 상권 분석하기
          </Button>
        </div>
      </div>


    </div>
  );
}