const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { DocumentRequests }")) {
  code = code.replace("import { LandingPage }", "import { DocumentRequests } from './components/registrar/DocumentRequests';\nimport { LandingPage }");
}

if (!code.includes("const handleSaveRequest = ")) {
  const handler = `
  const handleSaveRequest = (req) => {
    SchoolDatabase.saveDocumentRequest(req, currentUser);
    refreshDb();
  };
  `;
  code = code.replace("const handleLogout = () => {", handler + "\n  const handleLogout = () => {");
}

if (!code.includes("activeTab === 'requests'")) {
  const viewCode = `
          {(activeTab === 'requests' || activeTab === 'my_requests') && (
            <DocumentRequests
              currentUser={currentUser}
              requests={db.documentRequests || []}
              students={db.students}
              onSaveRequest={handleSaveRequest}
            />
          )}
  `;
  code = code.replace("{activeTab === 'profile' && (", viewCode + "\n          {activeTab === 'profile' && (");
}

fs.writeFileSync('src/App.tsx', code);
