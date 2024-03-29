import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import { APP_ENV } from '../../../env';
import axios from 'axios';
import { Checkbox, Container, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import TextField from '@mui/material/TextField';
import { useNavigate, useParams } from 'react-router-dom';
import { ICategory } from '../../../interfaces/category/ICategory';
import { ITag } from '../../../interfaces/tag/ITag';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, UploadProps } from 'antd';
import { UploadFile } from 'antd/es/upload';
import { IPostEdit, IPostEditPhoto } from '../../../interfaces/post/IPostEdit';



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

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [tags, setTags] = useState<ITag[]>([]);
    const [title, setTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [postShortDescription, setPostShortDescription] = useState('');
    const [postCategory, setPostCategory] = useState('');
    const [postTag, setPostTag] = useState<number[]>([]);
    const [imagesString, setImagesString] = useState<string[]>([]);

    const [files, setFiles] = useState<UploadFile[]>([]);
    const classes = useStyles();

    useEffect(() => {
        axios.get(`${APP_ENV.BASE_URL}/api/posts/${id}`)
        .then(resp => {
            setTitle(resp.data.title);
            setPostDescription(resp.data.description);
            setPostShortDescription(resp.data.shortDescription);
            setPostCategory(resp.data.category_id);
            const tagIds = resp.data.tags.map((tag: { id: number; }) => tag.id);
            setPostTag(tagIds);
            setImagesString(resp.data.files);
        });
    }, [id]);
    
    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        setDefaultData();
    }, [imagesString]);
    const load = async () => {
        try {
            const resp = await axios.get(`${APP_ENV.BASE_URL}/api/tags`,);
            setTags(resp.data);
        } catch (error) {
            console.error("Error loading tags", error);
        }
        try {
            const resp2 = await axios.get(`${APP_ENV.BASE_URL}/api/categories`,);
            setCategories(resp2.data);
        } catch (error) {
            console.error("Error loading categories", error);
        }

    };

    const setDefaultData = () => {
        if (imagesString) {
            if (imagesString?.length) {
                setFiles([]);
            }
            const newFileList: UploadFile[] = [];
            for (let i = 0; i < imagesString.length; i++) {
                newFileList.push({
                    uid: imagesString[i],
                    name: imagesString[i],
                    status: 'done',
                    url: `${APP_ENV.BASE_URL}/uploading/1200_${imagesString[i]}`,
                });
            }
            setFiles(newFileList);
        }
    };
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!id) {
            return;
        }

        const oldPhotos: IPostEditPhoto[] = [];
        const newPhotos: IPostEditPhoto[] = [];

        for (let i = 0; i < files.length; i++) {
            if (!files[i].size) {
                oldPhotos.push({ name: files[i].name });
            }
            else {
                const base64Content = files[i].thumbUrl?.split(",")[1];
                newPhotos.push({ name: base64Content });
            }
        }

        const model: IPostEdit = {
            id: id,
            title: title,
            description: postDescription,
            shortDescription: postShortDescription,
            category_id: postCategory,
            tags: postTag,
            newPhotos: newPhotos, 
            oldPhotos: oldPhotos
        }
        console.log(model);

        try {
            await axios.put<IPostEdit>(`${APP_ENV.BASE_URL}/api/posts`, model, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            navigate('/admin/post');
        } catch (error) {
            console.error("create post error:", error);
        }
    };
    const handleClose = () => {
        navigate('/admin/post');
    }

    const handleTagChange = (selectedValues: number[]) => {
        setPostTag(selectedValues);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFiles(newFileList);
    };

    return (
        <Box sx={{ width: '100%', mt: 3 }}>
            <Container >
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>
                    <form onSubmit={handleSubmit} style={{ textAlign: 'center', padding: 5 }}>
                        <CardHeader title="Edit Post" />
                        <Divider />
                        <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3, flex: 1, mr: 2 }}>
                            <TextField
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                helperText="Please enter title."
                            />
                        </FormControl>
                        <br />
                        <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3, flex: 1, mr: 2 }}>
                            <TextField
                                label="Description"
                                value={postDescription}
                                onChange={(e) => setPostDescription(e.target.value)}
                                required
                                multiline
                                rows={4}
                                InputProps={{
                                    style: { height: '100px' },
                                }}
                                helperText="Please enter post description."
                            />
                        </FormControl>
                        <br />

                        <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3, flex: 1, mr: 2 }}>
                            <TextField
                                label="Short Description"
                                value={postShortDescription}
                                onChange={(e) => setPostShortDescription(e.target.value)}
                                required
                                helperText="Please enter post short description."
                            />
                        </FormControl>
                        <br />


                        <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3, flex: 1, mr: 2 }}>
                            <Upload
                                showUploadList={{ showPreviewIcon: false }}
                                beforeUpload={() => false}
                                accept="image/*"
                                listType="picture-card"
                                onChange={handleChange}
                                fileList={files}

                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </FormControl>


                        <br />

                        <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3, flex: 1, mr: 2 }}>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                value={postCategory}
                                onChange={(e) => setPostCategory(e.target.value)}
                                required
                                label="Category"
                                sx={{ textAlign: 'left' }}
                            >
                                {categories.map(category => (
                                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <br />

                        <FormControl className={classes.textField} variant="outlined" sx={{ mt: 3, flex: 1, mr: 2, mb: 3 }}>
                            <InputLabel id="tag-label">Tag</InputLabel>
                            <Select
                                labelId="tag-label"
                                id="tag"
                                value={postTag}
                                onChange={(e) => handleTagChange(e.target.value as number[])}
                                multiple
                                required
                                sx={{ textAlign: 'left' }}
                            >
                                {tags.map(tag => (
                                    <MenuItem key={tag.id} value={tag.id}>
                                        <Checkbox checked={postTag.includes(tag.id)} />
                                        {tag.name}
                                    </MenuItem>
                                ))}
                            </Select>
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

export default EditPost;