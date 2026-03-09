import React from 'react'

interface ViewResumeAnalysisResultProps {
  resumeId: string;
  onClose: () => void;
}

const ViewResumeAnalysisResult: React.FC<ViewResumeAnalysisResultProps> = ({ resumeId, onClose }) => {
  return (
    <div>ViewResumeAnalysisResult</div>
  )
}

export default ViewResumeAnalysisResult