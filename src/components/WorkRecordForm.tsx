import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, TimePicker, Input, Button, message } from 'antd';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { useTranslation } from 'react-i18next';
import { WorkRecord } from '../types/WorkRecord';

interface WorkRecordFormProps {
  visible: boolean;
  editingRecord: WorkRecord | null;
  onCancel: () => void;
  onSubmit: (record: WorkRecord) => void;
}

const WorkRecordForm: React.FC<WorkRecordFormProps> = ({
  visible,
  editingRecord,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  
  // Set appropriate form values when editing a record
  useEffect(() => {
    if (visible) {
      if (editingRecord) {
        form.setFieldsValue({
          startDate: dayjs(editingRecord.startDate),
          startTime: dayjs(editingRecord.startTime, 'HH:mm'),
          endDate: dayjs(editingRecord.endDate),
          endTime: dayjs(editingRecord.endTime, 'HH:mm'),
          description: editingRecord.description,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          startDate: dayjs(),
          endDate: dayjs(),
        });
      }
    }
  }, [visible, editingRecord, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const startDate = values.startDate.format('YYYY-MM-DD');
      const startTime = values.startTime.format('HH:mm');
      const endDate = values.endDate.format('YYYY-MM-DD');
      const endTime = values.endTime.format('HH:mm');
      
      // Calculate working hours
      const start = dayjs(`${startDate} ${startTime}`);
      const end = dayjs(`${endDate} ${endTime}`);
      const hours = end.diff(start, 'minute') / 60;
      
      if (hours < 0) {
        message.error(t('endTimeError'));
        return;
      }
      
      const newRecord: WorkRecord = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
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

  // Choose the right locale for the DatePicker
  const datePickerLocale = i18n.language === 'zh-CN' ? locale : undefined;

  return (
    <Modal
      title={editingRecord ? t('editRecord') : t('addRecord')}
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
            <DatePicker locale={datePickerLocale} className="w-full" />
          </Form.Item>
          <Form.Item
            name="startTime"
            label={t('startTime')}
            rules={[{ required: true, message: t('pleaseSelectStartTime') }]}
          >
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            name="endDate"
            label={t('endDate')}
            rules={[{ required: true, message: t('pleaseSelectEndDate') }]}
          >
            <DatePicker locale={datePickerLocale} className="w-full" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label={t('endTime')}
            rules={[{ required: true, message: t('pleaseSelectEndTime') }]}
          >
            <TimePicker format="HH:mm" className="w-full" />
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
            {editingRecord ? t('save') : t('add')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default WorkRecordForm; 