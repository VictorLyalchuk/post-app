import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import NotImage from '../../assets/imagenot.png'
import Typography from '@mui/material/Typography';
import { IPost } from '../../interfaces/Post/IPost';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import { red } from '@mui/material/colors';
import { APP_ENV } from "../../env";
import { Button, Divider, Rating } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePageCard: React.FC<{ post: IPost }> = ({ post }) => {
  const { id, title, category_name, dateCreated, description, files, tags } = post;
  const navigate = useNavigate();
  const [value, setValue] = useState<number | null>(0);
  const [isHovered, setIsHovered] = useState(false); 

  const handleDetails = () => {
    navigate(`/postDetails/${id}`)
  }
  const imageStyle = {
    transition: 'transform 0.3s', 
  };
  
  const imageHoverStyle = {
    transform: 'scale(1.1)', 
  };
  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Container >
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' } }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500], '&:hover': { bgcolor: '#bbdefb', }, }} aria-label="recipe">
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
            title={<Typography variant="h4">{title}</Typography>}
            subheader={new Date(dateCreated).toDateString()}
          />


          <CardActions>
            <Button size="small" color="primary" sx={{ fontWeight: 'bold' }}>
              {category_name}
            </Button>
          </CardActions>

          <ImageList cols={1}>
            <ImageListItem key={id} sx={{ padding: '0', display: 'flex', justifyContent: 'center',  overflow: 'hidden' }}>
              <img
                srcSet={files[0] ? `${APP_ENV.BASE_URL}/uploading/1200_${files[0]}` : NotImage}
                src={files[0] ? `${APP_ENV.BASE_URL}/uploading/1200_${files[0]}` : NotImage}
                alt={title}
                loading="lazy"
                style={{ ...imageStyle, ...(isHovered && imageHoverStyle) }} 
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
                                />
              <ImageListItemBar
                title={title}
                subtitle={new Date(dateCreated).toDateString()}
                actionIcon={
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`info about ${dateCreated}`}
                  >
                  </IconButton>
                }
              />
            </ImageListItem>
          </ImageList>


          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>

          <CardActions>
            {tags.map(tag => (
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

          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              color="inherit"
              size="small"
              variant="text"
              onClick={handleDetails}
              sx={{
                '&:hover': {
                  bgcolor: '#bbdefb', 
                  },}}
            >
              Details
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
}
export default HomePageCard;
