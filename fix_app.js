const fs = require('fs');
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

// 1. Remove from line 674 (0-indexed 673) to line 1359 (0-indexed 1358)
const routesReplacement = `  const primaryColor = sanitizeColor(brand.colors?.[0], '#c4973b');

  return (
    <Routes>
      <Route path="/" element={<LandingPage onGetStarted={() => navigate('/onboarding')} onLogin={() => navigate('/login')} />} />
      <Route path="/login" element={<SignupView brand={brand} setBrand={setBrand} onComplete={() => navigate('/dashboard')} onBack={() => navigate('/')} />} />
      <Route path="/onboarding" element={<SignupView brand={brand} setBrand={setBrand} onComplete={() => navigate('/dashboard')} onBack={() => navigate('/')} />} />
      <Route path="/dashboard/*" element={<Dashboard brand={brand} setBrand={setBrand} primaryColor={primaryColor} onEditBrandKit={() => navigate('/onboarding')} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );`;

// Delete old return in App (lines 674 to 1359)
lines.splice(673, 1359 - 674 + 1, routesReplacement);

// We need to find the new line numbers for the Dashboard fixes.
content = lines.join('\n');
const newLines = content.split('\n');

// 2. Find Dashboard = () => (
const dashboardIdx = newLines.findIndex(l => l.includes('const Dashboard = () => ('));
if (dashboardIdx !== -1) {
  newLines[dashboardIdx] = newLines[dashboardIdx].replace('const Dashboard = () => (', 'return (');
}

// 3. Find the end of Dashboard component which contains the routes.
const routeStartIdx = newLines.findIndex(l => l.includes('<Routes>'));
// Wait, we just added <Routes> at the top. Let's start searching from after the top one.
const secondRouteStartIdx = newLines.findIndex((l, i) => i > (dashboardIdx || 0) && l.includes('return (') && newLines[i+1].includes('<Routes>'));

if (secondRouteStartIdx !== -1) {
  // delete the second return (<Routes> ... );
  // usually it spans from return ( to ); 
  newLines.splice(secondRouteStartIdx, 9);
}

fs.writeFileSync(file, newLines.join('\n'), 'utf8');
console.log('App.jsx fixed!');
