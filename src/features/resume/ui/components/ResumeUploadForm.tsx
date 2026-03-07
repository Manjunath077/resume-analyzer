"use client";

import { useResumeUpload } from "@/features/resume/ui/hooks/useResumeUpload";
import { useParams } from "next/navigation";
import { useRef } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import {
  FiAward,
  FiCheckCircle,
  FiClock,
  FiFile,
  FiInfo,
  FiTrash2,
  FiUpload,
  FiUser,
} from "react-icons/fi";
import { LuLoaderCircle } from "react-icons/lu";

interface ResumeUploadFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ResumeUploadForm: React.FC<ResumeUploadFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const params = useParams();
  const jobId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    uploads,
    finalLoading,
    allUploaded,
    handleFilesSelected,
    updateCandidateName,
    uploadSingleFile,
    finalizeUploads,
    removeFile,
  } = useResumeUpload(jobId);

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;

    if (uploads.length + files.length > 10) {
      toast.error(
        `You can only upload up to 10 files. You already have ${uploads.length} selected.`,
        { duration: 5000 }
      );
      return;
    }

    handleFilesSelected(files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFinalSubmit = async () => {
    const loadingToast = toast.loading("Finalizing your uploads...");

    try {
      await finalizeUploads();
      toast.dismiss(loadingToast);
      toast.success("Resumes uploaded successfully!", { duration: 5000 });
      onClose();
      onSuccess();
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to finalize uploads.", { duration: 5000 });
    }
  };

  return (
    <div className="max-h-[90vh] p-2 overflow-auto space-y-4">
      {/* File Selection */}
      <div className="space-y-3 px-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="file-upload"
            className="text-lg font-semibold text-gray-700"
          >
            Select Resume Files
          </Label>

          {uploads.length > 0 && (
            <Badge variant="outline" className="px-3 py-1">
              {uploads.length}/10 files
            </Badge>
          )}
        </div>

        <Input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx"
          onChange={(e) =>
            e.target.files && handleFileSelection(e.target.files)
          }
          className="hidden"
        />

        <Label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center 
          border-2 border-dashed rounded-lg p-10 cursor-pointer 
          transition-colors ${uploads.length >= 10
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-blue-500"
            }`}
        >
          <FiUpload
            className={`w-8 h-8 mb-2 ${uploads.length >= 10 ? "text-gray-300" : "text-gray-400"
              }`}
          />
          <span
            className={`text-sm font-medium ${uploads.length >= 10 ? "text-gray-400" : "text-gray-500"
              }`}
          >
            {uploads.length >= 10
              ? "Maximum 10 files reached"
              : "Drag & drop files or click to browse"}
          </span>
        </Label>

        {/* Guidelines */}
        <Alert className="bg-amber-50 border-amber-200">
          <FiInfo className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Minimum 1 file</li>
              <li>Maximum 10 files</li>
              <li>Max size 5MB per file</li>
              <li>Supported formats: PDF, DOCX</li>
              <li>Enter candidate name before uploading</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      {/* Upload Progress Stats */}
      {uploads.length > 0 && (
        <div className="grid grid-cols-4 gap-3 p-2">
          {/* Total Files Card */}
          <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                <FiFile className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Total</p>
                <p className="text-xl font-bold text-blue-700">{uploads.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files Card */}
          <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                <FiCheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Uploaded</p>
                <p className="text-xl font-bold text-green-700">
                  {uploads.filter(u => u.status === "uploaded" || u.status === "completed").length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Files Card */}
          <Card className="bg-linear-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg shadow-sm">
                <FiClock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Pending</p>
                <p className="text-xl font-bold text-yellow-700">
                  {uploads.filter(u => u.status === "pending").length}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Completed Files Card */}
          <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                <FiAward className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Completed</p>
                <p className="text-xl font-bold text-purple-700">
                  {uploads.filter(u => u.status === "completed").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Files Grid - 2 Columns */}
      {uploads.length > 0 && (
        <div className="space-y-4 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploads.map((item, index) => (
              <Card
                key={index}
                className={`overflow-hidden border-l-4 transition-all hover:shadow-lg ${item.status === "completed"
                  ? "border-l-green-500 bg-green-50/30"
                  : item.status === "failed"
                    ? "border-l-red-500 bg-red-50/30"
                    : "border-l-blue-500"
                  }`}
              >
                <CardContent className="p-5 space-y-2">
                  {/* File Header with Remove Button */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FiFile className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate" title={item.file.name}>
                          {item.file.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "pending" && (
                        <button
                          onClick={() => removeFile(item.id)}
                          className="p-1 text-red-500 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Candidate Name Input */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <FiUser className="w-3 h-3" />
                      Candidate Name
                    </Label>
                    <Input
                      value={item.candidateName}
                      disabled={item.status !== "pending"}
                      onChange={(e) => updateCandidateName(item.id, e.target.value)}
                      placeholder="Enter candidate name"
                      className={`text-sm ${item.status !== "pending" ? "bg-gray-50" : ""}`}
                    />
                  </div>

                  {/* Error Message */}
                  {item.status === "failed" && (
                    <Alert className="bg-red-50 border-red-200 p-2">
                      <AlertDescription className="text-xs text-red-600">
                        Upload failed. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Upload Button */}
                  {item.status === "pending" && (
                    <Button
                      onClick={() => uploadSingleFile(item.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:scale-[1.02] cursor-pointer"
                      size="sm"
                      disabled={!item.candidateName?.trim()}
                    >
                      <FiUpload className="w-4 h-4 mr-2" />
                      Upload Resume
                    </Button>
                  )}

                  {item.status === "uploading" && (
                    <Button
                      disabled
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:scale-[1.02] cursor-pointer"
                      size="sm"
                    >
                      <LuLoaderCircle className="animate-spin mr-2" />
                      Uploading...
                    </Button>
                  )}

                  {item.status === "uploaded" && (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded-lg">
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Ready for final submission</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {uploads.length > 0 && (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            className="px-8 bg-green-600 hover:bg-green-700 text-white transition-all transform hover:scale-105"
            disabled={!allUploaded || finalLoading || uploads.length === 0}
            onClick={handleFinalSubmit}
          >
            {finalLoading ? (
              <>
                <LuLoaderCircle className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FiCheckCircle className="w-4 h-4 mr-2" />
                Final Submit ({uploads.filter(u => u.status === "uploaded").length} ready)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadForm;