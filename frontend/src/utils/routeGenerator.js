// Dynamic Route Generator
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load all page components
const pageComponents = {
  Home: lazy(() => import('../pages/Home')),
  Login: lazy(() => import('../pages/Login')),
  Dashboard: lazy(() => import('../pages/Dashboard')),
  Admin: lazy(() => import('../pages/Admin')),
  AptitudeTest: lazy(() => import('../pages/AptitudeTest')),
  BinaryTree: lazy(() => import('../pages/BinaryTree')),
  BST: lazy(() => import('../pages/BST')),
  BinarySearch: lazy(() => import('../pages/BinarySearch')),
  StackQueue: lazy(() => import('../pages/StackQueue')),
  CNNVisualizer: lazy(() => import('../pages/CNNVisualizer')),
  Chatbot: lazy(() => import('../pages/Chatbot')),
  TypingSpeed: lazy(() => import('../pages/TypingSpeed')),
  ForgotPassword: lazy(() => import('../pages/ForgotPassword')),
  ResetPassword: lazy(() => import('../pages/ResetPassword')),
  CodingTest: lazy(() => import('../pages/CodingTest'))
};

export const generateRoutes = (routesConfig, user, setUser) => {
  return routesConfig.map((route) => {
    const Component = pageComponents[route.component];

    if (!Component) {
      console.warn(`Component ${route.component} not found`);
      return null;
    }

    // Handle protected routes
    if (route.protected && !user) {
      return {
        path: route.path,
        element: <Navigate to="/login" replace />
      };
    }

    // Handle admin-only routes
    if (route.adminOnly && (!user || user.role !== 'admin')) {
      return {
        path: route.path,
        element: <Navigate to="/login" replace />
      };
    }

    // Handle special props for specific components
    let element;
    if (route.component === 'Login') {
      element = <Component setUser={setUser} />;
    } else if (route.component === 'Dashboard') {
      element = <Component user={user} />;
    } else if (route.component === 'AptitudeTest') {
      element = <Component user={user} />;
    } else {
      element = <Component />;
    }

    return {
      path: route.path,
      element
    };
  }).filter(Boolean);
};
