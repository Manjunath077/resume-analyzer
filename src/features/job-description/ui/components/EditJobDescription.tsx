import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { apiClient } from '@/lib/api/axios'
import { JobDescriptionDto } from '@/features/job-description/job-description.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LuLoaderCircle } from 'react-icons/lu'
import { z } from 'zod'

interface EditJobDescriptionProps {
  onClose: () => void
  onSuccess: () => void
  jobId: string
}

const ExperienceRequiredSchema = z.object({
  minYears: z
    .number()
    .min(0, 'Minimum years cannot be negative')
    .max(50, 'Maximum allowed is 50'),
  maxYears: z
    .number()
    .min(0, 'Maximum years cannot be negative')
    .max(50, 'Maximum allowed is 50')
    .optional(),
})

export const JobDescriptionSchema = z.object({
  position: z
    .string()
    .trim()
    .min(1, 'Position title is required')
    .max(200),

  experienceRequired: ExperienceRequiredSchema,

  requiredSkills: z
    .array(z.string().trim().min(1, 'Required skill cannot be empty'))
    .min(1, 'At least one required skill is required'),

  requiredQualifications: z.array(
    z.string().trim().min(1, 'Qualification cannot be empty')
  ),

  niceToHaveSkills: z.array(
    z.string().trim().min(1, 'Skill cannot be empty')
  ),

  niceToHaveQualifications: z.array(
    z.string().trim().min(1, 'Qualification cannot be empty')
  ),

  responsibilities: z
    .array(z.string().trim().min(1, 'Responsibility cannot be empty'))
    .min(1, 'At least one responsibility is required'),
})

type JobDescriptionFormValues = z.infer<typeof JobDescriptionSchema>

const EditJobDescription: React.FC<EditJobDescriptionProps> = ({
  onClose,
  onSuccess,
  jobId,
}) => {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simple state for each array field - brute force approach
  const [requiredSkills, setRequiredSkills] = useState<string[]>([''])
  const [requiredQualifications, setRequiredQualifications] = useState<string[]>([''])
  const [niceToHaveSkills, setNiceToHaveSkills] = useState<string[]>([''])
  const [niceToHaveQualifications, setNiceToHaveQualifications] = useState<string[]>([''])
  const [responsibilities, setResponsibilities] = useState<string[]>([''])

  const form = useForm<JobDescriptionFormValues>({
    resolver: zodResolver(JobDescriptionSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      position: '',
      experienceRequired: {
        minYears: 0,
        maxYears: undefined,
      },
      requiredSkills: [''],
      requiredQualifications: [''],
      niceToHaveSkills: [''],
      niceToHaveQualifications: [''],
      responsibilities: [''],
    },
  })

  // Fetch existing job data
  useEffect(() => {
    if (!userId || !jobId) return

    const fetchData = async () => {
      try {
        const response = await apiClient.get<JobDescriptionDto>(
          `/job-description/user/${userId}/job/${jobId}`
        )

        const job = response.data

        // Set form values
        form.reset({
          position: job.position,
          experienceRequired: job.experienceRequired,
          requiredSkills: job.requiredSkills?.length ? job.requiredSkills : [''],
          requiredQualifications: job.requiredQualifications?.length ? job.requiredQualifications : [''],
          niceToHaveSkills: job.niceToHaveSkills?.length ? job.niceToHaveSkills : [''],
          niceToHaveQualifications: job.niceToHaveQualifications?.length ? job.niceToHaveQualifications : [''],
          responsibilities: job.responsibilities?.length ? job.responsibilities : [''],
        })

        // Set state arrays for the brute force fields
        setRequiredSkills(job.requiredSkills?.length ? job.requiredSkills : [''])
        setRequiredQualifications(job.requiredQualifications?.length ? job.requiredQualifications : [''])
        setNiceToHaveSkills(job.niceToHaveSkills?.length ? job.niceToHaveSkills : [''])
        setNiceToHaveQualifications(job.niceToHaveQualifications?.length ? job.niceToHaveQualifications : [''])
        setResponsibilities(job.responsibilities?.length ? job.responsibilities : [''])

      } catch {
        toast.error('Failed to load job description')
        onClose()
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [jobId, userId, form, onClose])

  // Simple handlers for each array field
  const handleAddRequiredSkill = () => {
    setRequiredSkills([...requiredSkills, ''])
  }

  const handleRemoveRequiredSkill = (index: number) => {
    const updated = requiredSkills.filter((_, i) => i !== index)
    setRequiredSkills(updated.length ? updated : [''])
  }

  const handleRequiredSkillChange = (index: number, value: string) => {
    const updated = [...requiredSkills]
    updated[index] = value
    setRequiredSkills(updated)
  }

  const handleAddRequiredQualification = () => {
    setRequiredQualifications([...requiredQualifications, ''])
  }

  const handleRemoveRequiredQualification = (index: number) => {
    const updated = requiredQualifications.filter((_, i) => i !== index)
    setRequiredQualifications(updated.length ? updated : [''])
  }

  const handleRequiredQualificationChange = (index: number, value: string) => {
    const updated = [...requiredQualifications]
    updated[index] = value
    setRequiredQualifications(updated)
  }

  const handleAddNiceToHaveSkill = () => {
    setNiceToHaveSkills([...niceToHaveSkills, ''])
  }

  const handleRemoveNiceToHaveSkill = (index: number) => {
    const updated = niceToHaveSkills.filter((_, i) => i !== index)
    setNiceToHaveSkills(updated.length ? updated : [''])
  }

  const handleNiceToHaveSkillChange = (index: number, value: string) => {
    const updated = [...niceToHaveSkills]
    updated[index] = value
    setNiceToHaveSkills(updated)
  }

  const handleAddNiceToHaveQualification = () => {
    setNiceToHaveQualifications([...niceToHaveQualifications, ''])
  }

  const handleRemoveNiceToHaveQualification = (index: number) => {
    const updated = niceToHaveQualifications.filter((_, i) => i !== index)
    setNiceToHaveQualifications(updated.length ? updated : [''])
  }

  const handleNiceToHaveQualificationChange = (index: number, value: string) => {
    const updated = [...niceToHaveQualifications]
    updated[index] = value
    setNiceToHaveQualifications(updated)
  }

  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, ''])
  }

  const handleRemoveResponsibility = (index: number) => {
    const updated = responsibilities.filter((_, i) => i !== index)
    setResponsibilities(updated.length ? updated : [''])
  }

  const handleResponsibilityChange = (index: number, value: string) => {
    const updated = [...responsibilities]
    updated[index] = value
    setResponsibilities(updated)
  }

  const onSubmit = async () => {
    try {
      // Get the form values
      const formValues = form.getValues()

      // Prepare the data with our simple state arrays
      const data: JobDescriptionFormValues = {
        position: formValues.position,
        experienceRequired: formValues.experienceRequired,
        requiredSkills: requiredSkills.filter(skill => skill.trim() !== ''),
        requiredQualifications: requiredQualifications.filter(q => q.trim() !== ''),
        niceToHaveSkills: niceToHaveSkills.filter(skill => skill.trim() !== ''),
        niceToHaveQualifications: niceToHaveQualifications.filter(q => q.trim() !== ''),
        responsibilities: responsibilities.filter(r => r.trim() !== ''),
      }

      // Validate the data
      const validationResult = JobDescriptionSchema.safeParse(data)

      if (!validationResult.success) {
        const issues = validationResult.error.issues
        issues.forEach(issue => {
          toast.error(issue.message)
        })
        return
      }

      setIsSubmitting(true)

      if (!userId) {
        toast.error('You must be logged in')
        return
      }

      const loadingToast = toast.loading('Updating job description...')

      const response = await apiClient.put(
        `/job-description/user/${userId}/job/${jobId}`,
        data
      )

      toast.dismiss(loadingToast)

      if (response.status === 200 || response.status === 201) {
        toast.success('Job description updated successfully!')
        onSuccess()
        onClose()
      }
    } catch (error: any) {
      toast.dismiss()

      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error('Invalid data provided.')
            break
          case 401:
            toast.error('Unauthorized.')
            break
          case 500:
            toast.error('Server error.')
            break
          default:
            toast.error('Something went wrong.')
        }
      } else {
        toast.error('Network error.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simple render functions for each array field
  const renderRequiredSkills = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">Required Skills *</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRequiredSkill}
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {requiredSkills.map((skill, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="e.g., React, TypeScript"
            value={skill}
            onChange={(e) => handleRequiredSkillChange(index, e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          {requiredSkills.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveRequiredSkill(index)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )

  const renderRequiredQualifications = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">Required Qualifications</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRequiredQualification}
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Qualification
        </Button>
      </div>

      {requiredQualifications.map((qualification, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="e.g., Bachelor's Degree"
            value={qualification}
            onChange={(e) => handleRequiredQualificationChange(index, e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          {requiredQualifications.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveRequiredQualification(index)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )

  const renderNiceToHaveSkills = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">Nice to Have Skills</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddNiceToHaveSkill}
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {niceToHaveSkills.map((skill, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="e.g., Docker"
            value={skill}
            onChange={(e) => handleNiceToHaveSkillChange(index, e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          {niceToHaveSkills.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveNiceToHaveSkill(index)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )

  const renderNiceToHaveQualifications = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">Nice to Have Qualifications</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddNiceToHaveQualification}
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Qualification
        </Button>
      </div>

      {niceToHaveQualifications.map((qualification, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="e.g., Master's Degree"
            value={qualification}
            onChange={(e) => handleNiceToHaveQualificationChange(index, e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          {niceToHaveQualifications.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveNiceToHaveQualification(index)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )

  const renderResponsibilities = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">Responsibilities *</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddResponsibility}
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Responsibility
        </Button>
      </div>

      {responsibilities.map((responsibility, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="e.g., Lead development team"
            value={responsibility}
            onChange={(e) => handleResponsibilityChange(index, e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          {responsibilities.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveResponsibility(index)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 p-8">
        <LuLoaderCircle className="animate-spin text-gray-500" />
        <span>Loading job description...</span>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Position */}
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                Position Title *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Senior Software Engineer"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experience */}
        <div className="space-y-3">
          <FormLabel className="text-base">
            Experience Required *
          </FormLabel>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="experienceRequired.minYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Years</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : 0
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceRequired.maxYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Years (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={50}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? parseInt(e.target.value)
                            : undefined
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {renderRequiredSkills()}
        {renderRequiredQualifications()}
        {renderNiceToHaveSkills()}
        {renderNiceToHaveQualifications()}
        {renderResponsibilities()}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Job Description'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditJobDescription