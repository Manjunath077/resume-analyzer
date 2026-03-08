'use client'

import ResumeUploadForm from '@/features/resume/ui/components/ResumeUploadForm';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { apiClient } from '@/lib/api/axios';
import { JobDescriptionDto } from '@/features/job-description/job-description.types';
import { PaginatedResponse } from '@/types/paginated-response';
import { ResumeMetadataDto } from '@/features/resume/resume.types';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiDownload,
  FiEye,
  FiFileText,
  FiMail,
  FiPlayCircle,
  FiTrash2,
  FiUpload
} from 'react-icons/fi';
import { LuLoaderCircle } from 'react-icons/lu';
import { TbAlertTriangleFilled } from "react-icons/tb";


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
          icon:<FiFileText size={30} color='gold' className="mx-auto" />
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
        {/* Job Overview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LuLoaderCircle className="animate-spin text-gray-500" />
              <span className="ml-3 text-gray-600">Loading job details...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <TbAlertTriangleFilled className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : !jobData ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No job details found</p>
            </div>
          ) : (
            <>
              {/* Header with title and metadata */}
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">{formattedJobDetails?.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {formattedJobDetails?.experience !== "Not specified" && (
                    <span>• {formattedJobDetails?.experience}</span>
                  )}
                  {formattedJobDetails && formattedJobDetails.skills > 0 && (
                    <span>• {formattedJobDetails.skills} Skills</span>
                  )}
                  {formattedJobDetails?.createdDate !== "Not specified" && (
                    <span>• Created {formattedJobDetails?.createdDate}</span>
                  )}
                </div>
              </div>

              {/* Job Overview Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  {formattedJobDetails && formattedJobDetails.requiredSkills.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {formattedJobDetails.requiredSkills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {formattedJobDetails && formattedJobDetails.niceToHaveSkills.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">Nice to Have Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {formattedJobDetails.niceToHaveSkills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm border border-gray-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  {formattedJobDetails && formattedJobDetails.experience !== "Not specified" && (
                    <>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Experience Required</h3>
                      <p className="text-gray-900">{formattedJobDetails.experience}</p>
                    </>
                  )}

                  {formattedJobDetails && formattedJobDetails.requiredQualifications.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-gray-500 mt-3 mb-2">Required Qualifications</h3>
                      <ul className="list-disc list-inside text-gray-900">
                        {formattedJobDetails.requiredQualifications.map((qual, index) => (
                          <li key={index} className="text-sm">{qual}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {formattedJobDetails && formattedJobDetails.niceToHaveQualifications.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-gray-500 mt-3 mb-2">Nice to Have Qualifications</h3>
                      <ul className="list-disc list-inside text-gray-900">
                        {formattedJobDetails.niceToHaveQualifications.map((qual, index) => (
                          <li key={index} className="text-sm">{qual}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons - Always visible */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenUploadSheet}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FiUpload className="w-4 h-4" />
              <span>Upload Resumes</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <FiDownload className="w-4 h-4" />
              <span>Import from Drive</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <FiMail className="w-4 h-4" />
              <span>Import from Gmail</span>
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalysisRunning}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${isAnalysisRunning
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
            >
              {isAnalysisRunning ? (
                <>
                  <LuLoaderCircle className="w-4 h-4 animate-spin" />
                  <span>Starting Analysis...</span>
                </>
              ) : (
                <>
                  <FiPlayCircle className="w-4 h-4" />
                  <span>Run analysis</span>
                </>
              )}
            </button>
          </div>

          {analysisError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{analysisError}</p>
            </div>
          )}

          {/* Upload Resume Dialog */}
          <Sheet open={isUploadSheetOpen} onOpenChange={setIsUploadSheetOpen}>
            <SheetContent side="right" className="w-full md:max-w-4xl">
              <SheetHeader className='py-1'>
                <SheetTitle>
                  Upload Resumes for {formattedJobDetails?.title || "Job"}
                </SheetTitle>
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
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Resume Summary</h2>
          </div>

          {/* Conditional rendering using ternary operators */}
          {resumesLoading ? (
            <div className="flex justify-center items-center py-12">
              <LuLoaderCircle className="animate-spin text-gray-500" />
              <span className="ml-3 text-gray-600">Loading resumes...</span>
            </div>
          ) : resumesError ? (
            <div className="text-center py-12">
              <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600">{resumesError}</p>
            </div>
          ) : !resumesData?.content || resumesData.content.length === 0 ? (
            <div className="text-center py-12">
              <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No resumes uploaded yet</p>
              <button
                onClick={handleOpenUploadSheet}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Your First Resume
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Candidate</TableHead>
                    <TableHead className="font-semibold">Upload Status</TableHead>
                    <TableHead className="font-semibold">Analysis Status</TableHead>
                    <TableHead className="font-semibold">Uploaded On</TableHead>
                    <TableHead className="font-semibold">Analysis</TableHead>
                    <TableHead className="font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resumesData.content.map((resume: any) => (
                    <TableRow key={resume._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium p-5">
                        {resume.candidateName || "Not specified"}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                        ${resume.analysisStatus === "processed"
                            ? "bg-green-100 text-green-700"
                            : (resume.analysisStatus === "processing" || resume.analysisStatus === "pending")
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                          {resume.analysisStatus?.replace('_', ' ') || "pending"}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(resume.createdAt)}
                      </TableCell>
                      <TableCell>
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 cursor-pointer">
                          <FiEye className="w-4 h-4" />
                          <span className="text-sm">View</span>
                        </button>
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
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                  <FiAlertCircle className="w-5 h-5" />
                  Confirm Deletion
                </AlertDialogTitle>
                <AlertDialogDescription className="pt-3">
                  Are you sure you want to delete the resume for{' '}
                  <span className="font-semibold text-gray-900">
                    {selectedResume?.candidateName || 'this candidate'}
                  </span>
                  ? This action cannot be undone. The resume will be permanently removed from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
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
        </div>
      </div>
    </div>
  );
};

export default ListJobResume;