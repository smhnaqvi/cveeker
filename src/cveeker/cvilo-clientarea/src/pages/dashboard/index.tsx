import PageContent from '../../components/Page'
import MultiPageResumePreview from '../../components/MultiPageResumePreview';
import { useResume } from '../../lib/hooks/useResumes';
import type { ResumeFormValues } from './resume/components/ResumeForm';
import { convertResumeToFormValues } from "../../lib/utils/resumeConverter";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';




export default function Dashboard() {
  const { id } = useParams();
  const { data: response } = useResume(Number(id));
  const navigate = useNavigate();
  
  // Convert API response to form values
  const formData: ResumeFormValues | undefined = response?.data?.resume && convertResumeToFormValues(response?.data?.resume)

  if (!formData) {
    return <Stack gap={2} alignItems={"center"} justifyContent={"center"} height={"100%"}>
      <Typography variant="h4">Create New Resume</Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard/resume/create')}>Create New Resume</Button>
    </Stack>
  }

  return (
    <PageContent>
      {formData && <MultiPageResumePreview data={formData} />}
    </PageContent>
  )
} 