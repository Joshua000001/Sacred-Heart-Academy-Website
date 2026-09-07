const fs = require('fs');
let code = fs.readFileSync('src/services/storage.ts', 'utf8');

if (!code.includes('DocumentRequest')) {
  code = code.replace("RolePermissionConfig,", "RolePermissionConfig,\n  DocumentRequest,");
}

if (!code.includes('static getDocumentRequests')) {
  const methodCode = `
  static getDocumentRequests(): DocumentRequest[] {
    return getStorageItem(STORAGE_KEYS.DOCUMENT_REQUESTS, []);
  }
  static saveDocumentRequest(req: DocumentRequest, actor?: User): void {
    const list = this.getDocumentRequests();
    const idx = list.findIndex(r => r.id === req.id);
    if (idx >= 0) list[idx] = req;
    else list.push(req);
    setStorageItem(STORAGE_KEYS.DOCUMENT_REQUESTS, list);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user?.id || 'sys',
      userName: user?.fullName || 'System',
      userRole: user?.role || 'STUDENT',
      action: idx >= 0 ? 'UPDATE_DOC_REQUEST' : 'CREATE_DOC_REQUEST',
      module: 'Document Requests',
      description: \`Document request for \${req.documentType} (\${req.status})\`
    });
  }
  static deleteDocumentRequest(id: string, actor?: User): void {
    const list = this.getDocumentRequests().filter(r => r.id !== id);
    setStorageItem(STORAGE_KEYS.DOCUMENT_REQUESTS, list);
  }
`;
  code = code.replace("static getDatabase() {", methodCode + "\n  static getDatabase() {");
}

if (!code.includes('documentRequests: this.getDocumentRequests()')) {
  code = code.replace("auditLogs: this.getAuditLogs(),", "auditLogs: this.getAuditLogs(),\n      documentRequests: this.getDocumentRequests(),");
}

fs.writeFileSync('src/services/storage.ts', code);
