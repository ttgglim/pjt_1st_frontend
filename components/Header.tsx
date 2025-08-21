import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, Database, TrendingUp, Shield } from 'lucide-react';

export function Header() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">데이터 기준</p>
                <p className="font-medium">공공데이터포털</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">실시간 분석</p>
                <p className="font-medium">상권 & 인구 데이터</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">대상 지역</p>
                <p className="font-medium">서울시 전체</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">신뢰성</p>
                <p className="font-medium">정확한 정보 제공</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="secondary">소상공인시장진흥공단</Badge>
          <Badge variant="secondary">한국부동산원</Badge>
          <Badge variant="secondary">서울시 열린데이터</Badge>
          <Badge variant="secondary">실시간 업데이트</Badge>
        </div>
      </div>
    </div>
  );
}