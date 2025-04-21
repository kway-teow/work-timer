import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Form, Input, Button, TimePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { TimeEntry } from '@/types';
import { calculateDuration } from '@/utils/timeUtils';

const { TextArea } = Input;

interface TimeEntryFormProps {
  onSubmit: (entry: TimeEntry) => void;
  initialValues?: TimeEntry | null;
}

interface FormValues {
  startTime: Dayjs;
  endTime: Dayjs;
  description: string;
}

// 使用memo包装组件，减少不必要的重渲染
const TimeEntryForm: React.FC<TimeEntryFormProps> = memo(({ onSubmit, initialValues }) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [startDate] = useState<Date>(new Date());

  // 根据当前语言设置时间格式
  const format = useMemo(() => {
    return i18n.language === 'zh-CN' ? 'HH:mm' : 'h:mm A';
  }, [i18n.language]);

  // 当initialValues变化时设置表单值
  useEffect(() => {
    if (initialValues) {
      const startTime = dayjs(initialValues.startTime);
      const endTime = dayjs(initialValues.endTime);
      
      form.setFieldsValue({
        startTime,
        endTime,
        description: initialValues.description
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  // 当语言变化时重新设置form值，确保时间格式正确显示
  useEffect(() => {
    if (form.getFieldValue('startTime')) {
      const currentValues = form.getFieldsValue();
      form.setFieldsValue({
        ...currentValues
      });
    }
  }, [i18n.language, form]);

  // 使用useCallback优化表单提交函数
  const handleSubmit = useCallback((values: FormValues) => {
    // 创建日期对象，使用当前日期但采用所选时间的小时和分钟
    const startTime = new Date(startDate);
    startTime.setHours(values.startTime.hour());
    startTime.setMinutes(values.startTime.minute());
    startTime.setSeconds(0);
    
    const endTime = new Date(startDate);
    endTime.setHours(values.endTime.hour());
    endTime.setMinutes(values.endTime.minute());
    endTime.setSeconds(0);
    
    // 如果结束时间早于开始时间，则假定为第二天
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    const entry: TimeEntry = {
      id: initialValues ? initialValues.id : Date.now().toString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      description: values.description,
      duration: calculateDuration(startTime.toISOString(), endTime.toISOString())
    };
    
    onSubmit(entry);
  }, [initialValues, onSubmit, startDate]);

  return (
    <Form 
      form={form} 
      onFinish={handleSubmit} 
      layout="vertical"
      className="w-full"
      size="middle"
      rootClassName="md:text-base"
    >
      <div className="flex flex-col mb-3 md:mb-4">
        <div className="w-full font-medium mb-1">
          {t('form.startTime')}
        </div>
        <Form.Item
          name="startTime"
          rules={[{ required: true, message: t('form.validation.startTimeRequired') }]}
          className="mb-0 w-full"
          colon={false}
        >
          <TimePicker 
            format={format}
            placeholder={t('form.placeholder.startTime')} 
            className="w-full"
            minuteStep={5}
            size="middle"
            use12Hours={i18n.language !== 'zh-CN'}
            popupClassName="!z-[1100]"
            changeOnScroll
            needConfirm={false}
          />
        </Form.Item>
      </div>
      
      <div className="flex flex-col mb-3 md:mb-4">
        <div className="w-full font-medium mb-1">
          {t('form.endTime')}
        </div>
        <Form.Item
          name="endTime"
          rules={[{ required: true, message: t('form.validation.endTimeRequired') }]}
          className="mb-0 w-full"
          colon={false}
        >
          <TimePicker 
            format={format}
            placeholder={t('form.placeholder.endTime')} 
            className="w-full"
            minuteStep={5}
            size="middle"
            use12Hours={i18n.language !== 'zh-CN'}
            popupClassName="!z-[1100]"
            changeOnScroll
            needConfirm={false}
          />
        </Form.Item>
      </div>
      
      <Form.Item
        label={<span className="font-medium">{t('form.description')}</span>}
        name="description"
        rules={[{ required: true, message: t('form.validation.descriptionRequired') }]}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        className="mb-4"
      >
        <TextArea 
          rows={3} 
          placeholder={t('form.placeholder.description')} 
          className="resize-none"
        />
      </Form.Item>
      
      <Form.Item className="text-center md:text-left mb-0">
        <Button 
          type="primary" 
          htmlType="submit"
          size="middle"
          className="w-full md:w-auto px-6"
        >
          {initialValues ? t('form.updateButton') : t('form.saveButton')}
        </Button>
      </Form.Item>
    </Form>
  );
});

// 添加显示名称以方便调试
TimeEntryForm.displayName = 'TimeEntryForm';

export default TimeEntryForm; 