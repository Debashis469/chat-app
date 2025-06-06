// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { fetchUser } from "./store/userSlice";
import { fetchChats } from "./store/chatSlice";

function App() {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { loading: chatLoading } = useSelector((state) => state.chats);

  // Fetch user details on app load if token exists
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  // Fetch chats if user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchChats());
    }
  }, [user, dispatch]);

  // Loading state component
  const LoadingScreen = () => <div>Loading...</div>;

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (userLoading) return <LoadingScreen />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {chatLoading ? <LoadingScreen /> : <Home />}
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
      </Routes>
    </Router>
  );
}

export default App;
