export default function AdminAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            CMS Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage products and content
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Access Content Management System
              </h3>
              <p className="text-blue-700 mb-4">
                The CMS uses Netlify Identity (separate from website login). 
                You need to be invited specifically for admin access.
              </p>
              <a
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to CMS Admin →
              </a>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-yellow-900 mb-2">
                First Time Setup
              </h3>
              <div className="text-yellow-700 space-y-2">
                <p>1. Ask admin to invite you to Netlify Identity</p>
                <p>2. Check email for invitation link</p>
                <p>3. Set your CMS password</p>
                <p>4. Access the CMS using the button above</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-gray-700">
                If you cannot access the CMS, contact the website administrator 
                to be invited to Netlify Identity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
