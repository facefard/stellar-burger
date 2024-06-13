import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';

type TProtectedRoute = {
  children: JSX.Element;
  anonymous?: boolean;
};

const ProtectedRoute: FC<TProtectedRoute> = ({
  children,
  anonymous = false
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Если разрешен неавторизованный доступ, а пользователь авторизован...
  if (anonymous && isAuthenticated) {
    // ...то отправляем его на предыдущую страницу
    return <Navigate to={from} />;
  }

  // Если требуется авторизация, а пользователь не авторизован...
  if (!anonymous && !isAuthenticated) {
    // ...то отправляем его на страницу логин
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  // Если все ок, то рендерим внутреннее содержимое
  return children;
};

export default ProtectedRoute;
