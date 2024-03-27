import { Route, Routes } from "react-router-dom"
import HomePageList from "./components/user/HomePageList"
import Header from "./components/header/Header"
import './App.css';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
import PostDetails from "./components/user/PostDetails";
import TagList from "./components/admin/Tag/TagList";
import CreateTag from "./components/admin/Tag/CreateTag";
import EditTag from "./components/admin/Tag/EditTag";
import CategoryList from "./components/admin/Category/CategoryList";
import CreateCategory from "./components/admin/Category/CreateCategory";
import EditCategory from "./components/admin/Category/EditCategory";
import PostList from "./components/admin/Post/PostList";
import CreatePost from "./components/admin/Post/CreatePost";
import EditPost from "./components/admin/Post/EditPost";


function App() {

  return (
    <>
      <ThemeProvider theme={theme}>

        <Header />
        <Routes>
          <Route path="/" element={<HomePageList />} />
          <Route path="postDetails/:id" element={<PostDetails />} />

          <Route path={"tag"}>
            <Route index element={<TagList />} />
            <Route path="create" element={<CreateTag />} />
            <Route path="edit/:id" element={<EditTag />} />
          </Route>

          <Route path={"category"}>
            <Route index element={<CategoryList />} />
            <Route path="create" element={<CreateCategory />} />
            <Route path="edit/:id" element={<EditCategory />} />
          </Route>

          <Route path={"post"}>
            <Route index element={<PostList />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="edit/:id" element={<EditPost />} />
          </Route>
        </Routes>
      </ThemeProvider>

    </>
  )
}

export default App
