import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

export interface AuthTokenState {
  token: string | null;
  userId: string | null;
}

const initialState: AuthTokenState = {
  token: null,
  userId: null,
};

const authTokenSlice = createSlice({
  name: 'authToken',
  initialState,
  reducers: {
    setToken(state, action) {
      const token = action.payload;
      const decode = jwtDecode(token) as {
        id: string;
        iat: number;
        exp: number;
      };

      const id = decode.id;

      state.token = token;
      state.userId = id;
    },

    removeToken(state) {
      state.token = null;
      state.userId = null;
    },
  },
});

export const authTokenActions = authTokenSlice.actions;

export default authTokenSlice;
