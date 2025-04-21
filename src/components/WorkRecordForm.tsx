import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, TimePicker, Input, Button, message } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { WorkRecord } from '@/types/WorkRecord';

interface WorkRecordFormProps {
  visible: boolean;
  initialData: WorkRecord | null;
  onCancel: () => void;
  onSubmit: (record: WorkRecord) => void;
}

const WorkRecordForm: React.FC<WorkRecordFormProps> = ({
  visible,
  initialData,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  
  // 编辑记录时设置适当的表单值
  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          startDate: dayjs(initialData.startDate),
          startTime: dayjs(initialData.startTime, 'HH:mm'),
          endDate: dayjs(initialData.endDate),
          endTime: dayjs(initialData.endTime, 'HH:mm'),
          description: initialData.description,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          startDate: dayjs(),
          endDate: dayjs(),
        });
      }
    }
  }, [visible, initialData, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const startDate = values.startDate.format('YYYY-MM-DD');
      const startTime = values.startTime.format('HH:mm');
      const endDate = values.endDate.format('YYYY-MM-DD');
      const endTime = values.endTime.format('HH:mm');
      
      // 计算工作时间
      const start = dayjs(`${startDate} ${startTime}`);
      const end = dayjs(`${endDate} ${endTime}`);
      const hours = end.diff(start, 'minute') / 60;
      
      if (hours < 0) {
        message.error(t('endTimeError'));
        return;
      }
      
      const newRecord: WorkRecord = {
        id: initialData ? initialData.id : Date.now().toString(),
        startDate,
        startTime,
        endDate,
        endTime,
        description: values.description,
        hours: parseFloat(hours.toFixed(1)),
      };
      
      onSubmit(newRecord);
    });
  };

  // 为DatePicker选择正确的区域设置

  return (
    <Modal
      title={initialData ? t('editRecord') : t('addRecord')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="startDate"
            label={t('startDate')}
            rules={[{ required: true, message: t('pleaseSelectStartDate') }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="startTime"
            label={t('startTime')}
            rules={[{ required: true, message: t('pleaseSelectStartTime') }]}
          >
            <TimePicker format="HH:mm" className="w-full" changeOnScroll needConfirm={false} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="endDate"
            label={t('endDate')}
            rules={[{ required: true, message: t('pleaseSelectEndDate') }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label={t('endTime')}
            rules={[{ required: true, message: t('pleaseSelectEndTime') }]}
          >
            <TimePicker format="HH:mm" className="w-full" changeOnScroll needConfirm={false} />
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
          <Button onClick={onCancel} className="rounded-button">
            {t('cancel')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-button"
          >
            {initialData ? t('save') : t('add')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default WorkRecordForm; 