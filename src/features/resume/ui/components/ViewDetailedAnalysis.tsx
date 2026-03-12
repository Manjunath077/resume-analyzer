import React, { useEffect, useState } from 'react';
import {
    FiAward,
    FiUsers,
    FiTrendingUp,
    FiTrendingDown,
    FiBarChart2,
    FiAlertCircle,
    FiCheckCircle,
    FiXCircle,
    FiUser,
    FiBriefcase,
    FiStar,
    FiThumbsUp
} from 'react-icons/fi';
import { LuLoaderCircle } from 'react-icons/lu';
import { TbAlertTriangleFilled } from "react-icons/tb";
import { apiClient } from '@/lib/api/axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CandidateRankingResponse } from '@/features/analysis/domain/candidate-ranking.types';

interface ViewDetailedAnalysisProps {
    onClose: () => void;
    jobId: string;
}

const ViewDetailedAnalysis: React.FC<ViewDetailedAnalysisProps> = ({ onClose, jobId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [analysisData, setAnalysisData] = useState<CandidateRankingResponse | null>(null);

    useEffect(() => {
        const fetchRankedCandidates = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiClient.get(`/analysis/job/${jobId}/ranking`);
                setAnalysisData(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch ranked candidates');
                console.error('Error fetching ranked candidates:', err);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchRankedCandidates();
        }
    }, [jobId]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getProbabilityColor = (probability: number) => {
        if (probability >= 0.7) return 'text-green-600';
        if (probability >= 0.4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatProbability = (probability: number) => {
        return `${(probability * 100).toFixed(0)}%`;
    };

    return (
        <div className="h-full overflow-y-auto">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <LuLoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="mt-4 text-sm text-gray-600">Loading analysis data...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 px-4">
                    <TbAlertTriangleFilled className="w-12 h-12 text-red-500 mb-3" />
                    <p className="text-sm text-red-600 text-center">{error}</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    >
                        Close
                    </button>
                </div>
            ) : !analysisData ? (
                <div className="flex flex-col items-center justify-center h-64 px-4">
                    <FiBarChart2 className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 text-center">No analysis data available</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    >
                        Close
                    </button>
                </div>
            ) : (
                <div className="space-y-6 p-1">
                    {/* Summary Section */}
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiBarChart2 className="w-4 h-4 text-blue-600" />
                            Analysis Summary
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Total Candidates */}
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FiUsers className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-xs text-gray-500">Total</span>
                                    </div>
                                    <span className="text-lg font-semibold text-gray-800">
                                        {analysisData.summary.totalCandidates}
                                    </span>
                                </div>
                            </div>

                            {/* Average Score */}
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <FiTrendingUp className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span className="text-xs text-gray-500">Avg Score</span>
                                    </div>
                                    <span className={`text-lg font-semibold ${getScoreColor(analysisData.summary.averageScore)}`}>
                                        {analysisData.summary.averageScore}%
                                    </span>
                                </div>
                            </div>

                            {/* Top Score */}
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <FiAward className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-xs text-gray-500">Top Score</span>
                                    </div>
                                    <span className="text-lg font-semibold text-green-600">
                                        {analysisData.summary.topScore}%
                                    </span>
                                </div>
                            </div>

                            {/* Lowest Score */}
                            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <FiTrendingDown className="w-4 h-4 text-red-600" />
                                        </div>
                                        <span className="text-xs text-gray-500">Lowest</span>
                                    </div>
                                    <span className="text-lg font-semibold text-red-600">
                                        {analysisData.summary.lowestScore}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ranked Candidates Table */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FiStar className="w-4 h-4 text-yellow-500" />
                            Ranked Candidates
                        </h3>

                        {analysisData.rankedCandidates.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <FiUsers className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No ranked candidates available</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="font-semibold text-xs whitespace-nowrap">Rank</TableHead>
                                            <TableHead className="font-semibold text-xs whitespace-nowrap">Candidate</TableHead>
                                            <TableHead className="font-semibold text-xs whitespace-nowrap">Fit Score</TableHead>
                                            <TableHead className="font-semibold text-xs whitespace-nowrap">Interview Prob.</TableHead>
                                            <TableHead className="font-semibold text-xs whitespace-nowrap">Experience</TableHead>
                                            <TableHead className="font-semibold text-xs whitespace-nowrap">Matched Skills</TableHead>
                                            <TableHead className="font-semibold text-xs whitespace-nowrap">Missing Skills</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analysisData.rankedCandidates.map((candidate) => (
                                            <TableRow key={candidate.resumeId} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                            ${candidate.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                            candidate.rank === 2 ? 'bg-gray-200 text-gray-700' :
                                                                candidate.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                                    'bg-gray-100 text-gray-600'}
                          `}>
                                                        {candidate.rank}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-gray-100 rounded-full">
                                                            <FiUser className="w-3 h-3 text-gray-600" />
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-medium">
                                                            {candidate.candidateName || 'Not specified'}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <span className={`text-sm font-semibold ${getScoreColor(candidate.overallFitScore)}`}>
                                                        {candidate.overallFitScore}%
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <span className={`text-sm font-medium ${getProbabilityColor(candidate.interviewProbability)}`}>
                                                        {formatProbability(candidate.interviewProbability)}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <FiBriefcase className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs">{candidate.experienceYears} yrs</span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1 max-w-50">
                                                        {candidate.matchedSkills.length > 0 ? (
                                                            candidate.matchedSkills.map((skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs"
                                                                >
                                                                    <FiCheckCircle className="w-2.5 h-2.5" />
                                                                    {skill}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-gray-400">None</span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1 max-w-50">
                                                        {candidate.missingCriticalSkills.length > 0 ? (
                                                            candidate.missingCriticalSkills.map((skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs"
                                                                >
                                                                    <FiXCircle className="w-2.5 h-2.5" />
                                                                    {skill}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                                <FiThumbsUp className="w-3 h-3" />
                                                                No missing skills
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewDetailedAnalysis;