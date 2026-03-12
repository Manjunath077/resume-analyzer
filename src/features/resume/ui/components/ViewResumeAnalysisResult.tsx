import { AnalysisResult } from '@/features/analysis/domain/analysis-result.types';
import { apiClient } from '@/lib/api/axios';
import React, { useEffect, useState } from 'react';
import { BsFileEarmarkText } from "react-icons/bs";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiAlertCircle,
  FiBriefcase,
  FiCheckCircle,
  FiCode,
  FiMail,
  FiPhone,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiZap,
  FiPercent,
  FiTarget,
  FiPieChart
} from 'react-icons/fi';
import { GiStrong } from "react-icons/gi";
import { LuLoaderCircle } from 'react-icons/lu';
import { MdLightbulb, MdSchool, MdWork, MdWarning } from "react-icons/md";
import { TbAlertTriangleFilled, TbChartInfographic } from "react-icons/tb";
import { RiProgress4Line, RiMindMap } from "react-icons/ri";
import { HiOutlineChartBar } from "react-icons/hi";

interface ViewResumeAnalysisResultProps {
  resumeId: string;
  onClose: () => void;
}

const ViewResumeAnalysisResult: React.FC<ViewResumeAnalysisResultProps> = ({ resumeId, onClose }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(`/analysis/${resumeId}`);
        setAnalysisData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch analysis data');
        console.error('Error fetching analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchAnalysisData();
    }
  }, [resumeId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  const formatProbability = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <div className="p-3 max-h-[90vh] overflow-auto">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LuLoaderCircle className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Loading analysis data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <TbAlertTriangleFilled className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 text-sm sm:text-base mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      ) : !analysisData ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <BsFileEarmarkText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm sm:text-base">No analysis data found for this resume</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-linear-to-r from-blue-500 to-blue-300 rounded-xl p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                  <FiUser className="w-6 h-6" />
                  {analysisData.candidateName || 'Not specified'}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
                  {analysisData.email && (
                    <span className="flex items-center gap-1">
                      <FiMail className="w-4 h-4" />
                      {analysisData.email}
                    </span>
                  )}
                  {analysisData.phone && (
                    <span className="flex items-center gap-1">
                      <FiPhone className="w-4 h-4" />
                      {analysisData.phone}
                    </span>
                  )}
                  {analysisData.careerLevel && (
                    <span className="flex items-center gap-1 bg-blue-500/30 px-2 py-1 rounded-full">
                      <RiMindMap className="w-4 h-4" />
                      {analysisData.careerLevel}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`px-4 py-2 rounded-full ${getScoreBgColor(analysisData.overallFitScore || 0)} ${getScoreColor(analysisData.overallFitScore || 0)} font-bold text-2xl`}>
                  {analysisData.overallFitScore || 0}%
                </div>
                <p className="text-xs text-blue-100 mt-2">Overall Fit Score</p>
              </div>
            </div>

            {/* Role Fit */}
            {analysisData.roleFit && (
              <div className="mt-4 pt-4 border-t border-blue-400/30">
                <p className="text-sm text-blue-100 flex items-center gap-2">
                  <FiTarget className="w-4 h-4" />
                  <span className="font-medium">Role Fit:</span> {analysisData.roleFit}
                </p>
              </div>
            )}
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {analysisData.skillMatchScore !== undefined && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <FiCode className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Skills Match</p>
                <p className={`text-lg font-bold ${getScoreColor(analysisData.skillMatchScore)}`}>
                  {formatPercentage(analysisData.skillMatchScore)}
                </p>
              </div>
            )}

            {analysisData.experienceMatchScore !== undefined && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <MdWork className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Experience</p>
                <p className={`text-lg font-bold ${getScoreColor(analysisData.experienceMatchScore)}`}>
                  {formatPercentage(analysisData.experienceMatchScore)}
                </p>
              </div>
            )}

            {analysisData.educationMatchScore !== undefined && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <FaGraduationCap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Education</p>
                <p className={`text-lg font-bold ${getScoreColor(analysisData.educationMatchScore)}`}>
                  {formatPercentage(analysisData.educationMatchScore)}
                </p>
              </div>
            )}

            {analysisData.interviewProbability !== undefined && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <RiProgress4Line className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Interview Prob.</p>
                <p className="text-lg font-bold text-orange-600">
                  {formatProbability(analysisData.interviewProbability)}
                </p>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Analysis Date</p>
              <p className="text-sm font-semibold text-gray-900">
                {analysisData.createdAt ? formatDate(analysisData.createdAt) : 'Not specified'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Total Experience</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <MdWork className="w-4 h-4 text-gray-600" />
                {analysisData.experience?.total ? `${analysisData.experience.total} Years` : 'Not specified'}
              </p>
            </div>
          </div>

          {/* Skills Section */}
          {analysisData.skills && analysisData.skills.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiCode className="w-5 h-5 text-blue-600" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matched Skills */}
          {analysisData.matchedSkills && analysisData.matchedSkills.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.matchedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs sm:text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Critical Skills */}
          {analysisData.missingCriticalSkills && analysisData.missingCriticalSkills.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MdWarning className="w-5 h-5 text-orange-600" />
                Missing Critical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.missingCriticalSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs sm:text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills Section */}
          {analysisData.softSkills && analysisData.softSkills.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiUsers className="w-5 h-5 text-green-600" />
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.softSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs sm:text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {analysisData.education && analysisData.education.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaGraduationCap className="w-5 h-5 text-purple-600" />
                Education
              </h3>
              <ul className="space-y-2">
                {analysisData.education.map((edu, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <MdSchool className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strengths Section */}
          {analysisData.strengths && analysisData.strengths.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GiStrong className="w-5 h-5 text-green-600" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {analysisData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <FiCheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps Section */}
          {analysisData.gaps && analysisData.gaps.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-orange-600" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {analysisData.gaps.map((gap, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <TbAlertTriangleFilled className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Flags */}
          {analysisData.riskFlags && analysisData.riskFlags.length > 0 && (
            <div className="bg-white border border-red-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TbAlertTriangleFilled className="w-5 h-5 text-red-600" />
                Risk Flags
              </h3>
              <ul className="space-y-2">
                {analysisData.riskFlags.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <MdWarning className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations Section */}
          {analysisData.recommendations && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-blue-600" />
                Recommendations
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysisData.recommendations}
              </p>
            </div>
          )}

          {/* Companies Experience (if available) */}
          {analysisData.experience?.companies && analysisData.experience.companies.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiBriefcase className="w-5 h-5 text-indigo-600" />
                Companies
              </h3>
              <ul className="space-y-2">
                {analysisData.experience.companies.map((company, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <MdWork className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <span>{company}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Relevant Projects (if available) */}
          {analysisData.experience?.relevantProjects && analysisData.experience.relevantProjects.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiZap className="w-5 h-5 text-yellow-600" />
                Relevant Projects
              </h3>
              <ul className="space-y-2">
                {analysisData.experience.relevantProjects.map((project, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <MdLightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>{project}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewResumeAnalysisResult;