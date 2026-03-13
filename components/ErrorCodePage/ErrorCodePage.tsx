import { ErrorCode } from "@/utils/types";
import { Box, Chip, Container, Divider, Typography } from "@mui/material";
import { CheckCircle, ErrorOutline, InfoOutlined } from "@mui/icons-material";


interface ErrorCodePageProps {
  errorCode: ErrorCode;
}

const ErrorCodePage = ({ errorCode }: ErrorCodePageProps) => {
  const typeParts = errorCode.type.split(".");
  const baseType = typeParts[0];
  const subType = typeParts.length > 1 ? typeParts.slice(1).join(".") : null;

  return (
    <Box sx={{justifyContent: "center", display: "flex", flexDirection: "column", gap: 3}}>
      <Box sx={{ mt: 4, px: 2, mx: 'auto', width: "100%", maxWidth: "800px", minHeight: "90vh", boxSizing: "border-box" }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: "error.main",
              color: "white",
              flexShrink: 0,
            }}
          >
            <ErrorOutline fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} lineHeight={1}>
              Error {errorCode.code}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {baseType}
              </Typography>
              {subType && (
                <>
                  <Typography variant="subtitle2" color="text.secondary">
                    /
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {subType}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Description */}
        <Box mb={3}>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <InfoOutlined fontSize="small" color="action" />
            <Typography variant="overline" color="text.secondary" lineHeight={1}>
              Description
            </Typography>
          </Box>
          <Typography variant="body1">{errorCode.description}</Typography>
        </Box>

        {/* Metadata chips */}
        <Box display="flex" flexWrap="wrap" gap={1.5}>
          {/* Retryable */}
          <Chip
            icon={errorCode.retryable ? <CheckCircle /> : <ErrorOutline />}
            label={errorCode.retryable ? "Retryable" : "Not Retryable"}
            color={errorCode.retryable ? "success" : "error"}
            variant="outlined"
            size="medium"
          />

          {/* Type */}
          <Chip
            label={`Type: ${errorCode.type}`}
            variant="outlined"
            size="medium"
          />

          {/* Client Exit Code */}
          <Chip
            label={`Client Exit Code: ${errorCode.clientExitCode}`}
            variant="outlined"
            size="medium"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ErrorCodePage;
