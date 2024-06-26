import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import { APP_ENV } from '../../../env';
import axios from 'axios';
import { Container, FormControl } from '@mui/material';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(2),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      '& .MuiInputBase-root': {
        height: '60px',
      },
      width: '30%',
    },
  }),
);

const CreateTag = () => {
  const navigate = useNavigate();
  const [tagName, setTagName] = useState('');
  const classes = useStyles();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', tagName);
    try {
      await axios.post(`${APP_ENV.BASE_URL}/api/tags`, formData);
      navigate('/admin/tag');
    } catch (error) {
      console.error("create tag error:", error);
    }
  };
  const handleClose = () => {
    navigate('/admin/tag');
  }


  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Container >
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>
          <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: 5 }}>
            <CardHeader title="Crete Tag" />
            <Divider />

            <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3 }}>
              <TextField
                label="Name"
                // variant="standard"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                required
                helperText="Please enter tag name."
              />
            </FormControl>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                color="inherit"
                endIcon={<FileDownloadDoneIcon />}
                size="small"
                type="submit"
                variant="text"
                sx={{
                  '&:hover': {
                    bgcolor: '#bbdefb',
                  },
                }}
              >
                Save
              </Button>
              <Button
                color="inherit"
                endIcon={<ClearIcon />}
                size="small"
                variant="text"
                onClick={handleClose}
                sx={{
                  '&:hover': {
                    bgcolor: '#bbdefb',
                  },
                }}
              >
                Close
              </Button>
            </CardActions>
          </form>
        </Card>
      </Container>
    </Box>
  );
}

export default CreateTag;