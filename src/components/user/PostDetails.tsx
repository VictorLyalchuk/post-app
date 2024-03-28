import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { APP_ENV } from '../../env';
import { Avatar, Box, Card, Container, ImageList, List, Typography } from '@mui/material';
import { Divider } from '@material-ui/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IPost } from '../../interfaces/post/IPost';
import CardContent from '@mui/material/CardContent';
import ShareIcon from '@mui/icons-material/Share';
import { red } from '@mui/material/colors';
import { Button, Rating } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

const PostDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState<IPost | null>(null);
    const [value, setValue] = useState<number | null>(0);
    const dateCreated = post?.dateCreated || new Date();

    useEffect(() => {
        axios.get<IPost>(`${APP_ENV.BASE_URL}/api/posts/${id}`)
            .then(resp => {
                setPost(resp.data);
                console.log(resp.data)

            });
    }, [id]);
    const handleBack = () => {
        navigate("/")
    }
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
      setHoveredIndex(index);
    };
    
    const handleMouseLeave = () => {
      setHoveredIndex(null);
    };
    const imageStyle = {
        width: '100%',
        height: 'auto',
        overflow: 'hidden' ,

      };
    return (
        <Box sx={{ width: '100%', mt: 3 }}>
            <Container >
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>
                    <CardHeader title="Post" />
                    <Divider />
                    <List>
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: red[500],'&:hover': {bgcolor: '#bbdefb', }, }} aria-label="recipe" >
                                    {id}
                                </Avatar>
                            }
                            action={
                                <IconButton aria-label="share" sx={{
                                    '&:hover': {
                                      bgcolor: '#bbdefb', 
                                      },}}>
                                    <ShareIcon />
                                </IconButton>
                            }
                            title={<Typography variant="h4">{post?.title}</Typography>}
                            subheader={new Date(dateCreated).toDateString()}
                        />
                        <CardActions>
                            <Button size="small" color="primary" sx={{ fontWeight: 'bold' }}>
                                {post?.category_name}
                            </Button>
                        </CardActions>
                        {post?.files && post.files.length > 0 && (
                            <ImageList >
                                {post?.files.map((file, index) => (
                                    <ImageListItem key={index}>
                                        <img
                                            srcSet={`${APP_ENV.BASE_URL}/uploading/600_${file}`} alt={post?.title} 
                                            src={`${APP_ENV.BASE_URL}/uploading/600_${file}`}
                                            loading="lazy"
                                            style={{ ...imageStyle, opacity: hoveredIndex === index ? 0.9 : 1 }}
                                            onMouseEnter={() => handleMouseEnter(index)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                        <ImageListItemBar
                                            title={post.title}
                                            subtitle={post.title}
                                            actionIcon={
                                                <IconButton
                                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                    aria-label={`info about ${dateCreated}`}
                                                >
                                                </IconButton>
                                            }
                                        />
                                    </ImageListItem>

                                ))}
                            </ImageList>

                        )}

                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {post?.description}
                            </Typography>
                        </CardContent>

                        <CardActions>
                            {post?.tags.map(tag => (
                                <Button key={tag.id} size="small" color="primary" sx={{ fontWeight: 'bold' }}>
                                    {tag.name}
                                </Button>
                            ))}
                        </CardActions>

                        <CardActions disableSpacing>
                            <Rating
                                name="simple-controlled"
                                value={value}
                                onChange={(_event, newValue) => {
                                    setValue(newValue);
                                }}
                            />

                        </CardActions>
                    </List>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button
                            color="inherit"
                            size="small"
                            variant="text"
                            onClick={handleBack}
                            sx={{
                                '&:hover': {
                                  bgcolor: '#bbdefb', 
                                  },}}
                        >
                            View all
                        </Button>
                    </CardActions>
                </Card>
            </Container>
        </Box>
    );
}

export default PostDetails;