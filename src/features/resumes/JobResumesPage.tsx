'use client'

import React, { useEffect, useState } from 'react';
import {
  FiUpload,
  FiDownload,
  FiMail,
  FiRefreshCw,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api/axios';
import { JobDescriptionDto } from '@/types/jod-description';

const candidates = [
  {
    name: "John Doe",
    score: 82,
    experience: "5 Years",
    skills: ["React", "Node.js"],
    status: "Completed",
    statusColor: "green"
  },
  {
    name: "Jane Smith",
    score: 76,
    experience: "4 Years",
    skills: ["JavaScript", "CSS"],
    status: "Completed",
    statusColor: "green"
  },
  {
    name: "Mike Johnson",
    score: 65,
    experience: "3 Years",
    skills: ["JavaScript", "Git"],
    status: "Processing",
    statusColor: "yellow"
  },
  {
    name: "Lisa Brown",
    score: "--",
    experience: "Pending",
    skills: [],
    status: "Pending",
    statusColor: "gray"
  }
];

const JobResumesPage = () => {
  const { data: session } = useSession();
  const [jobData, setJobData] = useState<JobDescriptionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams()
  const jobId = params.id as string

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


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'Processing':
        return <FiRefreshCw className="w-4 h-4 text-yellow-500" />;
      default:
        return <FiClock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Job Overview Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading job details...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
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
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
          </div>
        </div>

        {/* Resume Summary Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Resume Summary</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills Matched
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {candidates.map((candidate, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {candidate.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidate.score !== "--" ? (
                        <span className="text-sm text-gray-900">{candidate.score}</span>
                      ) : (
                        <span className="text-sm text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{candidate.experience}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidate.skills.length > 0 ? (
                        <span className="text-sm text-gray-900">
                          {candidate.skills.join(', ')}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(candidate.status)}
                        <span className={`ml-2 text-sm ${getStatusColor(candidate.statusColor)} px-2 py-1 rounded-full`}>
                          {candidate.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                        <FiEye className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobResumesPage;