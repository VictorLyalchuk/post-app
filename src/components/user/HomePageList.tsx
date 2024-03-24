import { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import HomePageCard from './HomePageCard';
import axios from 'axios';
import { APP_ENV } from '../../env';
import { IPostSearch } from '../../interfaces/Post/IPostSearch';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IGetPosts } from '../../interfaces/Post/IGetPosts';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Box, Card, Container, Divider } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import { ITag } from '../../interfaces/Tag/ITag';
import { ICategory } from '../../interfaces/Category/ICategory';

const HomePageList = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState<ITag[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [formParams, setFormParams] = useState<IPostSearch>({
        tag: searchParams.get('tag') || "",
        category: searchParams.get('category') || "",
        page: Number(searchParams.get('page')) || 1,
        size: Number(searchParams.get('size')) || 5
    });

    const [data, setData] = useState<IGetPosts>({
        list: [],
        totalPages: 0,
        totalCount: 0,
        number: 0
    });
    const { list, totalCount } = data;

    useEffect(() => {
        load();
    }, []);
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
    const loadSearch = async () => {
        try {
            const resp = await axios.get(`${APP_ENV.BASE_URL}/api/posts/search`, {
                params: {
                    ...formParams,
                    page: formParams.page - 1
                }
            });
            setData(resp.data);
        } catch (error) {
            console.error("Error loading posts", error);
        }
    };

    useEffect(() => {
        loadSearch();
    }, [formParams]);

    useEffect(() => {
        const tag = searchParams.get('tag') || '';
        const category = searchParams.get('category') || '';
        const page = Number(searchParams.get('page')) || 1;
        const size = Number(searchParams.get('size')) || 5;
        setFormParams({ tag, category, page, size });
    }, [searchParams]);

    const handleChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        findPosts({ ...formParams, page });
    };
    const findPosts = (model: IPostSearch) => {
        setFormParams(model);
        updateSearchParams(model);
    }

    const updateSearchParams = (params: IPostSearch) => {
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== 0) {
                searchParams.set(key, value);
            } else {
                searchParams.delete(key);
            }
        }
        setSearchParams(searchParams);
    };

    const handleCategory = (category: ICategory) => {
        const page = 1;
        if (formParams.category === category.name) {
            findPosts({ ...formParams, category: "", page });
        }
        else {
            findPosts({ ...formParams, category: category.name, page });
        }
    };
    const handleTag = (tag: ITag) => {
        const page = 1;
        if (formParams.tag === tag.name) {
            findPosts({ ...formParams, tag: "", page });
        }
        else {
            findPosts({ ...formParams, tag: tag.name, page });
        }
    };
    const handleTagList = () => {
        navigate('/tag');
    }
    const handleCategoryList = () => {
        navigate('/category');
    }
    const handlePostList = () => {
        navigate('/post');
    }
    return (
        <>
            <Container maxWidth="lg"
            >
                <Grid container spacing={2}>
                    {/* Sidebar */}
                    <Grid item xs={12} sm={2} >
                        <Card sx={{ flexDirection: 'column', mt: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', mt: 1 }}>
                                <ListItemText primary="Tags"
                                    primaryTypographyProps={{
                                        variant: 'h5',
                                        style: { color: '#424242', paddingLeft: 10, }
                                    }}
                                />
                                <Divider />
                                {tags.map(tag => (
                                    <ListItem
                                        button
                                        key={tag.id}
                                        onClick={() => handleTag(tag)}
                                        selected={formParams.tag === tag.name}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: '#bbdefb',
                                            },
                                            "&.Mui-selected": {
                                                bgcolor: '#bbdefb',
                                                '& .MuiListItemText-secondary': {
                                                    fontWeight: 'bold',
                                                }
                                            }
                                        }}>
                                        <ListItemText secondary={tag.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                        <Card sx={{ flexDirection: 'column', mt: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', mt: 1 }}>
                            <ListItem
                                    button
                                    onClick={() => handlePostList()}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: '#bbdefb',
                                        },
                                        "&.Mui-selected": {
                                            bgcolor: '#bbdefb',
                                            '& .MuiListItemText-secondary': {
                                                fontWeight: 'bold',
                                            }
                                        }
                                    }}
                                >
                                    <ListItemText primary="Post Panel" />
                                </ListItem>
                                <ListItem
                                    button
                                    onClick={() => handleTagList()}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: '#bbdefb',
                                        },
                                        "&.Mui-selected": {
                                            bgcolor: '#bbdefb',
                                            '& .MuiListItemText-secondary': {
                                                fontWeight: 'bold',
                                            }
                                        }
                                    }}
                                >
                                    <ListItemText primary="Tag Panel" />
                                </ListItem>
                                <ListItem
                                    button
                                    onClick={() => handleCategoryList()}
                                    sx={{
                                        '&:hover': {
                                            bgcolor: '#bbdefb',
                                        },
                                        "&.Mui-selected": {
                                            bgcolor: '#bbdefb',
                                            '& .MuiListItemText-secondary': {
                                                fontWeight: 'bold',
                                            }
                                        }
                                    }}
                                >
                                    <ListItemText primary="Category Panel" />
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>


                    {/* Контент */}
                    <Grid item xs={12} sm={8}>
                        <Grid container spacing={2}>
                            {list.map(post => (
                                <Grid item key={post.id} xs={12} sm={12} md={12}>
                                    <HomePageCard key={post.id} post={post} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    {/* Sidebar */}
                    <Grid item xs={12} sm={2} >
                        <Card sx={{ flexDirection: 'column', mt: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', mt: 1 }}>
                                <ListItemText primary="Categories"
                                    primaryTypographyProps={{
                                        variant: 'h5',
                                        style: { color: '#424242', paddingLeft: 10, }
                                    }}
                                />
                                <Divider />
                                {categories.map(category => (
                                    <ListItem
                                        button
                                        key={category.id}
                                        onClick={() => handleCategory(category)}
                                        selected={formParams.category === category.name}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: '#bbdefb',
                                            },
                                            "&.Mui-selected": {
                                                bgcolor: '#bbdefb',
                                                '& .MuiListItemText-secondary': {
                                                    fontWeight: 'bold',
                                                }
                                            }
                                        }}
                                    >
                                        <ListItemText secondary={category.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Grid>

                </Grid>

                <Box mt={4} mb={4} display="flex" justifyContent="center">
                    <Divider />
                </Box>

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
                            <Pagination count={Math.ceil(totalCount / formParams.size)} page={formParams.page} onChange={handleChange} color="primary" />
                        </Stack>
                    </Card>
                </Box>
            </Container>

        </>
    );
};

export default HomePageList;