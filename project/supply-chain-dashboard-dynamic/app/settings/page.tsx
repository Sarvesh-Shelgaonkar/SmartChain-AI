"use client"

import { useState } from "react"
import { ArrowLeft, Settings, User, Bell, Shield, Palette } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    department: user?.department || ''
  })
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: user?.preferences?.notifications?.email || false,
    push: user?.preferences?.notifications?.push || false,
    sms: user?.preferences?.notifications?.sms || false
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [theme, setTheme] = useState(user?.preferences?.theme || 'light')
  const [language, setLanguage] = useState(user?.preferences?.language || 'en')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.preferences?.twoFactorEnabled || false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleLogout = async () => {
    setLoading(true)
    await logout()
    setLoading(false)
  }
  
  const handleProfileSave = async () => {
    setSaveLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Profile updated successfully!')
      setSaveLoading(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }, 1000)
  }
  
  const handleNotificationSave = async () => {
    setSaveLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Notification preferences updated successfully!')
      setSaveLoading(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }, 1000)
  }
  
  const handlePasswordUpdate = async () => {
    // Validate password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }
    
    setSaveLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Password updated successfully!')
      setSaveLoading(false)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }, 1000)
  }
  
  const handleToggle2FA = async () => {
    setSaveLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTwoFactorEnabled(!twoFactorEnabled)
      setSuccessMessage(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`)
      setSaveLoading(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }, 1000)
  }
  
  const handleAppearanceSave = async () => {
    setSaveLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Appearance settings updated successfully!')
      setSaveLoading(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }, 1000)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
                    {successMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={profileForm.email} 
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      disabled 
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      value={profileForm.role} 
                      onChange={(e) => setProfileForm({...profileForm, role: e.target.value})}
                      disabled 
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department" 
                      value={profileForm.department} 
                      onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                      disabled 
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleProfileSave} 
                    disabled={saveLoading}
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleLogout} disabled={loading}>
                    {loading ? 'Logging out...' : 'Logout'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-4">
                    {successMessage}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={notificationPreferences.email}
                      onCheckedChange={(checked) => setNotificationPreferences({...notificationPreferences, email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={notificationPreferences.push}
                      onCheckedChange={(checked) => setNotificationPreferences({...notificationPreferences, push: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <Switch 
                      id="sms-notifications" 
                      checked={notificationPreferences.sms}
                      onCheckedChange={(checked) => setNotificationPreferences({...notificationPreferences, sms: checked})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleNotificationSave}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-4">
                    {successMessage}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      />
                    </div>
                    <Button 
                      onClick={handlePasswordUpdate}
                      disabled={saveLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    >
                      {saveLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Add an extra layer of security to your account</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {twoFactorEnabled 
                          ? 'Two-factor authentication is currently enabled' 
                          : 'Two-factor authentication is currently disabled'}
                      </p>
                    </div>
                    <Button 
                      variant={twoFactorEnabled ? "destructive" : "outline"}
                      onClick={handleToggle2FA}
                      disabled={saveLoading}
                    >
                      {saveLoading 
                        ? 'Processing...' 
                        : twoFactorEnabled 
                          ? 'Disable 2FA' 
                          : 'Enable 2FA'
                      }
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md mb-4">
                    {successMessage}
                  </div>
                )}

                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={theme} 
                    onValueChange={(value) => setTheme(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={language} 
                    onValueChange={(value) => setLanguage(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleAppearanceSave}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving...' : 'Save Appearance'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}