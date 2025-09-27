import React from "react";
import { useAppSelector } from "@/shared/hooks/rtkUser";
import { DocumentItem } from "@/entities/DocumentForm";
import { useGetDocumentsQuery } from "@/entities/DocumentForm/api/DocApi";
import { Box, Typography } from "@mui/material";

interface UserProfileProps {
  userId: number;
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { user } = useAppSelector((state) => state.user);
  const { data: documents, isLoading } = useGetDocumentsQuery();

  const userDocuments =
    documents?.filter((doc) => doc.user_id === user?.id) || [];

  if (isLoading) {
    return <Box sx={{ p: 2 }}>Загрузка документов...</Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Ваши документы
      </Typography>

      {userDocuments.map((doc) => (
        <DocumentItem key={doc.id} doc={doc} />
      ))}
    </Box>
  );
};

export default UserProfile;
