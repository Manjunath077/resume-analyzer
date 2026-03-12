'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { JobDescriptionDto } from '@/features/job-description/job-description.types';
import { ResumeMetadataDto } from '@/features/resume/resume.types';
import ResumeUploadForm from '@/features/resume/ui/components/ResumeUploadForm';
import { apiClient } from '@/lib/api/axios';
import { PaginatedResponse } from '@/types/paginated-response';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiBarChart2,
  FiDownload,
  FiEye,
  FiFileText,
  FiPlayCircle,
  FiTrash2,
  FiUpload
} from 'react-icons/fi';
import { LuLoaderCircle } from 'react-icons/lu';
import { TbAlertTriangleFilled } from "react-icons/tb";
import ViewResumeAnalysisResult from './ViewResumeAnalysisResult';
import ViewDetailedAnalysis from "./ViewDetailedAnalysis";


const ListJobResume = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const params = useParams()
  const jobId = params.id as string

  const [jobData, setJobData] = useState<JobDescriptionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumesData, setResumesData] = useState<PaginatedResponse<ResumeMetadataDto> | null>(null);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [resumesError, setResumesError] = useState<string | null>(null);
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeMetadataDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisSheetOpen, setAnalysisSheetOpen] = useState(false);
  const [selectedResumeForAnalysis, setSelectedResumeForAnalysis] = useState<string | null>(null);
  const [detailedAnalysisSheetOpen, setDetailedAnalysisSheetOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!session?.user?.id || !jobId) return;

      try {
        setLoading(true);
        const response = await apiClient.get(`/job-description/user/${session.user.id}/job/${jobId}`);
        setJobData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch job details');
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [session?.user?.id, jobId]);

  useEffect(() => {
    fetchResumesMetadata();
  }, [jobId]);


  const fetchResumesMetadata = async () => {
    if (!jobId) return;

    setResumesLoading(true);
    setResumesError(null);

    try {
      const response = await apiClient.get(`/resumes/metadata?page=0&size=10&jobId=${jobId}`);
      setResumesData(response.data);
    } catch (err) {
      setResumesError('Failed to fetch resumes data');
      console.error('Error fetching resumes:', err);
    } finally {
      setResumesLoading(false);
    }
  };


  // Format job details from API
  const formattedJobDetails = jobData ? {
    title: jobData.position || "Frontend Developer",
    experience: jobData.experienceRequired ?
      `${jobData.experienceRequired.minYears}-${jobData.experienceRequired.maxYears} Years` :
      "Not specified",
    skills: jobData.requiredSkills?.length || 0,
    createdDate: jobData.createdAt ?
      new Date(jobData.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) :
      "Not specified",
    requiredSkills: jobData.requiredSkills || [],
    niceToHaveSkills: jobData.niceToHaveSkills || [],
    requiredQualifications: jobData.requiredQualifications || [],
    niceToHaveQualifications: jobData.niceToHaveQualifications || []
  } : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleOpenUploadSheet = () => {
    setIsUploadSheetOpen(true);
  };

  const handleCloseUploadSheet = () => {
    setIsUploadSheetOpen(false);
  };

  const handleDeleteClick = (resume: ResumeMetadataDto) => {
    setSelectedResume(resume);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResume) return;

    setIsDeleting(true);
    const loadingToast = toast.loading('Deleting resume...');

    try {
      await apiClient.delete(`/resumes/metadata?resumeId=${selectedResume._id}`);

      toast.dismiss(loadingToast);
      toast.success('Resume deleted successfully!', {
        duration: 5000,
      });

      // Refresh the resumes list
      fetchResumesMetadata();

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete resume. Please try again.', {
        duration: 5000,
      });
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedResume(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedResume(null);
  };


  const handleRunAnalysis = async () => {
    if (!jobId) return;

    setIsAnalysisRunning(true);
    setAnalysisError(null);

    const loadingToast = toast.loading("Starting analysis...");

    try {
      const response = await apiClient.post("/analysis/run", { jobId });

      const { message, queuedJobs } = response.data;

      toast.dismiss(loadingToast);

      // If no resumes were queued
      if (queuedJobs === 0) {
        toast(message, {
          duration: 5000,
          icon: <FiFileText size={30} color='gold' className="mx-auto" />
        });
        return;
      }

      // Success case
      toast.success(`${message} (${queuedJobs} resumes queued)`, {
        duration: 5000,
      });

      // Refresh resume list
      fetchResumesMetadata();

    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.error || "Failed to start analysis";
      setAnalysisError(errorMessage);
      toast.error(errorMessage, { duration: 5000 });
      console.error("Analysis error:", error);
    } finally {
      setIsAnalysisRunning(false);
    }
  };

  const handleViewAnalysis = (resumeId: string) => {
    setSelectedResumeForAnalysis(resumeId);
    setAnalysisSheetOpen(true);
  };

  const handleCloseAnalysisSheet = () => {
    setAnalysisSheetOpen(false);
    setSelectedResumeForAnalysis(null);
  };

  const handleDetailedAnalysis = () => {
    setDetailedAnalysisSheetOpen(true);
  };

  const handleCloseDetailedAnalysis = () => {
    setDetailedAnalysisSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-24">
        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">Back to Dashboard</span>
        </button>

        {/* Job Overview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LuLoaderCircle className="animate-spin text-gray-500" />
              <span className="ml-3 text-sm sm:text-base text-gray-600">Loading job details...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <TbAlertTriangleFilled className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3" />
              <p className="text-sm sm:text-base text-red-600">{error}</p>
            </div>
          ) : !jobData ? (
            <div className="text-center py-8">
              <p className="text-sm sm:text-base text-gray-500">No job details found</p>
            </div>
          ) : (
            <>
              {/* Header with title and metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 wrap-break-words">
                  {formattedJobDetails?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                  {formattedJobDetails?.experience !== "Not specified" && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">• {formattedJobDetails?.experience}</span>
                  )}
                  {formattedJobDetails && formattedJobDetails.skills > 0 && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">• {formattedJobDetails.skills} Skills</span>
                  )}
                  {formattedJobDetails?.createdDate !== "Not specified" && (
                    <span className="bg-gray-100 px-2 py-1 rounded-full">• Created {formattedJobDetails?.createdDate}</span>
                  )}
                </div>
              </div>

              {/* Job Overview Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  {formattedJobDetails && formattedJobDetails.requiredSkills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {formattedJobDetails.requiredSkills.map((skill, index) => (
                          <span key={index} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formattedJobDetails && formattedJobDetails.niceToHaveSkills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Nice to Have Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {formattedJobDetails.niceToHaveSkills.map((skill, index) => (
                          <span key={index} className="px-2 sm:px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs sm:text-sm border border-gray-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {formattedJobDetails && formattedJobDetails.experience !== "Not specified" && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Experience Required</h3>
                      <p className="text-sm sm:text-base text-gray-900">{formattedJobDetails.experience}</p>
                    </div>
                  )}

                  {formattedJobDetails && formattedJobDetails.requiredQualifications.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Required Qualifications</h3>
                      <ul className="list-disc list-inside text-gray-900 space-y-1">
                        {formattedJobDetails.requiredQualifications.map((qual, index) => (
                          <li key={index} className="text-xs sm:text-sm wrap-break-words">{qual}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {formattedJobDetails && formattedJobDetails.niceToHaveQualifications.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Nice to Have Qualifications</h3>
                      <ul className="list-disc list-inside text-gray-900 space-y-1">
                        {formattedJobDetails.niceToHaveQualifications.map((qual, index) => (
                          <li key={index} className="text-xs sm:text-sm wrap-break-words">{qual}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons - Always visible */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenUploadSheet}
              className="inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <FiUpload className="w-4 h-4" />
              <span>Upload Resumes</span>
            </button>
            <button className="inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
              <FiDownload className="w-4 h-4" />
              <span>Import from Drive</span>
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalysisRunning}
              className={`inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border rounded-lg transition-colors text-sm sm:text-base ${isAnalysisRunning
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
            >
              {isAnalysisRunning ? (
                <>
                  <LuLoaderCircle className="w-4 h-4 animate-spin" />
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <FiPlayCircle className="w-4 h-4" />
                  <span>Run analysis</span>
                </>
              )}
            </button>

            <button
              onClick={handleDetailedAnalysis}
              className="inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
              <FiBarChart2 className="w-4 h-4" />
              <span>Detailed Analysis</span>
            </button>
          </div>

          {analysisError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-600 wrap-break-words">{analysisError}</p>
            </div>
          )}

          {/* Upload Resume Dialog */}
          <Sheet open={isUploadSheetOpen} onOpenChange={setIsUploadSheetOpen}>
            <SheetContent side="right" className="w-full md:max-w-3xl">
              <SheetHeader className='p-2'>
                <SheetTitle>
                  Upload Resumes for {formattedJobDetails?.title || "Job"}
                </SheetTitle>
                <SheetDescription>Drag and drop resume files to begin automated candidate screening</SheetDescription>
              </SheetHeader>
              <ResumeUploadForm
                onClose={handleCloseUploadSheet}
                onSuccess={() => {
                  fetchResumesMetadata();
                }}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Resume Summary Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Resume Summary</h2>
          </div>

          {/* Conditional rendering using ternary operators */}
          {resumesLoading ? (
            <div className="flex justify-center items-center py-12">
              <LuLoaderCircle className="animate-spin text-gray-500" />
              <span className="ml-3 text-sm sm:text-base text-gray-600">Loading resumes...</span>
            </div>
          ) : resumesError ? (
            <div className="text-center py-12 px-4">
              <FiAlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3" />
              <p className="text-sm sm:text-base text-red-600 wrap-break-words">{resumesError}</p>
            </div>
          ) : !resumesData?.content || resumesData.content.length === 0 ? (
            <div className="text-center py-12 px-4">
              <FiUpload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm sm:text-base text-gray-500">No resumes uploaded yet</p>
              <button
                onClick={handleOpenUploadSheet}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                Upload Your First Resume
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Candidate</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Upload Status</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Analysis Status</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap hidden sm:table-cell">Uploaded On</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Analysis</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resumesData.content.map((resume: any) => (
                    <TableRow key={resume._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium p-3 sm:p-4">
                        <span className="text-xs sm:text-sm wrap-break-words line-clamp-2">
                          {resume.candidateName || "Not specified"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap
                          ${resume.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : resume.status === "uploaded"
                              ? "bg-blue-100 text-blue-700"
                              : resume.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                          }`}>
                          {resume.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap
                          ${resume.analysisStatus === "processed"
                            ? "bg-green-100 text-green-700"
                            : (resume.analysisStatus === "processing" || resume.analysisStatus === "pending")
                              ? "bg-yellow-100 text-yellow-700"
                              : resume.analysisStatus === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                          }`}>
                          {resume.analysisStatus?.replace('_', ' ') || "pending"}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 hidden sm:table-cell">
                        <span className="text-xs sm:text-sm whitespace-nowrap">
                          {formatDate(resume.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {resume.analysisStatus === "processed" ? (
                          <button
                            onClick={() => handleViewAnalysis(resume._id)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            <FiEye className="w-4 h-4" />
                            <span className="text-xs sm:text-sm hidden sm:inline">View</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs sm:text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDeleteClick(resume)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-800 cursor-pointer transition-colors"
                          disabled={isDeleting}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent className="w-[95vw] max-w-lg p-4 sm:p-6">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600 flex items-center gap-2 text-lg sm:text-xl">
                  <FiAlertCircle className="w-5 h-5" />
                  Confirm Deletion
                </AlertDialogTitle>
                <AlertDialogDescription className="pt-3 text-sm sm:text-base">
                  Are you sure you want to delete the resume for{' '}
                  <span className="font-semibold text-gray-900 wrap-break-words">
                    {selectedResume?.candidateName || 'this candidate'}
                  </span>
                  ? This action cannot be undone. The resume will be permanently removed from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                >
                  {isDeleting ? (
                    <>
                      <LuLoaderCircle className="animate-spin mr-2 h-4 w-4" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Resume'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Analysis Result Dialog */}
          <Sheet open={analysisSheetOpen} onOpenChange={setAnalysisSheetOpen}>
            <SheetContent side="right" className="w-full md:max-w-3xl">
              <SheetHeader className='p-2'>
                <SheetTitle>Resume Analysis Result</SheetTitle>
                <SheetDescription>Detailed candidate evaluation and job fit analysis</SheetDescription>
              </SheetHeader>
              {selectedResumeForAnalysis && (
                <ViewResumeAnalysisResult
                  resumeId={selectedResumeForAnalysis}
                  onClose={handleCloseAnalysisSheet}
                />
              )}
            </SheetContent>
          </Sheet>

          {/* Detailed Analysis Sheet */}
          <Sheet open={detailedAnalysisSheetOpen} onOpenChange={setDetailedAnalysisSheetOpen}>
            <SheetContent side="right" className="w-full md:max-w-full">
              <SheetHeader className='p-2'>
                <SheetTitle>Detailed Analysis</SheetTitle>
                <SheetDescription>Comprehensive analysis of all resumes against job requirements</SheetDescription>
              </SheetHeader>
              <ViewDetailedAnalysis
                onClose={handleCloseDetailedAnalysis}
                jobId={jobId}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default ListJobResume;