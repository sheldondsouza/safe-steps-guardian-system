
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserInfo {
  id: string;
  name: string;
  age: number;
  room: string;
  medicalConditions: string[];
  fallRiskLevel: 'low' | 'moderate' | 'high';
  contactName: string;
  contactPhone: string;
  imageUrl?: string;
}

interface UserProfileProps {
  user: UserInfo;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const getFallRiskColor = () => {
    switch (user.fallRiskLevel) {
      case 'low':
        return 'bg-guardian-secondary text-white';
      case 'moderate':
        return 'bg-guardian-warning text-black';
      case 'high':
        return 'bg-guardian-danger text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>Room {user.room} • {user.age} years old</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Medical Conditions</h4>
          <div className="flex flex-wrap gap-1">
            {user.medicalConditions.map((condition, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                {condition}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Fall Risk Level</h4>
          <Badge className={`${getFallRiskColor()}`}>
            {user.fallRiskLevel.charAt(0).toUpperCase() + user.fallRiskLevel.slice(1)}
          </Badge>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Emergency Contact</h4>
          <p className="text-sm">{user.contactName}</p>
          <p className="text-sm">{user.contactPhone}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Details</Button>
        <Button>Contact</Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
