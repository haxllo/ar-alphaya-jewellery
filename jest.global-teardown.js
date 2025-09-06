module.exports = async () => {
  // Global teardown after all tests complete
  console.log('🧹 Cleaning up test environment...')
  
  // Clean up any global resources here if needed
  // For example: close database connections, clear caches, etc.
  
  console.log('✅ Test environment cleanup complete')
}
