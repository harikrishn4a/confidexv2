import React, { useState } from 'react';
import { Save, AlertTriangle, Shield, Bell, Database, Lock, Eye, RefreshCw } from 'lucide-react';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    realTimeScanning: true,
    alertThreshold: 'medium',
    dataRetention: '90',
    autoBlock: true,
    emailNotifications: true,
    slackIntegration: false,
    auditLogging: true,
    encryptionLevel: 'high',
    scanFrequency: 'continuous',
    falsePositiveReduction: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate saving settings
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
            <p className="text-gray-600 mt-1">Configure privacy detection and protection parameters</p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Detection Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Detection Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Real-time Scanning
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => handleSettingChange('realTimeScanning', !settings.realTimeScanning)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.realTimeScanning ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.realTimeScanning ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm text-gray-600">
                  {settings.realTimeScanning ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Threshold
              </label>
              <select
                value={settings.alertThreshold}
                onChange={(e) => handleSettingChange('alertThreshold', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low - All potential issues</option>
                <option value="medium">Medium - Likely violations only</option>
                <option value="high">High - Critical violations only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention (days)
              </label>
              <input
                type="number"
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="365"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-block Violations
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => handleSettingChange('autoBlock', !settings.autoBlock)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoBlock ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoBlock ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm text-gray-600">
                  {settings.autoBlock ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scan Frequency
              </label>
              <select
                value={settings.scanFrequency}
                onChange={(e) => handleSettingChange('scanFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="continuous">Continuous</option>
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Encryption Level
              </label>
              <select
                value={settings.encryptionLevel}
                onChange={(e) => handleSettingChange('encryptionLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="basic">Basic (AES-128)</option>
                <option value="standard">Standard (AES-256)</option>
                <option value="high">High (AES-256 + HSM)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-900">Email Notifications</span>
              <p className="text-xs text-gray-600">Receive alerts via email</p>
            </div>
            <button
              onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-900">Slack Integration</span>
              <p className="text-xs text-gray-600">Send alerts to Slack channels</p>
            </div>
            <button
              onClick={() => handleSettingChange('slackIntegration', !settings.slackIntegration)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.slackIntegration ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.slackIntegration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <span className="text-sm font-medium text-gray-900">Audit Logging</span>
              <p className="text-xs text-gray-600">Log all system activities</p>
            </div>
            <button
              onClick={() => handleSettingChange('auditLogging', !settings.auditLogging)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.auditLogging ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.auditLogging ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Advanced Protection</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between py-3">
              <div>
                <span className="text-sm font-medium text-gray-900">False Positive Reduction</span>
                <p className="text-xs text-gray-600">Use AI to reduce false alerts</p>
              </div>
              <button
                onClick={() => handleSettingChange('falsePositiveReduction', !settings.falsePositiveReduction)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.falsePositiveReduction ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.falsePositiveReduction ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;