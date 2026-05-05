"use client"

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, CheckCircle2, Circle } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function StaffCleaning() {
  const [areas, setAreas] = useState([
    { id: 1, name: 'Kitchen Area', checked: false, photo: null },
    { id: 2, name: 'Mess Area', checked: false, photo: null },
    { id: 3, name: 'Washroom Ground Floor', checked: false, photo: null },
    { id: 4, name: 'Playground Area', checked: false, photo: null },
  ]);

  const handleCheckboxChange = (id: number) => {
    setAreas(areas.map(area => 
      area.id === id ? { ...area, checked: !area.checked } : area
    ));
  };

  const handlePhotoUpload = (id: number, file: File) => {
    const fileName = file.name;
    setAreas(areas.map(area =>
      area.id === id ? { ...area, photo: fileName } : area
    ));
  };

  const handleSubmit = () => {
    alert('Cleanliness report submitted successfully!');
  };

  return (
    <DashboardLayout role="staff">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">Cleanliness Report</h2>
          <p className="text-muted-foreground">Complete daily cleanliness inspections for all areas</p>
        </div>

        <div className="space-y-4">
          {areas.map((area) => (
            <Card key={area.id} className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Area Name and Checkbox */}
                  <div className="flex items-center gap-4">
                    <div 
                      className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-lg transition-all"
                      onClick={() => handleCheckboxChange(area.id)}
                    >
                      {area.checked ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-primary">{area.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {area.checked ? 'Confirmed Clean' : 'Awaiting Confirmation'}
                      </p>
                    </div>
                    {area.checked && (
                      <div className="bg-green-50 px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-green-700">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Checkbox Label */}
                  <div className="flex items-center gap-3 ml-12">
                    <Checkbox 
                      id={`confirm-${area.id}`}
                      checked={area.checked}
                      onCheckedChange={() => handleCheckboxChange(area.id)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={`confirm-${area.id}`} className="text-sm font-medium cursor-pointer">
                      Confirm this area is clean and hygienic
                    </Label>
                  </div>

                  {/* Photo Upload Section */}
                  <div className="ml-12 border-2 border-dashed rounded-lg p-6 bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="h-8 w-8 text-primary" />
                      <div className="text-center">
                        <p className="text-sm font-bold text-primary mb-1">
                          {area.photo ? 'Photo uploaded' : 'Upload Photo'}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {area.photo ? `File: ${area.photo}` : 'Click to upload cleanliness verification photo'}
                        </p>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handlePhotoUpload(area.id, e.target.files[0]);
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement)?.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {area.photo ? 'Change Photo' : 'Choose File'}
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" size="lg">
            Save as Draft
          </Button>
          <Button 
            className="bg-accent hover:bg-accent/90" 
            size="lg"
            onClick={handleSubmit}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Submit Cleanliness Report
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
