import React, { useState, useEffect } from 'react';
import { Form, Input, Button, TimePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { TimeEntry } from '../types';
import { calculateDuration } from '../utils/timeUtils';

const { TextArea } = Input;

interface TimeEntryFormProps {
  onSubmit: (entry: TimeEntry) => void;
  initialValues?: TimeEntry | null;
  isMobile?: boolean;
}

interface FormValues {
  startTime: Dayjs;
  endTime: Dayjs;
  description: string;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ onSubmit, initialValues, isMobile = false }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [startDate] = useState<Date>(new Date());

  // Set form values when initialValues changes
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

  const handleSubmit = (values: FormValues) => {
    // Create date objects with current date but with hours and minutes from the selected times
    const startTime = new Date(startDate);
    startTime.setHours(values.startTime.hour());
    startTime.setMinutes(values.startTime.minute());
    startTime.setSeconds(0);
    
    const endTime = new Date(startDate);
    endTime.setHours(values.endTime.hour());
    endTime.setMinutes(values.endTime.minute());
    endTime.setSeconds(0);
    
    // If end time is earlier than start time, assume it's the next day
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
  };

  const format = 'HH:mm';
  
  const timeItemStyle = { 
    display: 'flex', 
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    alignItems: isMobile ? 'flex-start' as const : 'center' as const,
    marginBottom: isMobile ? 12 : 16
  };
  
  const labelStyle = { 
    width: isMobile ? '100%' : '80px', 
    textAlign: isMobile ? 'left' as const : 'right' as const, 
    marginRight: isMobile ? '0' : '12px',
    marginBottom: isMobile ? '4px' : '0', 
    flexShrink: 0 
  };

  return (
    <Form 
      form={form} 
      onFinish={handleSubmit} 
      layout={isMobile ? "vertical" : "horizontal"}
      size={isMobile ? "middle" : "large"}
    >
      <div style={timeItemStyle}>
        <div style={labelStyle}>{t('form.startTime')}</div>
        <Form.Item
          name="startTime"
          rules={[{ required: true, message: t('form.validation.startTimeRequired') }]}
          style={{ flex: 1, marginBottom: 0, width: isMobile ? '100%' : undefined }}
          colon={false}
        >
          <TimePicker 
            format={format} 
            placeholder={t('form.placeholder.startTime')} 
            style={{ width: '100%' }}
            minuteStep={5}
            size={isMobile ? "middle" : "large"}
          />
        </Form.Item>
      </div>
      
      <div style={timeItemStyle}>
        <div style={labelStyle}>{t('form.endTime')}</div>
        <Form.Item
          name="endTime"
          rules={[{ required: true, message: t('form.validation.endTimeRequired') }]}
          style={{ flex: 1, marginBottom: 0, width: isMobile ? '100%' : undefined }}
          colon={false}
        >
          <TimePicker 
            format={format} 
            placeholder={t('form.placeholder.endTime')} 
            style={{ width: '100%' }}
            minuteStep={5}
            size={isMobile ? "middle" : "large"}
          />
        </Form.Item>
      </div>
      
      <Form.Item
        label={t('form.description')}
        name="description"
        rules={[{ required: true, message: t('form.validation.descriptionRequired') }]}
        labelCol={isMobile ? { span: 24 } : { span: 4 }}
        wrapperCol={isMobile ? { span: 24 } : { span: 20 }}
      >
        <TextArea 
          rows={isMobile ? 3 : 4} 
          placeholder={t('form.placeholder.description')} 
        />
      </Form.Item>
      
      <Form.Item style={{ textAlign: isMobile ? 'center' as const : 'left' as const }}>
        <Button 
          type="primary" 
          htmlType="submit"
          size={isMobile ? "middle" : "large"}
          block={isMobile}
        >
          {initialValues ? t('form.updateButton') : t('form.saveButton')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TimeEntryForm; 