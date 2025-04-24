import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, TimePicker, Input, Button, message, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { WorkRecord, NewWorkRecord } from '@/types/WorkRecord';

interface WorkRecordFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: WorkRecord | NewWorkRecord) => void;
  initialValues?: WorkRecord;
  isEdit?: boolean;
  loading?: boolean;
}

const WorkRecordForm: React.FC<WorkRecordFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isEdit = false,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (initialValues && open) {
      form.setFieldsValue({
        date: dayjs(initialValues.startDate),
        startTime: dayjs(`${initialValues.startDate} ${initialValues.startTime}`),
        endTime: dayjs(`${initialValues.endDate} ${initialValues.endTime}`),
        description: initialValues.description,
      });
    } else if (open) {
      form.resetFields();
      // 默认设置今天的日期
      form.setFieldsValue({
        date: dayjs(),
      });
    }
  }, [initialValues, open, form]);

  // 骨架屏组件
  if (loading) {
    return (
      <Modal
        title={isEdit ? t('editRecord') : t('addRecord')}
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnClose
      >
        <div className="p-4">
          <Skeleton active paragraph={{ rows: 4 }} />
          <div className="flex justify-end mt-6">
            <Skeleton.Button active className="mr-2" />
            <Skeleton.Button active />
          </div>
        </div>
      </Modal>
    );
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const startDate = values.date.format('YYYY-MM-DD');
      const startTime = values.startTime.format('HH:mm');
      const endDate = values.date.format('YYYY-MM-DD');
      const endTime = values.endTime.format('HH:mm');
      
      // 计算工作时间
      const start = dayjs(`${startDate} ${startTime}`);
      const end = dayjs(`${endDate} ${endTime}`);
      const hours = end.diff(start, 'minute') / 60;
      
      if (hours < 0) {
        message.error(t('endTimeError'));
        return;
      }
      
      // 基础记录数据
      const recordData: NewWorkRecord = {
        startDate,
        startTime,
        endDate,
        endTime,
        description: values.description,
        hours: parseFloat(hours.toFixed(1)),
      };
      
      // 如果是编辑现有记录，添加 id
      if (initialValues) {
        const existingRecord: WorkRecord = {
          ...recordData,
          id: initialValues.id
        };
        onSubmit(existingRecord);
      } else {
        // 创建新记录，不需要 id
        onSubmit(recordData);
      }
    });
  };

  return (
    <Modal
      title={isEdit ? t('editRecord') : t('addRecord')}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 gap-3 mb-3">
          <Form.Item
            name="date"
            label={t('date')}
            rules={[{ required: true, message: t('pleaseSelectDate') }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="startTime"
            label={t('startTime')}
            rules={[{ required: true, message: t('pleaseSelectStartTime') }]}
          >
            <TimePicker 
              format="HH:mm" 
              className="w-full" 
              changeOnScroll 
              needConfirm={false} 
              minuteStep={5}
            />
          </Form.Item>
          <Form.Item
            name="endTime"
            label={t('endTime')}
            rules={[{ required: true, message: t('pleaseSelectEndTime') }]}
          >
            <TimePicker 
              format="HH:mm" 
              className="w-full" 
              changeOnScroll 
              needConfirm={false} 
              minuteStep={5}
            />
          </Form.Item>
        </div>
        <Form.Item
          name="description"
          label={t('workContent')}
          rules={[{ required: true, message: t('pleaseEnterWorkContent') }]}
        >
          <Input.TextArea rows={4} placeholder={t('workContentPlaceholder')} />
        </Form.Item>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} className="rounded-button">
            {t('cancel')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-button"
          >
            {isEdit ? t('save') : t('add')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default WorkRecordForm; 