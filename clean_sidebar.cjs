const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const lines = code.split('\n');
const newLines = lines.map(line => {
  if (line.includes('import { FileSpreadsheet }')) {
    return line.replace('import { FileSpreadsheet }', 'import');
  }
  return line;
});

code = newLines.join('\n').replace(/import from/g, 'import').replace(/import { FileSpreadsheet, /g, 'import { ').replace(/import { FileSpreadsheet,/g, 'import { ');
code = code.replace(/import { /g, 'import { ').replace(/import \{\s+FileSpreadsheet,/g, 'import { ');

// Let's just fix it properly by replacing all bad imports
const importBlockStart = code.indexOf('import React from');
const importBlockEnd = code.indexOf('export type NavTab');
if (importBlockStart >= 0 && importBlockEnd > importBlockStart) {
  const newImports = `import React from 'react';
import { User, SchoolProfile } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Settings,
  Bell,
  Megaphone,
  Briefcase,
  Layers,
  MapPin,
  ClipboardList,
  FolderOpen,
  Award,
  ShieldCheck,
  User as UserIcon,
  FileSpreadsheet,
} from 'lucide-react';
`;
  code = newImports + code.substring(importBlockEnd);
}

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
