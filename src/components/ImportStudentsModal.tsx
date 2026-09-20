import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Trash2,
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAttendance } from '../context/AttendanceContext';
import { Student } from '../types';

interface ParsedStudentRow {
  name: string;
  rollNumber: string;
  gender: 'male' | 'female' | 'other';
  parentName: string;
  parentRelation: 'Father' | 'Mother' | 'Guardian';
  parentPhone: string;
  parentEmail: string;
  sheetTrainer?: string;
  isValid: boolean;
  errors: string[];
}

export const ImportStudentsModal: React.FC = () => {
  const { 
    isImportModalOpen, 
    setIsImportModalOpen, 
    trainers, 
    activeTrainer, 
    importStudentsBatch,
    showToast 
  } = useAttendance();

  const [fileName, setFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>(activeTrainer?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isImportModalOpen) return null;

  // Normalize column names to match expected fields
  const normalizeKey = (key: string): string => {
    return key.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const processWorkbook = (workbook: XLSX.WorkBook, name: string) => {
    try {
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

      if (rawJson.length === 0) {
        showToast('The uploaded sheet contains no data rows.', 'alert');
        return;
      }

      const rows: ParsedStudentRow[] = rawJson.map((row) => {
        // Map normalized keys to values
        const normalizedRow: Record<string, string> = {};
        Object.entries(row).forEach(([k, v]) => {
          normalizedRow[normalizeKey(k)] = String(v).trim();
        });

        const name = normalizedRow['name'] || normalizedRow['studentname'] || normalizedRow['fullname'] || normalizedRow['student'] || '';
        const rollNumber = normalizedRow['rollnumber'] || normalizedRow['rollno'] || normalizedRow['roll'] || normalizedRow['id'] || normalizedRow['studentid'] || '';
        
        let gender: 'male' | 'female' | 'other' = 'other';
        const rawGender = (normalizedRow['gender'] || normalizedRow['sex'] || '').toLowerCase();
        if (rawGender.startsWith('m')) gender = 'male';
        else if (rawGender.startsWith('f')) gender = 'female';

        const parentName = normalizedRow['parentname'] || normalizedRow['fathername'] || normalizedRow['mothername'] || normalizedRow['guardianname'] || normalizedRow['parent'] || 'Guardian';
        
        let parentRelation: 'Father' | 'Mother' | 'Guardian' = 'Guardian';
        const rawRel = (normalizedRow['parentrelation'] || normalizedRow['relation'] || normalizedRow['relationship'] || '').toLowerCase();
        if (rawRel.includes('fath')) parentRelation = 'Father';
        else if (rawRel.includes('moth')) parentRelation = 'Mother';

        const parentPhone = normalizedRow['parentphone'] || normalizedRow['phone'] || normalizedRow['mobile'] || normalizedRow['contact'] || normalizedRow['phonenumber'] || normalizedRow['whatsapp'] || '';
        const parentEmail = normalizedRow['parentemail'] || normalizedRow['email'] || normalizedRow['mail'] || '';
        const sheetTrainer = normalizedRow['trainer'] || normalizedRow['trainername'] || normalizedRow['trainerid'] || '';

        const errors: string[] = [];
        if (!name) errors.push('Missing Name');
        if (!rollNumber) errors.push('Missing Roll Number');
        if (!parentPhone) errors.push('Missing Parent Phone');

        return {
          name,
          rollNumber,
          gender,
          parentName,
          parentRelation,
          parentPhone,
          parentEmail,
          sheetTrainer,
          isValid: errors.length === 0,
          errors
        };
      });

      setFileName(name);
      setParsedRows(rows);
      showToast(`Parsed ${rows.length} rows from ${name}`, 'info');
    } catch (err) {
      console.error('Failed to parse file:', err);
      showToast('Could not read the Excel file. Please ensure it is a valid .xlsx, .xls, or .csv file.', 'alert');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      processWorkbook(workbook, file.name);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      processWorkbook(workbook, file.name);
    };
    reader.readAsArrayBuffer(file);
  };

  // Generate and download sample template Excel file
  const downloadSampleTemplate = () => {
    const sampleData = [
      {
        'Student Name': 'Rohan Sharma',
        'Roll Number': 'FS-101',
        'Gender': 'Male',
        'Parent Name': 'Rajesh Sharma',
        'Parent Relation': 'Father',
        'Parent Phone': '+1 (555) 321-4567',
        'Parent Email': 'rajesh.sharma@example.com'
      },
      {
        'Student Name': 'Ananya Verma',
        'Roll Number': 'FS-102',
        'Gender': 'Female',
        'Parent Name': 'Sunita Verma',
        'Parent Relation': 'Mother',
        'Parent Phone': '+1 (555) 654-7890',
        'Parent Email': 'sunita.verma@example.com'
      },
      {
        'Student Name': 'Kevin O\'Brian',
        'Roll Number': 'FS-103',
        'Gender': 'Male',
        'Parent Name': 'Liam O\'Brian',
        'Parent Relation': 'Father',
        'Parent Phone': '+1 (555) 987-6543',
        'Parent Email': 'liam.obrian@example.com'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    // Set nice column widths
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 18 },
      { wch: 16 },
      { wch: 20 },
      { wch: 28 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'Attendify_Students_Template.xlsx');
    showToast('Downloaded sample Excel template', 'success');
  };

  // Perform import
  const handleImport = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      showToast('No valid student rows to import.', 'alert');
      return;
    }

    const targetTrainerId = selectedTrainerId || activeTrainer?.id || (trainers[0]?.id ?? '');
    if (!targetTrainerId) {
      showToast('Please select a target trainer to assign these students.', 'alert');
      return;
    }

    setIsProcessing(true);
    try {
      const studentsToInsert: Omit<Student, 'id'>[] = validRows.map(r => {
        // Match sheet trainer if specified, else use target trainer
        let assignedTrainerId = targetTrainerId;
        if (r.sheetTrainer) {
          const matched = trainers.find(t => 
            t.id === r.sheetTrainer || 
            t.name.toLowerCase() === r.sheetTrainer?.toLowerCase()
          );
          if (matched) assignedTrainerId = matched.id;
        }

        return {
          name: r.name,
          rollNumber: r.rollNumber,
          trainerId: assignedTrainerId,
          gender: r.gender,
          parentName: r.parentName,
          parentRelation: r.parentRelation,
          parentPhone: r.parentPhone,
          parentEmail: r.parentEmail
        };
      });

      await importStudentsBatch(studentsToInsert);
      handleReset();
      setIsImportModalOpen(false);
    } catch (err) {
      console.error('Import error:', err);
      showToast('Failed to import students. Please check the logs.', 'alert');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFileName('');
    setParsedRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
                <span>Import Students from Excel</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  .xlsx, .xls, .csv
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Upload your student roster spreadsheet to batch-enroll students
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsImportModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Controls: Target Trainer & Download Template */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                Assign Students To Trainer:
              </label>
              <div className="relative">
                <UserCheck className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <select
                  value={selectedTrainerId}
                  onChange={(e) => setSelectedTrainerId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium focus:outline-none"
                >
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={downloadSampleTemplate}
                className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span>Download Sample Excel Template</span>
              </button>
            </div>
          </div>

          {/* File Upload / Dropzone */}
          {!fileName ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-neutral-900 dark:border-white bg-neutral-100/60 dark:bg-neutral-800/60' 
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                Click or drag &amp; drop your Excel file here
              </p>
              <p className="text-neutral-400 text-[11px] mt-1">
                Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv) spreadsheets
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info Bar */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {fileName}
                    </p>
                    <p className="text-[11px] text-neutral-400 flex items-center space-x-2 mt-0.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ {validCount} valid rows
                      </span>
                      {invalidCount > 0 && (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          &bull; {invalidCount} missing required data
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Parsed Rows Preview Table */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                <div className="max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-700">
                      <tr>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5">Roll No</th>
                        <th className="p-2.5">Parent Name</th>
                        <th className="p-2.5">Parent Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                      {parsedRows.slice(0, 50).map((row, idx) => (
                        <tr key={idx} className={row.isValid ? 'hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30' : 'bg-rose-50/40 dark:bg-rose-950/20'}>
                          <td className="p-2.5">
                            {row.isValid ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <span title={row.errors.join(', ')}>
                                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 font-sans font-medium text-neutral-900 dark:text-neutral-100">
                            {row.name || <span className="text-rose-500 italic">Missing</span>}
                          </td>
                          <td className="p-2.5 text-neutral-600 dark:text-neutral-400">
                            {row.rollNumber || <span className="text-rose-500 italic">Missing</span>}
                          </td>
                          <td className="p-2.5 font-sans text-neutral-600 dark:text-neutral-400">
                            {row.parentName}
                          </td>
                          <td className="p-2.5 text-neutral-600 dark:text-neutral-400">
                            {row.parentPhone || <span className="text-rose-500 italic">Missing</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedRows.length > 50 && (
                  <div className="p-2 text-center text-[10px] text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700">
                    Showing first 50 rows of {parsedRows.length} total rows
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={validCount === 0 || isProcessing}
            onClick={handleImport}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>
              {isProcessing ? 'Importing...' : `Import ${validCount} Students`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
