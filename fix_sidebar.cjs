const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// Undo the bad sed
code = code.replace(/import \{ FileSpreadsheet, import \{ FileSpreadsheet, /g, 'import { ');
code = code.replace(/import \{ FileSpreadsheet,/g, 'import { ');

// Re-add FileSpreadsheet properly
if (!code.includes('FileSpreadsheet,')) {
  code = code.replace("from 'lucide-react';", "  FileSpreadsheet,\n} from 'lucide-react';");
}

if (!code.includes("my_requests")) {
  code = code.replace("| 'profile';", "| 'profile' | 'requests' | 'my_requests';");
}

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
