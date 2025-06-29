import ResumePreview from "../../../components/ResumePreview2"
import { useParams } from "react-router-dom"
import { useResume } from "../../../lib/hooks/useResumes"
import { convertResumeToFormValues } from "../../../lib/utils/resumeConverter"
import type { ResumeFormValues } from "./components/ResumeForm"
import { Alert, Box, CircularProgress } from "@mui/material"


const PreviewResume = () => {
    const { id } = useParams()
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

    console.log(formData)

    return <ResumePreview data={formData} theme={formData.theme} />
}
export default PreviewResume
