export function toDTO(doc: any) {
    return {
        _id: doc._id.toString(),
        userId: doc.userId,
        position: doc.position,
        experienceRequired: doc.experienceRequired,
        requiredSkills: doc.requiredSkills,
        requiredQualifications: doc.requiredQualifications,
        niceToHaveSkills: doc.niceToHaveSkills,
        niceToHaveQualifications: doc.niceToHaveQualifications,
        responsibilities: doc.responsibilities,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString()
    };
}