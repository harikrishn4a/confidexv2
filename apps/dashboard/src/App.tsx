import { Shield, Download } from 'lucide-react';
import Dashboard from './components/Dashboard';

function App() {

  // const navigation = [
  //   { id: 'dashboard', name: 'Dashboard', icon: Shield },
  //   { id: 'violations', name: 'Violations', icon: AlertTriangle },
  //   { id: 'usage', name: 'Data Usage', icon: TrendingUp },
  //   { id: 'risk', name: 'Risk Assessment', icon: Users },
  //   { id: 'settings', name: 'Settings', icon: Settings },
  // ];

  const renderContent = () => {
      return <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">CONFIDEX</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse"></div>
                <div className="relative bg-green-500 h-3 w-3 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-600">System Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;