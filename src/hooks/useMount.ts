import { useEffect } from 'react';

/**
 * 自定义Hook：在组件挂载时执行一次回调函数
 * 
 * @param callback 在组件挂载时要执行的回调函数
 * 
 * @example
 * // 基本用法
 * useMount(() => {
 *   console.log('组件已挂载');
 *   // 执行初始化逻辑
 * });
 * 
 * @example
 * // 带有异步操作的用法
 * useMount(async () => {
 *   await fetchInitialData();
 *   // 其他初始化操作
 * });
 */
const useMount = (callback: () => void | Promise<void>): void => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useMount; 