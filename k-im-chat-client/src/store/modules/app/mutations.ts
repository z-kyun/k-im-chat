import { SET_USER, CLEAR_USER, SET_TOKEN, SET_LOADING } from './mutation-types';
import { AppState } from './state';
import cookie from 'js-cookie';
import { MutationTree } from 'vuex';
import { User } from '/@/types/user';

import store from '/@/store'


const mutations: MutationTree<AppState> = {
  [SET_LOADING](state, payload) {
    state.loading = payload;
  },

  [SET_TOKEN](state, payload) {
    state.token = payload;
    cookie.set('token', payload, { expires: 3 });
  },

  [SET_USER](state, payload: User) {
    if (payload && payload.avatar) {
      payload.avatar = `${import.meta.env.VITE_APP_OSS_URL}/${payload.avatar}`
    }
    state.user = payload;
    // 数据持久化
    cookie.set('user', payload, { expires: 3650 });
    if (payload.id) {
      // 连接socket
      store.dispatch('chat/connectSocket')
    }
  },

  [CLEAR_USER](state) {
    state.user = {
      id: '',
      username: '',
      avatar: '',
      createAt: '',
      version: '',
    };
    cookie.set('user', '');
  },
};

export default mutations;
