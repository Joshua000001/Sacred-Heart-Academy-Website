const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// Add requests to ADMIN
code = code.replace(
  "{ id: 'settings', label: 'Settings', icon: Settings },",
  "{ id: 'requests', label: 'Document Requests', icon: FileSpreadsheet },\n          { id: 'settings', label: 'Settings', icon: Settings },"
);

// Add requests to REGISTRAR
code = code.replace(
  "{ id: 'profile', label: 'Registrar Profile', icon: Award },",
  "{ id: 'requests', label: 'Document Requests', icon: FileSpreadsheet },\n          { id: 'profile', label: 'Registrar Profile', icon: Award },"
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
