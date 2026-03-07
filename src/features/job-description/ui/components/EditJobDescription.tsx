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
import React, { useEffect } from 'react'
import { useFieldArray, UseFieldArrayReturn, useForm } from 'react-hook-form'
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
type FieldArrayType = UseFieldArrayReturn<JobDescriptionFormValues>

const requiredFields: (keyof JobDescriptionFormValues)[] = [
  'position',
  'requiredSkills',
  'responsibilities',
]

const EditJobDescription: React.FC<EditJobDescriptionProps> = ({
  onClose,
  onSuccess,
  jobId,
}) => {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const form = useForm<JobDescriptionFormValues>({
    resolver: zodResolver(JobDescriptionSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      position: '',
      experienceRequired: { minYears: 0, maxYears: undefined },
      requiredSkills: [''],
      requiredQualifications: [''],
      niceToHaveSkills: [''],
      niceToHaveQualifications: [''],
      responsibilities: [''],
    },
  })

  const requiredSkillsField = useFieldArray({
    control: form.control,
    name: 'requiredSkills',
  })

  const requiredQualificationsField = useFieldArray({
    control: form.control,
    name: 'requiredQualifications',
  })

  const niceToHaveSkillsField = useFieldArray({
    control: form.control,
    name: 'niceToHaveSkills',
  })

  const niceToHaveQualificationsField = useFieldArray({
    control: form.control,
    name: 'niceToHaveQualifications',
  })

  const responsibilitiesField = useFieldArray({
    control: form.control,
    name: 'responsibilities',
  })

  useEffect(() => {
    if (!userId || !jobId) return

    const fetchData = async () => {
      try {
        const response = await apiClient.get<JobDescriptionDto>(
          `/job-description/user/${userId}/job/${jobId}`
        )

        const job = response.data

        form.reset({
          position: job.position,
          experienceRequired: job.experienceRequired,
          requiredSkills: job.requiredSkills?.length
            ? job.requiredSkills
            : [''],
          requiredQualifications: job.requiredQualifications?.length
            ? job.requiredQualifications
            : [''],
          niceToHaveSkills: job.niceToHaveSkills?.length
            ? job.niceToHaveSkills
            : [''],
          niceToHaveQualifications: job.niceToHaveQualifications?.length
            ? job.niceToHaveQualifications
            : [''],
          responsibilities: job.responsibilities?.length
            ? job.responsibilities
            : [''],
        })
      } catch {
        toast.error('Failed to load job description')
        onClose()
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [jobId, userId])

  const onSubmit = async (data: JobDescriptionFormValues) => {
    try {
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
    } catch {
      toast.dismiss()
      toast.error('Something went wrong while updating.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderFieldArray = (
    fieldArray: FieldArrayType,
    fieldName: keyof JobDescriptionFormValues,
    label: string,
    placeholder: string
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base">
          {label}
          {requiredFields.includes(fieldName) && ' *'}
        </FormLabel>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fieldArray.append('' as any)}
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {fieldArray.fields.map((field, index) => (
        <FormField
          key={field.id}
          control={form.control}
          name={`${fieldName}.${index}`}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>

                {fieldArray.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fieldArray.remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      {/* Array-level error */}
      {form.formState.errors[fieldName] &&
        typeof form.formState.errors[fieldName]?.message === 'string' && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors[fieldName]?.message as string}
          </p>
        )}
    </div>
  )

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 p-8">
          <LuLoaderCircle className="animate-spin text-gray-500" />
          Loading job description...
        </div>
      ) : (
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {renderFieldArray(requiredSkillsField, 'requiredSkills', 'Required Skills', 'e.g., React')}
            {renderFieldArray(requiredQualificationsField, 'requiredQualifications', 'Required Qualifications', "e.g., Bachelor's Degree")}
            {renderFieldArray(niceToHaveSkillsField, 'niceToHaveSkills', 'Nice to Have Skills', 'e.g., Docker')}
            {renderFieldArray(niceToHaveQualificationsField, 'niceToHaveQualifications', 'Nice to Have Qualifications', "e.g., Master's Degree")}
            {renderFieldArray(responsibilitiesField, 'responsibilities', 'Responsibilities', 'e.g., Lead development team')}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? 'Updating...' : 'Update Job Description'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  )
}

export default EditJobDescription