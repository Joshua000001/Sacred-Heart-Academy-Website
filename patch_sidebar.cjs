const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

if (!code.includes("id: 'requests'")) {
  code = code.replace(
    "{ id: 'academic_overview', label: 'Academic Overview', icon: GraduationCap },",
    "{ id: 'academic_overview', label: 'Academic Overview', icon: GraduationCap },\n          { id: 'requests', label: 'Document Requests', icon: FileSpreadsheet },"
  );
  code = code.replace(
    "{ id: 'my_schedule', label: 'My Schedule', icon: CalendarDays },",
    "{ id: 'my_schedule', label: 'My Schedule', icon: CalendarDays },\n          { id: 'requests', label: 'Document Requests', icon: FileSpreadsheet },"
  );
}

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
