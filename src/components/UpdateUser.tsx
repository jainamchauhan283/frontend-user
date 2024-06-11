import { Box, Button, Card, TextField, Typography } from "@mui/material";

const UpdateUser: React.FC = () => {
  return (
    <Box
      sx={{
        m: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 400,
          boxShadow: 3,
          p: 2,
        }}
      >
        <Typography variant="h4" align="center">
          Update User
        </Typography>
        <TextField
          label="Username"
          type="text"
          autoComplete="userName"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mobile"
          type="number"
          autoComplete="mobile"
          fullWidth
          margin="normal"
        />
         <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            sx={{ width: "calc(50% - 8px)" }}
            color="error"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ width: "calc(50% - 8px)" }}
            color="primary"
          >
            Update
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default UpdateUser;
