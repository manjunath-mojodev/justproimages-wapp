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
import { toast } from "sonner";

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

  const pollJobStatus = useCallback(async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/bulk-create/status/${jobId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const status: BatchJobStatus = await response.json();
        setJobStatus(status);

        if (status.status === "completed") {
          clearInterval(pollInterval);
          if (status.zip_file_ready) {
            setDownloadUrl(`/api/bulk-create/download/${jobId}`);
            toast.success(
              "Batch job completed! Your QR codes are ready for download."
            );
          }
        } else if (status.status === "failed") {
          clearInterval(pollInterval);
          toast.error("Batch job failed. Please try again.");
        }
      } catch (err) {
        console.error("Error polling job status:", err);
        clearInterval(pollInterval);
        toast.error("Error checking job status");
      }
    }, 2000); // Poll every 2 seconds
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!urls.trim()) {
      toast.error("Please enter at least one URL");
      return;
    }

    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urlList.length === 0) {
      toast.error("Please enter at least one valid URL");
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
        body: JSON.stringify({ urls: urlList }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      });

      toast.success(
        `Batch job started! Processing ${data.total_items} URLs. Job ID: ${data.job_id}`
      );

      // Start polling for status
      pollJobStatus(data.job_id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(`Failed to start batch job: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  }, [urls, pollJobStatus]);

  const handleDownload = useCallback(() => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  }, [downloadUrl]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
          <p className="text-muted-foreground">
            Generate multiple QR codes at once by providing a list of URLs. Each
            URL will be converted into a QR code and packaged into a
            downloadable ZIP file.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Enter URLs
              </CardTitle>
              <CardDescription>
                Enter one URL per line. You can paste multiple URLs at once.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="https://example.com&#10;https://another-site.com&#10;https://third-website.com"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                rows={12}
                className="mb-4 min-h-[300px] resize-y"
              />
              <Button
                onClick={handleSubmit}
                disabled={isProcessing || !urls.trim()}
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Generate QR Codes"}
              </Button>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Job Status */}
          {jobStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(jobStatus.status)}
                  Job Status
                </CardTitle>
                <CardDescription>Job ID: {jobStatus.job_id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className={getStatusColor(jobStatus.status)}>
                      {jobStatus.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{jobStatus.progress_percentage}%</span>
                    </div>
                    <Progress value={jobStatus.progress_percentage} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <div className="font-medium">{jobStatus.total_items}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completed:</span>
                      <div className="font-medium text-green-600">
                        {jobStatus.completed_items}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Failed:</span>
                      <div className="font-medium text-red-600">
                        {jobStatus.failed_items}
                      </div>
                    </div>
                  </div>

                  {jobStatus.zip_file_ready && (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={handleDownload}
                        className="w-full"
                        size="lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download QR Codes (
                        {jobStatus.zip_file_size
                          ? `${(jobStatus.zip_file_size / 1024 / 1024).toFixed(
                              2
                            )} MB`
                          : "Ready"}
                        )
                      </Button>
                    </div>
                  )}

                  {jobStatus.errors && jobStatus.errors.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2 text-red-600">
                        Errors:
                      </h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        {jobStatus.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkCreatePage;
