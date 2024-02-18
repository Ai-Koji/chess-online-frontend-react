// index.js
import React, {lazy} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from 'react-dom'
import "./styles/main.css";


const Board = lazy(() => import("./component/board"));
const DebutBase = lazy(() => import("./component/debut-base"));
const Debut = lazy(() => import("./component/debut"));
const BeginBase = lazy(() => import("./component/begin-base"));
const Forum = lazy(() => import("./component/forum"));
const ForumDiscussions = lazy(() => import("./component/forum-discussions"));
const ForumPage = lazy(() => import("./component/forum-discussion-page"));
const Login = lazy(() => import("./component/login"));
const Reg = lazy(() => import("./component/reg"));
const CreateTopic = lazy(() => import("./component/forum-create-discussion"));

const App = () => (
  <Routes>
    <Route path="/board" element={<Board />} /> {}
    <Route path="/debut-base" element={<DebutBase />} /> {}
    <Route path="/debut-base/debut" element={<Debut />} /> {}
    <Route path="/begin-base" element={<BeginBase />} /> {}
    <Route path="/forum" element={<Forum />} /> {}
    <Route path="/forum/discussions/*" element={<ForumDiscussions />} /> {}
    <Route path="/forum/discussion/*" element={<ForumPage />} /> {}
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
