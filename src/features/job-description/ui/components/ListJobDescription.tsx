'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api/axios'
import { JobDescriptionResponse } from '@/features/job-description/job-description.types'
import {
    Briefcase,
    Calendar,
    Code,
    Edit,
    FileText,
    GraduationCap,
    Plus,
    Target,
    Trash2
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaUsers } from 'react-icons/fa'
import { IoMdListBox } from 'react-icons/io'
import { LuLoaderCircle } from 'react-icons/lu'
import { PiMedalFill } from 'react-icons/pi'
import CreateJobDescription from './CreateJobDescription'
import EditJobDescription from './EditJobDescription'

const ListJobDescription = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const [data, setData] = useState<JobDescriptionResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [navigatingJobId, setNavigatingJobId] = useState<string | null>(null)

    const userId = session?.user?.id

    useEffect(() => {
        if (userId) {
            fetchJobDescriptions()
        }
    }, [userId])

    useEffect(() => {
        return () => {
            setNavigatingJobId(null)
        }
    }, [])

    const fetchJobDescriptions = async () => {
        if (!userId) return

        setLoading(true)
        setError(null)

        try {
            const response = await apiClient.get<JobDescriptionResponse>(
                `/job-description/user/${userId}?page=0&size=10`
            )
            setData(response.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch job descriptions')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedJobId || !userId) return

        setDeleteLoading(true)
        try {
            await apiClient.delete(`/job-description/user/${userId}/job/${selectedJobId}`)
            await fetchJobDescriptions()
            setDeleteDialogOpen(false)
            setSelectedJobId(null)
        } catch (err) {
            console.error('Delete failed:', err)
        } finally {
            setDeleteLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Unknown date'
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getInitials = (position: string) => {
        if (!position) return 'JD'
        return position
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const handleViewResumes = (jobId: string) => {
        setNavigatingJobId(jobId)
        router.push(`/dashboard/resumes/${jobId}`)
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 sm:px-6 py-20">
                {/* Header with Create Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">
                            Manage your job descriptions and track candidate matches
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreateDialogOpen(true)}
                        className="w-full sm:w-auto"
                        size="lg"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Job Description
                    </Button>
                </div>

                {loading ? (
                    <div className="space-y-8">
                        {/* Stats Skeletons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i} className="overflow-hidden">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-8 w-16 mb-2" />
                                        <Skeleton className="h-3 w-32" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Job List Skeletons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i} className="overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                                                <div className="space-y-2 min-w-0 flex-1">
                                                    <Skeleton className="h-5 w-40 max-w-full" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Skeleton className="h-8 w-8 rounded" />
                                                <Skeleton className="h-8 w-8 rounded" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : error ? (
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="pt-6">
                            <div className="text-center text-red-600">
                                <p className="text-lg font-semibold mb-2">Error Loading Dashboard</p>
                                <p className="text-sm">{error}</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={fetchJobDescriptions}
                                >
                                    Try Again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : !data || data.content.length === 0 ? (
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="pt-12 pb-12">
                            <div className="text-center space-y-4">
                                <div className="flex justify-center">
                                    <div className="bg-primary/10 p-4 rounded-full">
                                        <FileText className="h-12 w-12 text-primary" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold">No Job Descriptions Yet</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Create your first job description to start analyzing resumes and finding the best candidates.
                                </p>
                                <Button onClick={() => setCreateDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Job Description
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total JDs</CardTitle>
                                    <IoMdListBox size={24} className="text-orange-500 shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{data?.stats?.totalJDs}</div>
                                    <p className="text-xs text-muted-foreground truncate">
                                        Active job descriptions
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                                    <FaUsers size={24} className="text-sky-500 shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{data?.stats?.totalResumes}</div>
                                    <p className="text-xs text-muted-foreground truncate">
                                        Resumes analyzed
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Average Match</CardTitle>
                                    <Target size={24} className="text-green-500 shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{data?.stats?.averageScore}%</div>
                                    <Progress value={data?.stats?.averageScore} className="mt-2" />
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Strong Matches</CardTitle>
                                    <PiMedalFill size={24} className="text-yellow-500 shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{data?.stats?.strongMatches}</div>
                                    <p className="text-xs text-muted-foreground truncate">
                                        Candidates with {'>'}80% match
                                    </p>
                                </CardContent>
                            </Card>
                        </div> */}
                        

                        {/* Job Descriptions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data?.content?.map((job) => (
                                <Card key={job._id} className="hover:shadow-lg transition-shadow overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <Avatar className="h-10 w-10 bg-primary/10 shrink-0">
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {getInitials(job.position)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <CardTitle className="text-base sm:text-lg truncate">
                                                        {job.position}
                                                    </CardTitle>
                                                    <CardDescription className="flex items-center gap-2 mt-1">
                                                        <Calendar className="h-3 w-3 shrink-0" />
                                                        <span className="truncate text-xs sm:text-sm">
                                                            Created {formatDate(job.createdAt)}
                                                        </span>
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                        setSelectedJobId(job._id)
                                                        setEditDialogOpen(true)
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => {
                                                        setSelectedJobId(job._id)
                                                        setDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {/* Experience */}
                                        <div className="flex items-start gap-2 text-sm">
                                            <Briefcase className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground wrap-break-word">
                                                Experience: {job.experienceRequired.minYears}
                                                {job.experienceRequired.maxYears &&
                                                    ` - ${job.experienceRequired.maxYears}`} years
                                            </span>
                                        </div>

                                        {/* Required Skills */}
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Code className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span>Required Skills:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 ml-6">
                                                {job.requiredSkills.slice(0, 3).map((skill, index) => (
                                                    <Badge key={index} variant="secondary" className="max-w-full break-all">
                                                        <span className="truncate">{skill}</span>
                                                    </Badge>
                                                ))}
                                                {job.requiredSkills.length > 3 && (
                                                    <Badge variant="outline" className="shrink-0">
                                                        +{job.requiredSkills.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Qualifications (if any) */}
                                        {job.requiredQualifications && job.requiredQualifications.length > 0 && (
                                            <div className="flex items-start gap-2 text-sm">
                                                <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                                <div className="text-muted-foreground wrap-break-words">
                                                    <span className="font-medium text-foreground">Qualifications: </span>
                                                    {job.requiredQualifications.slice(0, 1).map((qual, i) => (
                                                        <span key={i}>
                                                            {qual}
                                                            {job.requiredQualifications && job.requiredQualifications.length > 1 && ' +more'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="border-t pt-4">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <span className="text-xs sm:text-sm text-muted-foreground">
                                                    Updated {formatDate(job.updatedAt)}
                                                </span>
                                            </div>
                                            <Button
                                                onClick={() => handleViewResumes(job._id)}
                                                className="w-full sm:w-auto cursor-pointer"
                                                disabled={navigatingJobId === job._id}
                                                size="sm"
                                            >
                                                {navigatingJobId === job._id ? (
                                                    <>
                                                        <LuLoaderCircle className="animate-spin mr-2" />
                                                        Loading...
                                                    </>
                                                ) : (
                                                    'View Resumes'
                                                )}
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create Dialog */}
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl">Create Job Description</DialogTitle>
                            <DialogDescription className="text-sm sm:text-base">
                                Fill in the details below to create a new job description.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateJobDescription
                            onClose={() => {
                                setCreateDialogOpen(false)
                            }}
                            onSuccess={() => fetchJobDescriptions()}
                        />
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl">Edit Job Description</DialogTitle>
                            <DialogDescription className="text-sm sm:text-base">
                                Update the job description details below.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedJobId && (
                            <EditJobDescription
                                jobId={selectedJobId}
                                onClose={() => {
                                    setEditDialogOpen(false)
                                    setSelectedJobId(null)
                                }}
                                onSuccess={() => {
                                    fetchJobDescriptions()
                                }}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="w-[95vw] max-w-lg p-4 sm:p-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-600 text-lg sm:text-xl">
                                <Trash2 className="h-5 w-5 shrink-0" />
                                Delete Job Description
                            </AlertDialogTitle>
                            <AlertDialogDescription asChild>
                                <div className="space-y-3 text-sm sm:text-base">
                                    <p className="font-medium text-foreground">
                                        This action cannot be undone.
                                    </p>
                                    <p>
                                        Deleting this job description will also permanently remove:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>All resumes analyzed for this position</li>
                                        <li>Candidate match scores and analysis results</li>
                                        <li>Statistics and insights associated with this JD</li>
                                    </ul>
                                    <p className="mt-4 font-medium">
                                        Are you sure you want to proceed?
                                    </p>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel
                                onClick={() => {
                                    setDeleteDialogOpen(false)
                                    setSelectedJobId(null)
                                }}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Permanently'
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default ListJobDescription