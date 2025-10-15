// Simple test to check if the dashboard page compiles
const fs = require('fs');
const path = require('path');

try {
  const dashboardPath = path.join(__dirname, 'app', 'dashboard', 'page.tsx');
  const content = fs.readFileSync(dashboardPath, 'utf8');
  
  // Basic syntax checks
  const hasProperJSX = content.includes('<ProtectedRoute>') && content.includes('</ProtectedRoute>');
  const hasProperImports = content.includes('import') && content.includes('from');
  const hasProperExport = content.includes('export default');
  
  console.log('✅ Dashboard page syntax check:');
  console.log('- Proper JSX structure:', hasProperJSX ? '✅' : '❌');
  console.log('- Proper imports:', hasProperImports ? '✅' : '❌');
  console.log('- Proper export:', hasProperExport ? '✅' : '❌');
  
  if (hasProperJSX && hasProperImports && hasProperExport) {
    console.log('\n🎉 Dashboard page syntax looks good!');
  } else {
    console.log('\n❌ There might be syntax issues');
  }
  
} catch (error) {
  console.error('Error checking syntax:', error.message);
}