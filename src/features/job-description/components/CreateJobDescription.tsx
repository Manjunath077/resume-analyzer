import React from 'react'

interface CreateJobDescriptionProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CreateJobDescription: React.FC<CreateJobDescriptionProps> = ({ onClose, onSuccess }) => {
    return (
        <div>CreateJobDescription</div>
    )
}

export default CreateJobDescription