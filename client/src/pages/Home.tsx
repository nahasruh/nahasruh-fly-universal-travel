export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Fly Universal Travel & Tourism ERP
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Comprehensive Enterprise Resource Planning System
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          {[
            'Dashboard',
            'Tickets',
            'Suppliers',
            'Customers',
            'Payments',
            'Refunds',
            'Accounting',
            'Reports',
            'Services',
            'Users',
            'Notifications',
            'Audit Logs',
            'Expenses',
            'Currencies',
            'Search',
            'WhatsApp',
          ].map((module) => (
            <div
              key={module}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              <p className="text-sm font-medium text-gray-700">{module}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
