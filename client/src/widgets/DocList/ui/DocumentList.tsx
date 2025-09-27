import { DocumentItem } from "@/entities/DocumentForm/ui/DocumentItem";
import { useGetDocumentsQuery } from "@/entities/DocumentForm/api/DocApi";

export function DocumentList(): JSX.Element {
  const { data: docs, isLoading, error } = useGetDocumentsQuery();

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  if (error) {
    return <div>Error loading documents</div>;
  }

  return (
    <div>
      {docs?.map((doc) => (
        <DocumentItem key={doc.id} doc={doc} />
      ))}
    </div>
  );
}
