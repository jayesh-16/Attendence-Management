
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your application settings</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-purple-light/30">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Customize your account information</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">User profile settings will be implemented soon.</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the application theme</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Theme customization will be implemented soon.</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-light/30">
          <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 pb-4">
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Notification settings will be implemented soon.</p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-purple-light/30">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
            <CardTitle>Security</CardTitle>
            <CardDescription>Update your security settings</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Security settings will be implemented soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
