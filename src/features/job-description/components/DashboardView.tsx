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
import { JobDescriptionResponse } from '@/types/jod-description'
import {
    Award,
    Briefcase,
    Calendar,
    Code,
    Edit,
    FileText,
    GraduationCap,
    Plus,
    Target,
    Trash2,
    Users
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import CreateJobDescription from './CreateJobDescription'
import EditJobDescription from './EditJobDescription'

interface ExperienceRequired {
    minYears: number;
    maxYears?: number;
}

const DashboardView = () => {
    const { data: session } = useSession()
    const [data, setData] = useState<JobDescriptionResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const userId = session?.user?.id

    useEffect(() => {
        if (userId) {
            fetchJobDescriptions()
        }
    }, [userId])

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
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getInitials = (position: string) => {
        return position
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="space-y-6">
            {/* Header with Create Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Manage your job descriptions and track candidate matches
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job Description
                </Button>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {/* Stats Skeletons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-4 rounded-full" />
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
                            <Card key={i}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-40" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
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
                <Card className="border-red-200 bg-red-50">
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
                <Card className="border-dashed">
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
                <div>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total JDs</CardTitle>
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.stats?.totalJDs}</div>
                                <p className="text-xs text-muted-foreground">
                                    Active job descriptions
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.stats?.totalResumes}</div>
                                <p className="text-xs text-muted-foreground">
                                    Resumes analyzed
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Match</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.stats?.averageScore}%</div>
                                <Progress value={data?.stats?.averageScore} className="mt-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Strong Matches</CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data?.stats.strongMatches}</div>
                                <p className="text-xs text-muted-foreground">
                                    Candidates with {'>'}80% match
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Job Descriptions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data?.content?.map((job) => (
                            <Card key={job._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 bg-primary/10">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {getInitials(job.position)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-lg">{job.position}</CardTitle>
                                                <CardDescription className="flex items-center gap-2 mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Created {formatDate(job.createdAt)}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
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
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                                    <div className="flex items-center gap-2 text-sm">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            Experience: {job.experienceRequired.minYears}
                                            {job.experienceRequired.maxYears &&
                                                ` - ${job.experienceRequired.maxYears}`} years
                                        </span>
                                    </div>

                                    {/* Required Skills */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Code className="h-4 w-4 text-muted-foreground" />
                                            <span>Required Skills:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 ml-6">
                                            {job.requiredSkills.slice(0, 3).map((skill, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {job.requiredSkills.length > 3 && (
                                                <Badge variant="outline">+{job.requiredSkills.length - 3}</Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Qualifications (if any) */}
                                    {job.requiredQualifications && job.requiredQualifications.length > 0 && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <span className="font-medium">Qualifications: </span>
                                                {job.requiredQualifications.slice(0, 1).map((qual, i) => (
                                                    <span key={i} className="text-muted-foreground">
                                                        {qual}
                                                        {job.requiredQualifications && job.requiredQualifications.length > 1 && ' +more'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="border-t pt-4">
                                    <div className="flex items-center justify-between w-full text-sm">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span>Updated {formatDate(job.updatedAt)}</span>
                                        </div>
                                        <Badge variant="outline" className="ml-auto">
                                            ID: {job._id.slice(-6)}
                                        </Badge>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}



            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Job Description</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new job description.
                        </DialogDescription>
                    </DialogHeader>
                    <CreateJobDescription
                        onClose={() => {
                            setCreateDialogOpen(false)
                        }}
                        onSuccess={() =>
                            fetchJobDescriptions()
                        }
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Job Description</DialogTitle>
                        <DialogDescription>
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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" />
                            Delete Job Description
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                            <p className="font-medium text-foreground">
                                This action cannot be undone.
                            </p>
                            <p>
                                Deleting this job description will also permanently remove:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-sm">
                                <li>All resumes analyzed for this position</li>
                                <li>Candidate match scores and analysis results</li>
                                <li>Statistics and insights associated with this JD</li>
                            </ul>
                            <p className="mt-4 text-sm font-medium">
                                Are you sure you want to proceed?
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setDeleteDialogOpen(false)
                                setSelectedJobId(null)
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
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
    )
}

export default DashboardView