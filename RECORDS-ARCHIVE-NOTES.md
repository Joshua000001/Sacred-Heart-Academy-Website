# Sacred Heart Academy Records Archive

This version adds a Records Archive module integrated into the existing React portal.

## Included
- Records Archive menu for Administrator, School Head, Principal, Registrar, and Teacher
- Organized metadata: category, document type, year, school year, person, ID, grade, section, subject
- Multiple file upload
- Search and category/year filters
- View/download/delete actions
- Upload attribution: who uploaded the file, role, and date
- Teacher view is limited to files uploaded by the current teacher
- Local browser storage via IndexedDB for demo purposes

## Important
This is still a local/demo storage implementation. Files are NOT yet shared between devices/users. For production use, connect this module to Supabase Storage + PostgreSQL with role-based access controls.

## Run

```powershell
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.
