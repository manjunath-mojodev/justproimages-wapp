"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Toaster, toast } from "sonner";

interface BatchJobStatus {
  job_id: string;
  status: string;
  total_items: number;
  completed_items: number;
  failed_items: number;
  progress_percentage: number;
  zip_file_ready: boolean;
  zip_file_size?: number;
  errors?: string[];
}

interface BatchJobResponse {
  job_id: string;
  status: string;
  total_items: number;
  estimated_completion_time?: string;
}

const BulkCreatePage = () => {
  const [urls, setUrls] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobStatus, setJobStatus] = useState<BatchJobStatus | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // URL validation
  const validateUrls = useCallback(
    (urlText: string): { valid: string[]; invalid: string[] } => {
      const urlLines = urlText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const valid: string[] = [];
      const invalid: string[] = [];

      const urlRegex = /^https?:\/\/.+/i;

      urlLines.forEach((url) => {
        if (urlRegex.test(url)) {
          valid.push(url);
        } else {
          invalid.push(url);
        }
      });

      return { valid, invalid };
    },
    []
  );

  // Submit URLs for batch processing
  const handleSubmit = async () => {
    if (!urls.trim()) {
      toast.error("Please enter at least one URL");
      return;
    }

    const { valid, invalid } = validateUrls(urls);

    if (invalid.length > 0) {
      toast.error(`Invalid URLs detected: ${invalid.join(", ")}`);
      return;
    }

    if (valid.length === 0) {
      toast.error("No valid URLs found");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setJobStatus(null);
    setDownloadUrl(null);

    try {
      const response = await fetch("/api/bulk-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: valid,
          zip_filename: `bulk_qrcodes_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to start batch processing"
        );
      }

      const data: BatchJobResponse = await response.json();
      setJobStatus({
        job_id: data.job_id,
        status: data.status,
        total_items: data.total_items,
        completed_items: 0,
        failed_items: 0,
        progress_percentage: 0,
        zip_file_ready: false,
        errors: [],
      });

      // Start polling for status updates
      startPolling(data.job_id);

      toast.success(`Batch job started! Processing ${valid.length} URLs...`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  // Poll for job status updates
  const startPolling = useCallback(
    (jobId: string) => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/bulk-create/status/${jobId}`);

          if (!response.ok) {
            throw new Error("Failed to fetch job status");
          }

          const status: BatchJobStatus = await response.json();
          setJobStatus(status);

          if (
            status.status === "completed" ||
            status.status === "completed_with_errors"
          ) {
            setIsProcessing(false);
            clearInterval(pollInterval);

            if (status.zip_file_ready) {
              setDownloadUrl(`/api/bulk-create/download/${jobId}`);
              toast.success("Batch processing completed! Download is ready.");
            } else {
              toast.error(
                "Batch processing completed but zip file is not ready."
              );
            }
          } else if (status.status === "failed") {
            setIsProcessing(false);
            clearInterval(pollInterval);
            setError("Batch processing failed");
            toast.error("Batch processing failed");
          }
        } catch (err) {
          console.error("Error polling job status:", err);
          // Continue polling on error, but log it
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup polling after 5 minutes to prevent infinite polling
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isProcessing) {
          setIsProcessing(false);
          setError("Polling timeout - please check job status manually");
          toast.error("Polling timeout - please check job status manually");
        }
      }, 300000); // 5 minutes
    },
    [isProcessing]
  );

  // Download zip file
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `bulk_qrcodes_${jobStatus?.job_id || "unknown"}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Reset form
  const handleReset = () => {
    setUrls("");
    setIsProcessing(false);
    setJobStatus(null);
    setDownloadUrl(null);
    setError(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "completed_with_errors":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "completed_with_errors":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Bulk QR Code Generator
            </h1>
            <p className="text-xl text-muted-foreground">
              Generate multiple QR codes from URLs and download them as a zip
              file
            </p>
          </div>

          {/* Main Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Enter URLs
              </CardTitle>
              <CardDescription>
                Enter one URL per line. Each URL will be converted to a QR code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="https://example.com&#10;https://google.com&#10;https://github.com"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                rows={8}
                className="resize-none"
                disabled={isProcessing}
              />

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {
                    urls.split("\n").filter((line) => line.trim().length > 0)
                      .length
                  }{" "}
                  URLs entered
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isProcessing}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || !urls.trim()}
                    className="min-w-[120px]"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Generate QR Codes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          {jobStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(jobStatus.status)}
                  Job Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge
                    className={`${getStatusColor(jobStatus.status)} text-white`}
                  >
                    {jobStatus.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Job ID: {jobStatus.job_id}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{jobStatus.progress_percentage.toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={jobStatus.progress_percentage}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">
                      {jobStatus.total_items}
                    </div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {jobStatus.completed_items}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {jobStatus.failed_items}
                    </div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>

                {jobStatus.errors && jobStatus.errors.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="font-medium">Errors occurred:</div>
                        <ul className="list-disc list-inside text-sm">
                          {jobStatus.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {downloadUrl && (
                  <div className="pt-4 border-t">
                    <Button onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Zip File
                      {jobStatus.zip_file_size && (
                        <span className="ml-2 text-sm opacity-75">
                          ({(jobStatus.zip_file_size / 1024 / 1024).toFixed(1)}{" "}
                          MB)
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </main>

      <Toaster position="top-right" expand={true} richColors={true} />
    </div>
  );
};

export default BulkCreatePage;
