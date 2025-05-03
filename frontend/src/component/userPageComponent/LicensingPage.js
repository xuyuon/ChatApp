import {
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SettingsIcon from '@mui/icons-material/Settings';


import { styles } from "../../styling/userPage.styling";


const LicensingForm = (
  <Card sx={{ margin: "20px", padding: "20px" }}>
    <CardHeader
      title="Licensing Form"
    />
    <CardContent>
      <h2>Licensing Form</h2>
      <p>This is the licensing form content.</p>
    </CardContent>
  </Card>
)

const LicensingPage = () => {
  return (
    <Box>
      <Card sx={styles.card}>
        <CardHeader
          avatar={<DoneAllIcon sx={styles.icon} />}
          title="Licensing"
          sx={styles.cardHeader}
        />
        <CardContent>
          <Box sx={styles.cardContentContainer}>
          <Typography variant="h7">Please fill in your License Key:</Typography>
            <Box sx={styles.inputContainer}>
              <TextField
                label="License Key"
                size="small"
                variant="outlined"
                fullWidth
                sx={styles.textField}
              />
              <Button variant="contained" sx={styles.button}>
                Submit
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={styles.card}>
        <CardHeader
          avatar={<SettingsIcon sx={styles.icon} />}
          title="Profile Settings"
          sx={styles.cardHeader}
        />
        <CardContent>
          This is the profile settings content.
        </CardContent>
      </Card>
    </Box>
  );
}

export default LicensingPage;