
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, TrendingUp, Check, DollarSign, Handshake, Package, Settings } from "lucide-react";

export default function AdminDashboard() {
  const adminModules = [
    {
      title: "User Management",
      description: "View, search, and manage user accounts",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      link: "/admin/users"
    },
    {
      title: "Earnings Overview",
      description: "View earnings by user, total payouts, and pending earnings",
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      link: "/admin/earnings"
    },
    {
      title: "Approval Center",
      description: "Review content submissions and approve or reject them",
      icon: <Check className="h-8 w-8 text-purple-500" />,
      link: "/admin/approvals"
    },
    {
      title: "Payout Control",
      description: "Manage and process user payouts",
      icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
      link: "/admin/payouts"
    },
    {
      title: "Affiliate System",
      description: "View affiliate links and performance statistics",
      icon: <Handshake className="h-8 w-8 text-indigo-500" />,
      link: "/admin/affiliates"
    },
    {
      title: "Asset Manager",
      description: "Upload, manage and remove assets",
      icon: <Package className="h-8 w-8 text-orange-500" />,
      link: "/admin/assets"
    },
    {
      title: "Payment Settings",
      description: "Configure payment rules, channels, and limits",
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      link: "/admin/settings"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Link key={index} to={module.link}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                {module.icon}
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{module.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
