import React from 'react'

interface EditJobDescriptionProps {
  onClose: () => void;
  onSuccess: () => void;
  jobId: string;
}

const EditJobDescription: React.FC<EditJobDescriptionProps> = ({ onClose, onSuccess, jobId }) => {
  return (
    <div>EditJobDescription</div>
  )
}

export default EditJobDescription