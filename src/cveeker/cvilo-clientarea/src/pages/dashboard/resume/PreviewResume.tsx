import MultiPageResumePreview from "../../../components/MultiPageResumePreview"
import { useParams, useSearchParams } from "react-router-dom"
import { useResume } from "../../../lib/hooks/useResumes"
import { convertResumeToFormValues } from "../../../lib/utils/resumeConverter"
import type { ResumeFormValues } from "./components/ResumeForm"
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material"
import { Print } from "@mui/icons-material"
import { useRef, useState } from "react"
import { resumeService } from "../../../lib/services"
import { LoadingButton } from "@mui/lab"


const PreviewResume = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        await resumeService.downloadResumeAsPDF(Number(id)).finally(() => {
          setIsDownloading(false);
      });
    }

    const { id } = useParams()
    const previewRef = useRef<HTMLDivElement>(null)
    
    const [searchParams] = useSearchParams()
    const printMode = searchParams.get('print')
    
    const { data: response, isLoading, error } = useResume(Number(id))

    // Convert API response to form values
    const formData: ResumeFormValues | undefined = response?.data?.resume && convertResumeToFormValues(response?.data?.resume)

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box maxWidth={1200} mx="auto" mt={4}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error.message || 'Failed to load resume'}
                </Alert>
            </Box>
        );
    }

    if (!formData) {
        return (
            <Box maxWidth={1200} mx="auto" mt={4}>
                <Alert severity="warning">
                    Resume not found
                </Alert>
            </Box>
        );
    }

    if(printMode) {
        return (
            <div id="resume-preview">
                <MultiPageResumePreview data={formData} theme={formData.theme} printMode={true} />
            </div>
        )
    }

    return (
        <Box maxWidth={1200} mx="auto" mt={4} mb={8}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Resume Preview
                </Typography>
                <LoadingButton
                    variant="contained" 
                    loading={isDownloading}
                    loadingPosition="start"
                    disabled={isDownloading}
                    startIcon={<Print />}
                    onClick={handleDownloadPDF}
                >
                    Download Resume
                </LoadingButton>
            </Stack>
            
            <div id="resume-preview" ref={previewRef}>
                <MultiPageResumePreview data={formData} theme={formData.theme} printMode={false} />
            </div>
        </Box>
    )
}

export default PreviewResume
