import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/IngredientsSlice';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate
} from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import ProtectedRoute from '../protectedRoute/protectedRoute';
import { fetchUser } from '../../services/slices/authSlice';
import { Preloader } from '../ui/preloader';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    dispatch(fetchIngredients());
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      dispatch(fetchUser())
        .then(() => {
          // Успешный автологин, можно выполнить дополнительные действия, если нужно
        })
        .catch((error) => {
          // Ошибка при автологине, обработка ошибки
        });
    }
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1); // Возвращает на предыдущую страницу
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {isLoading ? (
        <Preloader /> // Показываем прелоадер при загрузке
      ) : (
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/login'
            element={
              <ProtectedRoute anonymous>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='/register'
            element={
              <ProtectedRoute anonymous>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute anonymous>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute anonymous>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
