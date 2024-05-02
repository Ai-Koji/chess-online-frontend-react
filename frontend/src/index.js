// index.js
import React, {lazy} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from 'react-dom'
import "./styles/main.css";


const Board = lazy(() => import("./component/board"));
const DebutBase = lazy(() => import("./component/debut-main.js"));
const Debut = lazy(() => import("./component/debut-page.js"));
const Forum = lazy(() => import("./component/forum-main.js"));
const ForumDiscussions = lazy(() => import("./component/forum-discussions"));
const ForumPage = lazy(() => import("./component/forum-discussion-page"));
const Login = lazy(() => import("./component/login"));
const Reg = lazy(() => import("./component/reg"));
const CreateTopic = lazy(() => import("./component/forum-create-discussion"));
const Library = lazy(() => import("./component/library-main.js"));
const Book = lazy(() => import("./component/library-book.js"));
const Lessons = lazy(() => import("./component/lessons-main.js"));
const Lesson = lazy(() => import("./component/lessons-page.js"));

const App = () => (
  <Routes>
    <Route path="/board/*" element={<Board />} /> {}
    <Route path="/beginner-lessons" element={<Lessons />} /> {}
    <Route path="/beginner-lessons/lesson/*" element={<Lesson />} /> {}
    <Route path="/debuts" element={<DebutBase />} /> {}
    <Route path="/debuts/debut/*" element={<Debut />} /> {}
    <Route path="/forum" element={<Forum />} /> {}
    <Route path="/forum/discussions/*" element={<ForumDiscussions />} /> {}
    <Route path="/forum/discussion/*" element={<ForumPage />} /> {}
    <Route path="/library" element={<Library />} /> {}
    <Route path="/library/book/*" element={<Book />} /> {}
    <Route path="/forum/forum-create-discussion/*" element={<CreateTopic />} /> {}
    <Route path="/auth/login" element={<Login />} /> {}
    <Route path="/auth/registration" element={<Reg />} /> {}
  </Routes>
);

let root = createRoot(document.getElementById('root'));
root.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
));
