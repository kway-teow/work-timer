import { create } from 'zustand';
import { supabase } from '@/utils/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';

interface AuthState {
  // 认证状态
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // 认证方法
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ isConfirmEmailSent: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isInitialized: false,
  error: null,
  
  // 初始化认证状态
  initialize: async () => {
    // 如果已经初始化过，则不再重复初始化
    if (get().isInitialized) {
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // 获取当前会话
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      set({ 
        session, 
        user: session?.user || null,
        isLoading: false,
        isInitialized: true
      });
      
      // 监听认证状态变化
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          set({
            session,
            user: session?.user || null
          });
        }
      );
    } catch (error) {
      console.error('认证初始化错误:', error);
      set({ 
        isLoading: false,
        isInitialized: true,
        error: error instanceof AuthError ? error.message : '认证初始化错误' 
      });
    }
  },
  
  // 用户登录
  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // 检查邮箱是否已经确认
      if (data.user && !data.user.email_confirmed_at) {
        set({ 
          isLoading: false,
          error: '请先确认您的邮箱后再登录'
        });
        return;
      }
      
      set({ 
        session: data.session, 
        user: data.user,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('登录错误:', error);
      set({ 
        isLoading: false, 
        error: error instanceof AuthError ? error.message : '登录失败' 
      });
    }
  },
  
  // 用户注册
  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // 配置注册选项，要求邮箱确认
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // 如果注册成功但需要邮箱确认（大多数情况）
      const isConfirmEmailSent = !data.session;
      
      set({ 
        // 如果已经创建了会话（少数情况），则设置用户信息
        session: data.session, 
        user: data.user,
        isLoading: false,
        error: null
      });
      
      return { isConfirmEmailSent };
    } catch (error) {
      console.error('注册错误:', error);
      set({ 
        isLoading: false, 
        error: error instanceof AuthError ? error.message : '注册失败' 
      });
      return { isConfirmEmailSent: false };
    }
  },
  
  // 重新发送确认邮件
  resendConfirmationEmail: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('重发确认邮件错误:', error);
      set({ 
        isLoading: false, 
        error: error instanceof AuthError ? error.message : '重发确认邮件失败' 
      });
    }
  },
  
  // 用户登出
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      set({ 
        session: null, 
        user: null,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('登出错误:', error);
      set({ 
        isLoading: false, 
        error: error instanceof AuthError ? error.message : '登出失败' 
      });
    }
  },
  
  // 重置密码
  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      // TODO 改造为react-router-dom
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
      
      set({ isLoading: false, error: null });
    } catch (error) {
      console.error('重置密码错误:', error);
      set({ 
        isLoading: false, 
        error: error instanceof AuthError ? error.message : '重置密码失败' 
      });
    }
  }
})); 