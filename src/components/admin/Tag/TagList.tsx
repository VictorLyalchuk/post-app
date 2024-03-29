import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { APP_ENV } from '../../../env';
import axios from 'axios';
import { blue } from '@mui/material/colors';
import { Avatar, Container, Pagination, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ITagSearch } from '../../../interfaces/tag/ITagSearch';
import { IGetTags } from '../../../interfaces/tag/IGetTags';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blue[500],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,

  },
}));

const TagList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formParams, setFormParams] = useState<ITagSearch>({
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 10
  });

  const [data, setData] = useState<IGetTags>({
    content: [],
    totalPages: 0,
    totalCount: 0,
    number: 0
  });
  const { content, totalPages } = data;

  const loadTags = async () => {
    try {
      const resp = await axios.get(`${APP_ENV.BASE_URL}/api/tags/byPage`, {
        params: {
          ...formParams,
          page: formParams.page - 1
        }
      });
      setData(resp.data);
    } catch (error) {
      console.error("Error loading tags", error);
    }
  };

  const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    findTagss({ ...formParams, page });
  };
  const findTagss = (model: ITagSearch) => {
    setFormParams(model);
    updateSearchParams(model);
  }

  const updateSearchParams = (params: ITagSearch) => {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== 0) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    loadTags();
  }, [formParams]);

  const handleClose = () => {
    navigate('/');
  }

  const handleCreateTag = () => {
    navigate('/admin/tag/create');
  }

  const handleEdit = (id: number) => {
    navigate(`/admin/tag/edit/${id}`);
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await axios.delete(`${APP_ENV.BASE_URL}/api/tags/${id}`);
        setData({ ...data, content: content.filter(x => x.id != id) });
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Container >
        <Card sx={{ mb: 3, display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>

          <CardHeader title="Tags list" />
          <Divider />

          <TableContainer component={Paper} sx={{ borderRadius: 0 }} >
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">ID</StyledTableCell>
                  <StyledTableCell align="left">Name</StyledTableCell>
                  <StyledTableCell align="right">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {content.map((tag) => (
                  <StyledTableRow key={tag.name} sx={{ '&:hover': { bgcolor: '#bbdefb', }, }}>
                    <StyledTableCell align="left">
                      <Avatar aria-label="recipe" sx={{ bgcolor: blue[500], '&:hover': { bgcolor: 'white', color: 'black', }, }}>
                        {tag.id}
                      </Avatar></StyledTableCell>
                    <StyledTableCell align="left" component="th" scope="row">
                      {tag.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton edge="end" onClick={handleCreateTag} sx={{
                        '&:hover': {
                          color: 'white',
                        }, marginRight: '3px'
                      }}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                      <IconButton edge="end"
                        onClick={() => handleEdit(tag.id)}
                        sx={{
                          '&:hover': {
                            color: 'white',
                          }, marginRight: '3px'
                        }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDelete(tag.id)}
                        sx={{
                          '&:hover': {
                            color: 'white',
                          },
                        }}>
                        <DeleteOutlineIcon />
                      </IconButton>

                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


          {/* <Divider /> */}
          <CardActions sx={{ justifyContent: 'flex-end' }}>
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
        </Card>

        <Box display="flex" justifyContent="center" sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.default',
          gridTemplateColumns: { md: '1fr 1fr' },
          backgroundColor: "#eeeeee",

        }}>
          <Card variant="outlined" sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            gridTemplateColumns: { md: '1fr 1fr' },
            backgroundColor: "#eeeeee",

          }}>
            <Stack spacing={2}>
              <Pagination
                count={totalPages} page={formParams.page} onChange={handleChange} color="primary"
              />
            </Stack>
          </Card>


        </Box>
      </Container>
    </Box>
  );
}

export default TagList;