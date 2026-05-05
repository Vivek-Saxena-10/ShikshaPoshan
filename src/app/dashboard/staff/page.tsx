"use client"

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, ClipboardList, Package, Droplet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function StaffHome() {
  // Sample state for tracking submissions
  const [stockSubmitted, setStockSubmitted] = useState(false);
  const [cleanlinessSubmitted, setCleanlinessSubmitted] = useState(false);
  
  // Sample stock data
  const stockItems = [
    { name: 'Rice', available: 45, minimum: 50, unit: 'kg' },
    { name: 'Vegetables', available: 30, minimum: 40, unit: 'kg' },
    { name: 'Cooking Oil', available: 12, minimum: 15, unit: 'liters' },
    { name: 'Salt', available: 8, minimum: 10, unit: 'kg' },
  ];

  const lowStockItems = stockItems.filter(item => item.available < item.minimum);

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-headline font-bold text-primary">Daily Operations Log</h2>
            <p className="text-muted-foreground">Track daily submissions and manage operational tasks.</p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="flex flex-col gap-4 space-y-4">
          {/* Available Stock Status Card - FIRST */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${lowStockItems.length > 0 ? 'bg-yellow-50' : 'bg-green-50'}`}>
                    <Package className={`h-6 w-6 ${lowStockItems.length > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-headline">Stock Status</CardTitle>
                    <CardDescription className="text-xs">Current inventory level</CardDescription>
                  </div>
                </div>
                {lowStockItems.length > 0 ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockItems.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-yellow-600">Items Needing Refill:</p>
                  <div className="space-y-2">
                    {lowStockItems.map((item, idx) => (
                      <div key={idx} className="bg-yellow-50 p-2 rounded-lg border-l-2 border-yellow-500">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-bold text-yellow-900">{item.name}</span>
                          <span className="text-yellow-700">{item.available}/{item.minimum} {item.unit}</span>
                        </div>
                        <Progress value={(item.available / item.minimum) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-2">All Stock Adequate</Badge>
                  <p className="text-xs text-muted-foreground">All items are above minimum threshold.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Stock Report Card - SECOND */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${stockSubmitted ? 'bg-green-50' : 'bg-orange-50'}`}>
                    <Package className={`h-6 w-6 ${stockSubmitted ? 'text-green-500' : 'text-orange-500'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-headline">Daily Stock Report</CardTitle>
                    <CardDescription className="text-xs">Inventory submission</CardDescription>
                  </div>
                </div>
                {stockSubmitted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">Status</span>
                  <Badge className={stockSubmitted ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-orange-100 text-orange-700 hover:bg-orange-100'}>
                    {stockSubmitted ? 'Submitted' : 'Due'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stockSubmitted ? 'Stock report submitted for today.' : 'Submit your daily stock inventory from the Stock Management tab.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cleanliness Report Card - THIRD */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${cleanlinessSubmitted ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Droplet className={`h-6 w-6 ${cleanlinessSubmitted ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-headline">Cleanliness Report</CardTitle>
                    <CardDescription className="text-xs">Sanitation submission</CardDescription>
                  </div>
                </div>
                {cleanlinessSubmitted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">Status</span>
                  <Badge className={cleanlinessSubmitted ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                    {cleanlinessSubmitted ? 'Submitted' : 'Due'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {cleanlinessSubmitted ? 'Cleanliness report submitted for today.' : 'Submit your daily cleanliness inspection from the Cleanliness tab.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
