import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LuUpload, LuFile, LuStar, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useDropzone } from 'react-dropzone';
import { pageTransition, staggerContainer } from '@/animations/variants';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useResumes } from '@/hooks/useResumes';
import { formatDate } from '@/utils/formatDate';
import { truncate } from '@/utils/truncate';
import toast from 'react-hot-toast';

export function ResumesPage() {
  const { list, upload, remove, rename, setDefault } = useResumes();
  const { list: resumesList } = useResumes();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  
  const resumes = resumesList.data?.data?.data?.data || [];
  // console.log('resumes', resumesList.data?.data?.data?.data);
  const maxSize = 10 * 1024 * 1024; // 10MB

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    upload.mutate({
      formData,
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      },
    });

    setUploadProgress(null);
  }, [upload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize,
  });

  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible">
      <PageHeader title="Resumes" action={
        <Button leftIcon={LuUpload} onClick={() => document.querySelector('input[type=file]')?.click()}>
          Upload Resume
        </Button>
      } />

      {/* Upload Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors cursor-pointer ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <LuUpload className="h-8 w-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-600 font-medium">Drag & drop your resume here</p>
        <p className="text-xs text-gray-400 mt-1">or click to browse. PDF files only, max 10MB.</p>
      </div>

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700">Uploading...</span>
              <span className="text-xs text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Resumes Grid */}
      {list.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mx-auto mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12">
          <LuFile className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-medium text-gray-900 mb-1">No resumes uploaded</h3>
          <p className="text-sm text-gray-500 mb-4">Upload your first resume to get started.</p>
          <Button leftIcon={LuUpload} onClick={() => document.querySelector('input[type=file]')?.click()}>
            Upload Resume
          </Button>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <motion.div
              key={resume._id || resume.id}
              className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-card hover:shadow-sm transition-shadow"
            >
              <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                <LuFile className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1 truncate">{resume.name}</p>
              <p className="text-xs text-gray-500 mb-3">
                {resume.fileSize ? `${(resume.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}
                {resume.createdAt && ` · ${formatDate(resume.createdAt, 'MMM D, YYYY')}`}
              </p>
              {resume.isDefault && <Badge variant="info" size="sm" className="mb-3">Default</Badge>}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setDefault.mutate(resume._id || resume.id)}
                  className={`p-1.5 rounded-md hover:bg-gray-100 ${resume.isDefault ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label="Set default"
                >
                  <LuStar className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const newName = prompt('Enter new name:', resume.name);
                    if (newName && newName !== resume.name) {
                      rename.mutate({ id: resume._id || resume.id, name: newName });
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                  aria-label="Rename"
                >
                  <LuPencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(resume)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
                  aria-label="Delete"
                >
                  <LuTrash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => { remove.mutate(deleteConfirm._id || deleteConfirm.id); setDeleteConfirm(null); }}
        title="Delete Resume"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"?`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}