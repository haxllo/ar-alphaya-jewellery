export default function AdminInstructionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            AR Alphaya Jewellery - Product Management
          </h1>
          
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Add Products</h2>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 mb-8 text-center">
              <h3 className="text-2xl font-semibold text-primary-800 mb-3">
                🎯 Product Upload System
              </h3>
              <p className="text-primary-700 mb-6 text-lg">
                Add new products to your AR Alphaya Jewellery collection using our streamlined upload form:
              </p>
              <a 
                href="/admin-upload"
                className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg"
              >
                🔗 Start Adding Products
              </a>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">Product Information Required</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📋 Basic Information</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Product Name</li>
                  <li>• Price (in Sri Lankan Rupees)</li>
                  <li>• Product Description</li>
                  <li>• Category (Rings, Earrings, etc.)</li>
                  <li>• Materials Used</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📸 Images & Details</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• High-quality product photos</li>
                  <li>• Weight (in grams)</li>
                  <li>• Dimensions</li>
                  <li>• Available sizes (if applicable)</li>
                  <li>• Gemstone options (if applicable)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Image Guidelines</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">📸 Photo Requirements</h3>
              <ul className="text-yellow-700 space-y-2 text-sm">
                <li><strong>Format:</strong> JPG or PNG files</li>
                <li><strong>Size:</strong> Under 5MB each, at least 800px width</li>
                <li><strong>Quality:</strong> High resolution, good lighting</li>
                <li><strong>Angles:</strong> Main view, side view, detail shots</li>
                <li><strong>Background:</strong> Clean, neutral background preferred</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enhanced Features Available</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl mb-2">💎</div>
                <h3 className="font-semibold text-gray-800 mb-1">Gemstone Options</h3>
                <p className="text-sm text-gray-600">Multiple gemstone choices with pricing</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl mb-2">📏</div>
                <h3 className="font-semibold text-gray-800 mb-1">Size Selection</h3>
                <p className="text-sm text-gray-600">Ring sizes with professional guide</p>
              </div>
              
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-semibold text-gray-800 mb-1">WhatsApp Integration</h3>
                <p className="text-sm text-gray-600">Direct customer inquiries</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Need Help?</h2>
            
            <div className="bg-gray-100 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you encounter any issues or need assistance with product uploads:
              </p>
              <div className="space-y-2">
                <p><strong>📧 Email:</strong> your-support-email@example.com</p>
                <p><strong>📱 WhatsApp:</strong> +94 77 429 3406</p>
                <p><strong>⏰ Support Hours:</strong> Monday - Saturday, 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
