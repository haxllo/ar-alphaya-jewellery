const FormData = require('form-data');
const fetch = require('node-fetch');

async function testProductCreation() {
  const formData = new FormData();
  
  // Add test product data
  formData.append('id', 'TEST-AUTO-001');
  formData.append('name', 'Automated Test Sapphire Ring');
  formData.append('slug', 'automated-test-sapphire-ring');
  formData.append('price', '25000');
  formData.append('category', 'rings');
  formData.append('materials', 'Sterling Silver\nBlue Sapphire\nRhodium Plating');
  formData.append('weight', '3.2');
  formData.append('dimensions', '18mm diameter');
  formData.append('description', 'This is an automated test product created to verify the GitHub API integration is working correctly. Beautiful blue sapphire set in sterling silver with rhodium plating for lasting shine.');
  
  try {
    console.log('🚀 Testing automated product creation...');
    
    const response = await fetch('https://aralphaya.netlify.app/api/products/create', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    console.log('📊 API Response Status:', response.status);
    console.log('📋 API Response:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      if (result.githubCreated) {
        console.log('✅ SUCCESS: Product created automatically via GitHub API!');
        console.log('🔗 Product should be available at:', `https://aralphaya.netlify.app/products/${result.slug}`);
        console.log('⏱️  Site will rebuild in 2-3 minutes');
      } else {
        console.log('⚠️  FALLBACK: Product template created, manual setup required');
        console.log('📝 Manual instructions provided in response');
      }
    } else {
      console.log('❌ ERROR: Product creation failed');
      console.log('📝 Error details:', result.error || result.details);
    }
  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }
}

testProductCreation();
